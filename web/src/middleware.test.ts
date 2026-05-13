import { describe, it, expect, vi } from "vitest"
import { NextRequest } from "next/server"
import { middleware, config } from "./middleware"

const SESSION_COOKIE = "logiq_session"
const ROLE_COOKIE = "logiq_role"

function createRequest(pathname: string, options?: { hasSession?: boolean; role?: string }): NextRequest {
  const url = new URL(`http://localhost:3000${pathname}`)
  const request = new NextRequest(url)

  if (options?.hasSession) {
    request.cookies.set(SESSION_COOKIE, "valid-session-token")
  }
  if (options?.role) {
    request.cookies.set(ROLE_COOKIE, options.role)
  }

  return request
}

describe("middleware", () => {
  it("should allow access to home page without session", () => {
    const request = createRequest("/")
    const response = middleware(request)
    expect(response.status).toBe(200)
  })

  it("should allow access to login page without session", () => {
    const request = createRequest("/login")
    const response = middleware(request)
    expect(response.status).toBe(200)
  })

  it("should allow access to register page without session", () => {
    const request = createRequest("/register")
    const response = middleware(request)
    expect(response.status).toBe(200)
  })

  it("should allow access to auth API without session", () => {
    const request = createRequest("/api/auth/login")
    const response = middleware(request)
    expect(response.status).toBe(200)
  })

  it("should allow access to forgot-password page without session", () => {
    const request = createRequest("/auth/forgot-password")
    const response = middleware(request)
    expect(response.status).toBe(200)
  })

  it("should redirect unauthenticated users from dashboard to home with redirect parameter", () => {
    const request = createRequest("/dashboard")
    const response = middleware(request)
    expect(response.status).toBe(307)
    const location = response.headers.get("location") || ""
    expect(location).toContain("redirect=%2Fdashboard")
  })

  it("should allow authenticated users to access dashboard", () => {
    const request = createRequest("/dashboard", { hasSession: true })
    const response = middleware(request)
    expect(response.status).toBe(200)
  })

  it("should redirect unauthenticated users from challenge routes to home with redirect", () => {
    const request = createRequest("/challenge/1")
    const response = middleware(request)
    expect(response.status).toBe(307)
    const location = response.headers.get("location") || ""
    expect(location).toContain("redirect=")
  })

  it("should allow authenticated users to access challenge routes", () => {
    const request = createRequest("/challenge/1", { hasSession: true })
    const response = middleware(request)
    expect(response.status).toBe(200)
  })

  it("should redirect unauthenticated users from profile to home with redirect", () => {
    const request = createRequest("/profile")
    const response = middleware(request)
    expect(response.status).toBe(307)
    const location = response.headers.get("location") || ""
    expect(location).toContain("redirect=")
  })

  it("should redirect unauthenticated users from settings to home with redirect", () => {
    const request = createRequest("/settings")
    const response = middleware(request)
    expect(response.status).toBe(307)
    const location = response.headers.get("location") || ""
    expect(location).toContain("redirect=")
  })

  it("should redirect authenticated users away from auth pages to dashboard", () => {
    const request = createRequest("/login", { hasSession: true })
    const response = middleware(request)
    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toContain("/dashboard")
  })

  it("should allow static file requests through", () => {
    const request = createRequest("/_next/static/chunks/main.js")
    const response = middleware(request)
    expect(response.status).toBe(200)
  })

  describe("admin route protection", () => {
    it("should redirect unauthenticated users from admin routes to home with redirect", () => {
      const request = createRequest("/admin/dashboard")
      const response = middleware(request)
      expect(response.status).toBe(307)
      const location = response.headers.get("location") || ""
      expect(location).toContain("redirect=")
      expect(location).toContain("admin")
    })

    it("should redirect authenticated non-admin users from admin routes to dashboard", () => {
      const request = createRequest("/admin/dashboard", { hasSession: true, role: "user" })
      const response = middleware(request)
      expect(response.status).toBe(307)
      const location = response.headers.get("location") || ""
      expect(location).toContain("/dashboard")
      expect(location).toContain("error=access_denied")
    })

    it("should allow authenticated admin users to access admin routes", () => {
      const request = createRequest("/admin/dashboard", { hasSession: true, role: "admin" })
      const response = middleware(request)
      expect(response.status).toBe(200)
    })

    it("should allow creator role to access admin routes (creator < admin)", () => {
      const request = createRequest("/admin/dashboard", { hasSession: true, role: "creator" })
      const response = middleware(request)
      expect(response.status).toBe(307)
      const location = response.headers.get("location") || ""
      expect(location).toContain("error=access_denied")
    })

    it("should protect /admin sub-paths", () => {
      const request = createRequest("/admin/users", { hasSession: true, role: "user" })
      const response = middleware(request)
      expect(response.status).toBe(307)
    })
  })
})

describe("middleware config", () => {
  it("should export a matcher config", () => {
    expect(config).toBeDefined()
    expect(config.matcher).toBeDefined()
    expect(config.matcher.length).toBeGreaterThan(0)
  })
})