import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, passwordResetTokens } from "@/lib/db/schema"
import { eq, gt } from "drizzle-orm"
import { createHash } from "crypto"
import bcrypt from "bcryptjs"
import { resetPasswordSchema } from "@/lib/validations/auth"
import { revokeUserSessions } from "@/lib/auth"

const BCRYPT_COST = 12

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

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

  const tokenHash = hashToken(token)

  const [resetRecord] = await db
    .select({
      id: passwordResetTokens.id,
      user_id: passwordResetTokens.user_id,
      expires_at: passwordResetTokens.expires_at,
    })
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token_hash, tokenHash))

  if (!resetRecord) {
    return NextResponse.json(
      { message: "Invalid or expired reset link" },
      { status: 400 },
    )
  }

  if (new Date() > resetRecord.expires_at) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, resetRecord.id))
    return NextResponse.json(
      { message: "Invalid or expired reset link" },
      { status: 400 },
    )
  }

  const { password } = parsed.data
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST)

  await db.transaction(async (tx) => {
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
  })

  await revokeUserSessions(resetRecord.user_id)

  return NextResponse.json(
    { message: "Password reset successfully. Please log in with your new password." },
    { status: 200 },
  )
}
