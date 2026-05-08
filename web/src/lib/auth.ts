import { db } from "@/lib/db"
import { sessions, users } from "@/lib/db/schema"
import { eq, lt } from "drizzle-orm"
import { cookies } from "next/headers"
import { createHmac, randomBytes } from "crypto"

const SESSION_COOKIE = "logiq_session"
const CSRF_COOKIE = "logiq_csrf"
const SESSION_DURATION_DAYS = 30
const MAX_SESSIONS_PER_USER = 5
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-in-production"

function hashToken(token: string): string {
  return createHmac("sha256", SESSION_SECRET).update(token).digest("hex")
}

export async function createSession(userId: string, days: number = SESSION_DURATION_DAYS): Promise<string> {
  if (!userId) throw new Error("userId is required")
  if (days <= 0) throw new Error("days must be positive")

  const token = randomBytes(32).toString("hex")
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

  const existingSessions = await db
    .select({ token: sessions.token, expires_at: sessions.expires_at })
    .from(sessions)
    .where(eq(sessions.user_id, userId))

  if (existingSessions.length >= MAX_SESSIONS_PER_USER) {
    existingSessions.sort((a, b) => a.expires_at.getTime() - b.expires_at.getTime())
    const toDeleteCount = existingSessions.length - MAX_SESSIONS_PER_USER + 1
    for (let i = 0; i < toDeleteCount; i++) {
      await db.delete(sessions).where(eq(sessions.token, existingSessions[i].token))
    }
  }

  await db.insert(sessions).values({
    user_id: userId,
    token: tokenHash,
    expires_at: expiresAt,
  })

  return token
}

export async function setSessionCookie(token: string, days: number = SESSION_DURATION_DAYS): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || process.env.FORCE_SECURE_COOKIE === "true",
    sameSite: "lax",
    path: "/",
    maxAge: days * 24 * 60 * 60,
  })
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const tokenHash = hashToken(token)

  const results = await db
    .select({
      id: users.id,
      email: users.email,
      display_name: users.display_name,
      role: users.role,
      date_of_birth: users.date_of_birth,
      parental_consent: users.parental_consent,
      created_at: users.created_at,
      updated_at: users.updated_at,
      session_expires_at: sessions.expires_at,
      session_token: sessions.token,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.user_id))
    .where(eq(sessions.token, tokenHash))

  if (results.length === 0) return null

  const row = results[0]
  if (new Date() > row.session_expires_at) {
    await db.delete(sessions).where(eq(sessions.token, tokenHash))
    return null
  }

  const { session_expires_at: _, session_token: __, ...user } = row
  return user
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

export async function revokeUserSessions(userId: string): Promise<void> {
  if (!userId) throw new Error("userId is required")
  await db.delete(sessions).where(eq(sessions.user_id, userId))
}

export async function cleanExpiredSessions(): Promise<void> {
  await db.delete(sessions).where(lt(sessions.expires_at, new Date()))
}

export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex")
}

export function hashCsrfToken(token: string): string {
  return hashToken(token)
}

export function getCsrfCookieName(): string {
  return CSRF_COOKIE
}