type SecurityEventType =
  | "PASSWORD_RESET_REQUESTED"
  | "PASSWORD_RESET_COMPLETED"
  | "SESSIONS_REVOKED"

interface SecurityEvent {
  type: SecurityEventType
  userId: string
  ip?: string
  timestamp: string
}

export function securityLog(event: Omit<SecurityEvent, "timestamp">): void {
  const logEntry: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  }

  const metadata = event.ip ? ` ip=${event.ip}` : ""

  switch (logEntry.type) {
    case "PASSWORD_RESET_REQUESTED":
      console.log(
        `[SECURITY] Password reset requested for user ${logEntry.userId}${metadata}`
      )
      break
    case "PASSWORD_RESET_COMPLETED":
      console.log(
        `[SECURITY] Password reset completed for user ${logEntry.userId}${metadata}, ${logEntry.timestamp}`
      )
      break
    case "SESSIONS_REVOKED":
      console.log(
        `[SECURITY] All sessions revoked for user ${logEntry.userId}${metadata}, ${logEntry.timestamp}`
      )
      break
  }
}
