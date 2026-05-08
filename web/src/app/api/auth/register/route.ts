import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { registerApiSchema } from "@/lib/validations/auth"
import { createSession, setSessionCookie } from "@/lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"

const BCRYPT_COST_FACTOR = 12

function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Error && "code" in error && (error as { code: string }).code === "23505"
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown"
    const rateResult = checkRateLimit(`register:${ip}`)

    if (!rateResult.allowed) {
      const retryAfter = "retryAfterSeconds" in rateResult ? String(rateResult.retryAfterSeconds) : "60"
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": retryAfter } },
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body. Please send valid JSON." },
        { status: 400 },
      )
    }

    const parsed = registerApiSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }))
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const { email, password, displayName, dateOfBirth, parentalConsent } = parsed.data

    const result = await db.transaction(async (tx) => {
      const [existingUser] = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (existingUser) {
        return { status: 409, data: { success: false, message: "An account with this email already exists" } }
      }

      const passwordHash = await bcrypt.hash(password, BCRYPT_COST_FACTOR)

      const [newUser] = await tx
        .insert(users)
        .values({
          email,
          password_hash: passwordHash,
          display_name: displayName,
          role: "user",
          date_of_birth: dateOfBirth ?? null,
          parental_consent: parentalConsent ?? null,
        })
        .returning()

      return { status: 200, data: { success: true, user: { id: newUser.id, email: newUser.email, displayName: newUser.display_name, role: newUser.role } } }
    })

    if (result.status === 409) {
      return NextResponse.json(result.data, { status: 409 })
    }

    const user = (result.data as { success: true, user: { id: string } }).user
    const token = await createSession(user.id)
    await setSessionCookie(token)

    return NextResponse.json(result.data)
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists" },
        { status: 409 },
      )
    }
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 },
    )
  }
}