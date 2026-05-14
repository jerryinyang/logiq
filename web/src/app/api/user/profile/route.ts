import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { updateDisplayNameApiSchema } from "@/lib/validations/profile"
import { checkRateLimit } from "@/lib/rate-limit"
import { securityLog } from "@/lib/audit"

export async function PATCH(request: Request) {
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

    const rateResult = checkRateLimit(`profile-update:${user.id}`)
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

    const parsed = updateDisplayNameApiSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }))
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const { displayName } = parsed.data

    const [updated] = await db
      .update(users)
      .set({
        display_name: displayName,
        updated_at: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning({
        id: users.id,
        email: users.email,
        display_name: users.display_name,
        role: users.role,
      })

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      )
    }

    securityLog({
      type: "PROFILE_UPDATED" as const,
      userId: user.id,
      ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        displayName: updated.display_name,
        role: updated.role,
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 },
    )
  }
}