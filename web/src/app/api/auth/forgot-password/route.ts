import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, passwordResetTokens } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { randomBytes, createHash } from "crypto"
import { forgotPasswordSchema } from "@/lib/validations/auth"
import { checkRateLimit } from "@/lib/rate-limit"
import { sendPasswordResetEmail, buildPasswordResetUrl } from "@/lib/email"

const TOKEN_TTL_HOURS = 1

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
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
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  }

  const parsed = forgotPasswordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          "If an account exists with this email, you'll receive a reset link",
      },
      { status: 200 },
    )
  }

  const { email } = parsed.data
  const normalizedEmail = email.toLowerCase().trim()

  const rateLimitKey = `forgot-password:${normalizedEmail}`
  const { allowed } = checkRateLimit(rateLimitKey)

  if (!allowed) {
    return NextResponse.json(
      {
        message:
          "If an account exists with this email, you'll receive a reset link",
      },
      { status: 200 },
    )
  }

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))

  if (user) {
    const token = randomBytes(32).toString("hex")
    const tokenHash = hashToken(token)
    const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000)

    await db.delete(passwordResetTokens).where(
      eq(passwordResetTokens.user_id, user.id),
    )

    await db.insert(passwordResetTokens).values({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
    })

    const resetUrl = buildPasswordResetUrl(token)

    try {
      await sendPasswordResetEmail(normalizedEmail, resetUrl)
    } catch (error) {
      console.error("Failed to send password reset email:", error)
    }
  }

  return NextResponse.json(
    {
      message:
        "If an account exists with this email, you'll receive a reset link",
    },
    { status: 200 },
  )
}
