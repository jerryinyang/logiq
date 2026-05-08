import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, passwordResetTokens } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { createHash } from "crypto"
import bcrypt from "bcryptjs"
import { resetPasswordSchema } from "@/lib/validations/auth"
import { revokeUserSessions } from "@/lib/auth"
import { hashResetToken } from "@/lib/auth/tokens"

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

  if (!token || typeof token !== "string" || token.length < 1) {
    return NextResponse.json(
      { message: "Invalid or expired reset link" },
      { status: 400 },
    )
  }

  const parsed = resetPasswordSchema.safeParse(body)
  if (!parsed.success) {
    const errors = parsed.error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }))
    return NextResponse.json({ message: "Validation failed", errors }, { status: 422 })
  }

  const tokenHash = hashResetToken(token)
  const { password } = parsed.data
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST)

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
        await tx
          .delete(passwordResetTokens)
          .where(eq(passwordResetTokens.id, resetRecord.id))
        throw new Error("EXPIRED_TOKEN")
      }

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

      userId = resetRecord.user_id
    })
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_TOKEN") {
      return NextResponse.json(
        { message: "Invalid or expired reset link" },
        { status: 400 },
      )
    }
    if (error instanceof Error && error.message === "EXPIRED_TOKEN") {
      return NextResponse.json(
        { message: "Invalid or expired reset link" },
        { status: 400 },
      )
    }
    throw error
  }

  try {
    await revokeUserSessions(userId!)
  } catch (error) {
    console.error("Failed to revoke sessions after password reset:", error)
  }

  return NextResponse.json(
    { message: "Password reset successfully. Please log in with your new password." },
    { status: 200 },
  )
}