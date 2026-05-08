import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getAuthorizationUrl, getOAuthProviders } from "@/lib/auth/oauth"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  try {
    const { provider } = await params

    const providers = getOAuthProviders()

    if (!providers[provider]) {
      return NextResponse.redirect(
        new URL("/auth/error?error=unknown_provider", _request.url),
      )
    }

    const config = providers[provider]
    if (!config.clientId || !config.clientSecret) {
      console.error(`OAuth provider ${provider} not configured (missing credentials)`)
      return NextResponse.redirect(
        new URL("/auth/error?error=provider_not_configured", _request.url),
      )
    }

    const { url, state, cookieName } = getAuthorizationUrl(provider)

    const cookieStore = await cookies()
    cookieStore.set(cookieName, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    })

    return NextResponse.redirect(url)
  } catch (error) {
    console.error("OAuth initiation error:", error)
    return NextResponse.redirect(
      new URL("/auth/error?error=initiation_failed", _request.url),
    )
  }
}
