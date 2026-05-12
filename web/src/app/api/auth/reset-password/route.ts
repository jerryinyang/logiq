import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, passwordResetTokens } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { resetPasswordSchema } from "@/lib/validations/auth"
import { revokeUserSessions, SESSION_COOKIE } from "@/lib/auth"
import { hashResetToken } from "@/lib/auth/tokens"
import { securityLog } from "@/lib/audit"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token || token.length < 1) {
    return NextResponse.json({ valid: false }, { status: 400 })
  }

  const tokenHash = hashResetToken(token)

  const [record] = await db
    .select({
      id: passwordResetTokens.id,
      expires_at: passwordResetTokens.expires_at,
    })
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token_hash, tokenHash))
    .limit(1)

  if (!record) {
    return NextResponse.json({ valid: false }, { status: 200 })
  }

  if (new Date() > record.expires_at) {
    return NextResponse.json({ valid: false }, { status: 200 })
  }

  return NextResponse.json({ valid: true }, { status: 200 })
}

const BCRYPT_COST = 12

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
  }

  const token = typeof (body as Record<string, unknown>).token === "string"
    ? (body as Record<string, unknown>).token as string
    : null

  if (!token || token.length < 1) {
    return NextResponse.json(
      { message: "Invalid or expired reset link" },
      { status: 400 },
    )
  }

  const parsed = resetPasswordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid or expired reset link" },
      { status: 400 },
    )
  }

  const tokenHash = hashResetToken(token)
  const { password } = parsed.data

  let userId: string | null = null

  try {
    await db.transaction(async (tx) => {
      const [resetRecord] = await tx
        .select({
          id: passwordResetTokens.id,
          user_id: passwordResetTokens.user_id,
          expires_at: passwordResetTokens.expires_at,
        })
        .from(passwordResetTokens)
        .where(eq(passwordResetTokens.token_hash, tokenHash))
        .limit(1)

      if (!resetRecord) {
        throw new Error("INVALID_TOKEN")
      }

      if (new Date() > resetRecord.expires_at) {
        throw new Error("EXPIRED_TOKEN")
      }

      const passwordHash = await bcrypt.hash(password, BCRYPT_COST)

      await tx
        .update(users)
        .set({
          password_hash: passwordHash,
          updated_at: new Date(),
        })
        .where(eq(users.id, resetRecord.user_id))

      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, resetRecord.id))

      await revokeUserSessions(resetRecord.user_id, tx)

      userId = resetRecord.user_id
    })

    securityLog({
      type: "SESSIONS_REVOKED",
      userId: userId!,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_TOKEN") {
      return NextResponse.json(
        { message: "Invalid or expired reset link" },
        { status: 400 },
      )
    }
    if (error instanceof Error && error.message === "EXPIRED_TOKEN") {
      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token_hash, tokenHash))
      return NextResponse.json(
        { message: "Invalid or expired reset link" },
        { status: 400 },
      )
    }
    throw error
  }

  securityLog({
    type: "PASSWORD_RESET_COMPLETED",
    userId: userId!,
  })

  const response = NextResponse.json(
    { message: "Password reset successfully. Please log in with your new password." },
    { status: 200 },
  )

  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || process.env.FORCE_SECURE_COOKIE === "true",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return response
}