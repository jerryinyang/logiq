import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { users, oauthAccounts } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { createHash } from "crypto"
import { exchangeCode, fetchProfile, encryptAccessToken, getStateCookieName, getOAuthProviders } from "@/lib/auth/oauth"
import { createSession, setSessionCookie } from "@/lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  try {
    const { provider } = await params
    const url = new URL(_request.url)

    const providers = getOAuthProviders()

    if (!providers[provider]) {
      return NextResponse.redirect(
        new URL("/auth/error?error=unknown_provider", _request.url),
      )
    }

    const ip = _request.headers.get("x-forwarded-for") ?? _request.headers.get("x-real-ip") ?? "unknown"
    const rateResult = checkRateLimit(`oauth-callback:${ip}`)
    if (!rateResult.allowed) {
      return NextResponse.redirect(
        new URL("/auth/error?error=rate_limited", _request.url),
      )
    }

    const code = url.searchParams.get("code")
    const stateParam = url.searchParams.get("state")

    if (!code || !stateParam) {
      console.warn("OAuth callback missing code or state", { provider })
      return NextResponse.redirect(
        new URL("/auth/error?error=invalid_request", _request.url),
      )
    }

    const cookieStore = await cookies()
    const cookieName = getStateCookieName(provider)
    const storedState = cookieStore.get(cookieName)?.value

    if (!storedState) {
      console.warn("OAuth callback missing stored state (possible CSRF)", { provider })
      return NextResponse.redirect(
        new URL("/auth/error?error=csrf_detected", _request.url),
      )
    }

    cookieStore.delete(cookieName)

    const stateHash = createHash("sha256").update(storedState).digest("hex")

    if (stateParam !== stateHash) {
      console.warn("OAuth state mismatch (possible CSRF)", { provider })
      return NextResponse.redirect(
        new URL("/auth/error?error=csrf_detected", _request.url),
      )
    }

    let tokenData
    try {
      tokenData = await exchangeCode(provider, code)
    } catch (exchangeError) {
      console.error("OAuth token exchange failed:", exchangeError)
      return NextResponse.redirect(
        new URL("/auth/error?error=token_exchange_failed", _request.url),
      )
    }

    let profile
    try {
      profile = await fetchProfile(provider, tokenData.access_token)
    } catch (profileError) {
      console.error("OAuth profile fetch failed:", profileError)
      return NextResponse.redirect(
        new URL("/auth/error?error=profile_fetch_failed", _request.url),
      )
    }

    if (!profile.email) {
      console.warn("OAuth profile missing email", { provider, profileId: profile.id })
      return NextResponse.redirect(
        new URL("/auth/error?error=email_required", _request.url),
      )
    }

    const normalizedEmail = profile.email.toLowerCase()

    const [existingAccount] = await db
      .select()
      .from(oauthAccounts)
      .where(
        and(
          eq(oauthAccounts.provider, provider),
          eq(oauthAccounts.provider_account_id, profile.id),
        ),
      )
      .limit(1)

    if (existingAccount) {
      const token = await createSession(existingAccount.user_id)
      await setSessionCookie(token)

      console.info("OAuth login successful (existing account link)", {
        provider,
        userId: existingAccount.user_id,
      })

      return NextResponse.redirect(new URL("/dashboard", _request.url))
    }

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1)

    let userId: string

    if (existingUser) {
      userId = existingUser.id
      console.info("Linking OAuth account to existing user", {
        provider,
        userId,
        email: normalizedEmail,
      })
    } else {
      const [newUser] = await db
        .insert(users)
        .values({
          email: normalizedEmail,
          display_name: profile.displayName || normalizedEmail.split("@")[0],
          role: "user",
        })
        .returning()

      userId = newUser.id
      console.info("New user created via OAuth", {
        provider,
        userId,
        email: normalizedEmail,
      })
    }

    await db.insert(oauthAccounts).values({
      user_id: userId,
      provider,
      provider_account_id: profile.id,
      access_token: encryptAccessToken(tokenData.access_token),
      refresh_token: tokenData.refresh_token
        ? encryptAccessToken(tokenData.refresh_token)
        : null,
      expires_at: tokenData.expires_in
        ? new Date(Date.now() + tokenData.expires_in * 1000)
        : null,
    })

    const token = await createSession(userId)
    await setSessionCookie(token)

    console.info("OAuth login successful", { provider, userId, isNewUser: !existingUser })

    return NextResponse.redirect(new URL("/dashboard", _request.url))
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.redirect(
      new URL("/auth/error?error=callback_failed", _request.url),
    )
  }
}
