import { NextResponse } from "next/server"
import { clearSession } from "@/lib/auth"

export async function POST() {
  try {
    await clearSession()

    const response = NextResponse.json({ success: true })

    response.cookies.set("logiq_role", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production" || process.env.FORCE_SECURE_COOKIE === "true",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error("Sign-out error:", error)
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 },
    )
  }
}
