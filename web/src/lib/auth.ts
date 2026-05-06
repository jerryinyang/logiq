import { db } from "@/lib/db"
import { sessions, users } from "@/lib/db/schema"
import { eq, lt } from "drizzle-orm"
import { cookies } from "next/headers"
import { createHash, randomBytes } from "crypto"

const SESSION_COOKIE = "logiq_session"
const SESSION_DURATION_DAYS = 30

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex")
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000)

  await db.insert(sessions).values({
    user_id: userId,
    token: tokenHash,
    expires_at: expiresAt,
  })

  return token
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
  })
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const tokenHash = hashToken(token)

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, tokenHash))

  if (!session) return null
  if (new Date() > session.expires_at) {
    await db.delete(sessions).where(eq(sessions.token, tokenHash))
    return null
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      display_name: users.display_name,
      role: users.role,
      date_of_birth: users.date_of_birth,
      parental_consent: users.parental_consent,
      created_at: users.created_at,
      updated_at: users.updated_at,
    })
    .from(users)
    .where(eq(users.id, session.user_id))

  return user ?? null
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    const tokenHash = hashToken(token)
    await db.delete(sessions).where(eq(sessions.token, tokenHash))
  }
  cookieStore.delete(SESSION_COOKIE)
}

export async function cleanExpiredSessions(): Promise<void> {
  await db.delete(sessions).where(lt(sessions.expires_at, new Date()))
}