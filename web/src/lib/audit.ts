import { db } from "@/lib/db"
import { auditLogs } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

type SecurityEventType =
  | "PASSWORD_RESET_REQUESTED"
  | "PASSWORD_RESET_COMPLETED"
  | "PASSWORD_CHANGE_FAILED"
  | "PASSWORD_CHANGE_COMPLETED"
  | "SESSIONS_REVOKED"
  | "UNAUTHORIZED_ACCESS_ATTEMPT"
  | "PROFILE_UPDATED"

interface SecurityEvent {
  type: SecurityEventType
  userId: string
  ip?: string
  userAgent?: string
  metadata?: Record<string, unknown>
}

export function securityLog(event: Omit<SecurityEvent, "timestamp">): void {
  const timestamp = new Date().toISOString()
  const metadata = event.ip ? ` ip=${event.ip}` : ""

  switch (event.type) {
    case "PASSWORD_RESET_REQUESTED":
      console.log(
        `[SECURITY] Password reset requested for user ${event.userId}${metadata}`
      )
      break
    case "PASSWORD_RESET_COMPLETED":
      console.log(
        `[SECURITY] Password reset completed for user ${event.userId}${metadata}, ${timestamp}`
      )
      break
    case "PASSWORD_CHANGE_FAILED":
      console.log(
        `[SECURITY] Password change failed for user ${event.userId}${metadata}, ${timestamp}`
      )
      break
    case "PASSWORD_CHANGE_COMPLETED":
      console.log(
        `[SECURITY] Password change completed for user ${event.userId}${metadata}, ${timestamp}`
      )
      break
    case "SESSIONS_REVOKED":
      console.log(
        `[SECURITY] All sessions revoked for user ${event.userId}${metadata}, ${timestamp}`
      )
      break
    case "UNAUTHORIZED_ACCESS_ATTEMPT":
      console.log(
        `[SECURITY] Unauthorized access attempt by user ${event.userId}${metadata}, ${timestamp}`
      )
      break
    case "PROFILE_UPDATED":
      console.log(
        `[SECURITY] Profile updated for user ${event.userId}${metadata}, ${timestamp}`
      )
      break
  }

  persistAuditLog(event).catch((err) => {
    console.error("Failed to persist audit log:", err)
  })
}

async function persistAuditLog(event: Omit<SecurityEvent, "timestamp">): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      user_id: event.userId || null,
      action: event.type,
      ip_address: event.ip || null,
      user_agent: event.userAgent || null,
      metadata: event.metadata || null,
    })
  } catch (error) {
    console.error("Audit log insert failed:", error)
  }
}

export async function queryAuditLogs(options?: {
  userId?: string
  action?: SecurityEventType
  limit?: number
  offset?: number
}) {
  const { userId, action, limit = 50, offset = 0 } = options ?? {}

  let query = db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.created_at))
    .limit(limit)
    .offset(offset)

  if (userId) {
    query = query.where(eq(auditLogs.user_id, userId)) as typeof query
  }

  if (action) {
    query = query.where(eq(auditLogs.action, action)) as typeof query
  }

  return query
}