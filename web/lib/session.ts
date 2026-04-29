// Session management with 48-hour inactivity timeout

const SESSION_KEY = 'logiq_session'
const USER_KEY = 'logiq_user'
const INACTIVITY_TIMEOUT = 48 * 60 * 60 * 1000 // 48 hours in milliseconds

export interface StoredUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
}

export interface Session {
  user: StoredUser
  lastActivity: number
  expiresAt: number
}

export function saveSession(user: StoredUser): void {
  if (typeof window === 'undefined') return
  
  const now = Date.now()
  const session: Session = {
    user,
    lastActivity: now,
    expiresAt: now + INACTIVITY_TIMEOUT,
  }
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  
  try {
    const sessionData = localStorage.getItem(SESSION_KEY)
    if (!sessionData) return null
    
    const session: Session = JSON.parse(sessionData)
    const now = Date.now()
    
    // Check if session has expired due to inactivity
    if (now > session.expiresAt) {
      clearSession()
      return null
    }
    
    return session
  } catch {
    return null
  }
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null
  
  try {
    const userData = localStorage.getItem(USER_KEY)
    if (!userData) return null
    
    // Verify session is still valid
    const session = getSession()
    if (!session) {
      localStorage.removeItem(USER_KEY)
      return null
    }
    
    return JSON.parse(userData)
  } catch {
    return null
  }
}

export function updateActivity(): void {
  if (typeof window === 'undefined') return
  
  try {
    const sessionData = localStorage.getItem(SESSION_KEY)
    if (!sessionData) return
    
    const session: Session = JSON.parse(sessionData)
    const now = Date.now()
    
    // Update last activity and extend expiration
    session.lastActivity = now
    session.expiresAt = now + INACTIVITY_TIMEOUT
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // Ignore errors
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isSessionValid(): boolean {
  const session = getSession()
  return session !== null
}

// Initialize activity tracking
export function initActivityTracking(): () => void {
  if (typeof window === 'undefined') return () => {}
  
  const events = ['mousedown', 'keydown', 'touchstart', 'scroll']
  let timeout: NodeJS.Timeout | null = null
  
  const handleActivity = () => {
    // Throttle updates to once per minute
    if (timeout) return
    
    updateActivity()
    
    timeout = setTimeout(() => {
      timeout = null
    }, 60000) // 1 minute throttle
  }
  
  events.forEach(event => {
    window.addEventListener(event, handleActivity, { passive: true })
  })
  
  // Return cleanup function
  return () => {
    events.forEach(event => {
      window.removeEventListener(event, handleActivity)
    })
    if (timeout) clearTimeout(timeout)
  }
}
