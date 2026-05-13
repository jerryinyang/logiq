import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getSessionUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { changePasswordApiSchema } from "@/lib/validations/profile"
import { checkRateLimit, checkForgotPasswordRateLimit } from "@/lib/rate-limit"
import { securityLog } from "@/lib/audit"
import { sendPasswordChangeEmail } from "@/lib/email/password-change"

const BCRYPT_COST = 12

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      )
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? request.headers.get("x-real-ip")?.trim()
      ?? "unknown"

    const rateResult = checkForgotPasswordRateLimit(`change-password:${user.id}`)
    if (!rateResult.allowed) {
      const retryAfter = "retryAfterSeconds" in rateResult ? String(rateResult.retryAfterSeconds) : "3600"
      return NextResponse.json(
        { success: false, message: "Too many password change attempts. Please try again later." },
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

    const parsed = changePasswordApiSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }))
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const { currentPassword, newPassword } = parsed.data

    const [dbUser] = await db
      .select({
        id: users.id,
        email: users.email,
        password_hash: users.password_hash,
        display_name: users.display_name,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      )
    }

    if (!dbUser.password_hash) {
      return NextResponse.json(
        { success: false, message: "Cannot change password for OAuth-only accounts. Please use your provider to manage authentication." },
        { status: 400 },
      )
    }

    const currentPasswordValid = await bcrypt.compare(currentPassword, dbUser.password_hash)
    if (!currentPasswordValid) {
securityLog({
      type: "PASSWORD_CHANGE_FAILED" as const,
      userId: user.id,
      ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
    })

      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 },
      )
    }

    const newPasswordHash = await bcrypt.hash(newPassword, BCRYPT_COST)

    await db
      .update(users)
      .set({
        password_hash: newPasswordHash,
        updated_at: new Date(),
      })
      .where(eq(users.id, user.id))

    securityLog({
      type: "PASSWORD_CHANGE_COMPLETED" as const,
      userId: user.id,
      ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
    })

    try {
      await sendPasswordChangeEmail(dbUser.email, {
        displayName: dbUser.display_name,
      })
    } catch (emailError) {
      console.error("Failed to send password change email:", emailError)
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 },
    )
  }
}