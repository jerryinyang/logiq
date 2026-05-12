import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, passwordResetTokens } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { randomBytes } from "crypto"
import { forgotPasswordSchema } from "@/lib/validations/auth"
import { checkForgotPasswordRateLimit, checkRateLimit } from "@/lib/rate-limit"
import { sendPasswordResetEmail, buildPasswordResetUrl } from "@/lib/email"
import { hashResetToken } from "@/lib/auth/tokens"

const TOKEN_TTL_HOURS = 1

const GENERIC_SUCCESS = {
  message: "If an account exists with this email, you'll receive a reset link",
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(GENERIC_SUCCESS, { status: 200 })
  }

  const parsed = forgotPasswordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(GENERIC_SUCCESS, { status: 200 })
  }

  const { email } = parsed.data
  const normalizedEmail = email.toLowerCase().trim()

  const perIpResult = checkRateLimit(`forgot-password-ip:${ip}`)
  if (!perIpResult.allowed) {
    return NextResponse.json(GENERIC_SUCCESS, { status: 200 })
  }

  const perEmailResult = checkForgotPasswordRateLimit(`forgot-password:${normalizedEmail}`)
  if (!perEmailResult.allowed) {
    return NextResponse.json(GENERIC_SUCCESS, { status: 200 })
  }

  try {
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail))

    if (user) {
      const token = randomBytes(32).toString("hex")
      const tokenHash = hashResetToken(token)
      const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000)

      await db.transaction(async (tx) => {
        await tx
          .delete(passwordResetTokens)
          .where(eq(passwordResetTokens.user_id, user.id))
        await tx.insert(passwordResetTokens).values({
          user_id: user.id,
          token_hash: tokenHash,
          expires_at: expiresAt,
        })
      })

      const resetUrl = buildPasswordResetUrl(token)

      try {
        await sendPasswordResetEmail(normalizedEmail, resetUrl)
      } catch (error) {
        console.error("Failed to send password reset email:", error)
      }
    }
  } catch (error) {
    console.error("Forgot password error:", error)
  }

  return NextResponse.json(GENERIC_SUCCESS, { status: 200 })
}