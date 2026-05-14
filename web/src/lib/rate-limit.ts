const requestCounts = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60_000
const MAX_REQUESTS = 5

const FORGOT_PASSWORD_WINDOW_MS = 3_600_000
const FORGOT_PASSWORD_MAX_REQUESTS = 3
const forgotPasswordCounts = new Map<string, { count: number; resetAt: number }>()

function cleanup(): void {
  const now = Date.now()
  for (const [key, entry] of requestCounts) {
    if (now > entry.resetAt) {
      requestCounts.delete(key)
    }
  }
  for (const [key, entry] of forgotPasswordCounts) {
    if (now > entry.resetAt) {
      forgotPasswordCounts.delete(key)
    }
  }
}

export function checkRateLimit(key: string): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  const now = Date.now()
  cleanup()

  const entry = requestCounts.get(key)

  if (!entry || now > entry.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_REQUESTS - 1 }
  }

  entry.count++
  if (entry.count > MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, remaining: 0, retryAfterSeconds }
  }

  return { allowed: true, remaining: MAX_REQUESTS - entry.count }
}

export function checkForgotPasswordRateLimit(key: string): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  const now = Date.now()
  cleanup()

  const entry = forgotPasswordCounts.get(key)

  if (!entry || now > entry.resetAt) {
    forgotPasswordCounts.set(key, { count: 1, resetAt: now + FORGOT_PASSWORD_WINDOW_MS })
    return { allowed: true, remaining: FORGOT_PASSWORD_MAX_REQUESTS - 1 }
  }

  entry.count++
  if (entry.count > FORGOT_PASSWORD_MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, remaining: 0, retryAfterSeconds }
  }

  return { allowed: true, remaining: FORGOT_PASSWORD_MAX_REQUESTS - entry.count }
}

export function _resetForTesting(): void {
  requestCounts.clear()
  forgotPasswordCounts.clear()
}