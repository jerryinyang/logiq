import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { signInApiSchema } from "@/lib/validations/auth"
import { createSession, setSessionCookie, generateCsrfToken } from "@/lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"
import { createHash } from "crypto"

const CSRF_COOKIE = "logiq_csrf"
const DUMMY_BCRYPT_HASH = "$2a$12$" + "A".repeat(53)

function hashEmailForLog(email: string): string {
  return createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 8)
}

export async function POST(request: Request) {
  try {
    const rawIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? request.headers.get("x-real-ip")?.trim()
      ?? "unknown"
    const rateResult = checkRateLimit(`login:${rawIp}`)

    if (!rateResult.allowed) {
      const retryAfter = "retryAfterSeconds" in rateResult ? String(rateResult.retryAfterSeconds) : "60"
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": retryAfter } },
      )
    }

    let body: unknown
    try {
      const text = await request.text()
      if (text.length > 8192) {
        return NextResponse.json(
          { success: false, message: "Request body too large." },
          { status: 413 },
        )
      }
      body = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body. Please send valid JSON." },
        { status: 400 },
      )
    }

    const parsed = signInApiSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }))
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const { email, password, rememberMe } = parsed.data

    const csrfCookie = request.headers.get("cookie")?.match(new RegExp(`${CSRF_COOKIE}=([^;]+)`))?.[1]
    const csrfHeader = request.headers.get("x-csrf-token")
    if (csrfCookie && (!csrfHeader || csrfCookie !== csrfHeader)) {
      return NextResponse.json(
        { success: false, message: "Invalid CSRF token" },
        { status: 403 },
      )
    }

    const emailLower = email.toLowerCase()

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, emailLower))
      .limit(1)

    const passwordValid = user?.password_hash
      ? await bcrypt.compare(password, user.password_hash)
      : await bcrypt.compare(password, DUMMY_BCRYPT_HASH)

    if (!user || !user.password_hash || !passwordValid) {
      console.warn("Failed login attempt", { emailHash: hashEmailForLog(emailLower) })
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      )
    }

    const token = await createSession(user.id, rememberMe ? 90 : 30)
    await setSessionCookie(token, rememberMe ? 90 : 30)

    const newCsrf = generateCsrfToken()
    try {
      const csrfCookieStore = await cookies()
      csrfCookieStore.set(CSRF_COOKIE, newCsrf, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production" || process.env.FORCE_SECURE_COOKIE === "true",
        sameSite: "lax",
        path: "/",
        maxAge: rememberMe ? 90 * 24 * 60 * 60 : 30 * 24 * 60 * 60,
      })
    } catch {
      // Cookies API unavailable in test/non-request context — skip CSRF cookie
    }

    return NextResponse.json({
      success: true,
      csrfToken: newCsrf,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 },
    )
  }
}
