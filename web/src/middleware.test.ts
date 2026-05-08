import { describe, it, expect, vi } from "vitest"
import { NextRequest } from "next/server"
import { middleware, config } from "./middleware"

const SESSION_COOKIE = "logiq_session"

function createRequest(pathname: string, hasSession: boolean = false): NextRequest {
  const url = new URL(`http://localhost:3000${pathname}`)
  const request = new NextRequest(url)

  if (hasSession) {
    request.cookies.set(SESSION_COOKIE, "valid-session-token")
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

  it("should redirect unauthenticated users from dashboard to login", () => {
    const request = createRequest("/dashboard", false)
    const response = middleware(request)
    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toContain("/login")
    expect(response.headers.get("location")).toContain("redirect=")
  })

  it("should allow authenticated users to access dashboard", () => {
    const request = createRequest("/dashboard", true)
    const response = middleware(request)
    expect(response.status).toBe(200)
  })

  it("should redirect unauthenticated users from challenge routes to login", () => {
    const request = createRequest("/challenge/1", false)
    const response = middleware(request)
    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toContain("/login")
  })

  it("should allow authenticated users to access challenge routes", () => {
    const request = createRequest("/challenge/1", true)
    const response = middleware(request)
    expect(response.status).toBe(200)
  })

  it("should redirect unauthenticated users from profile to login", () => {
    const request = createRequest("/profile", false)
    const response = middleware(request)
    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toContain("/login")
  })

  it("should redirect unauthenticated users from settings to login", () => {
    const request = createRequest("/settings", false)
    const response = middleware(request)
    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toContain("/login")
  })

  it("should redirect authenticated users away from auth pages to dashboard", () => {
    const request = createRequest("/login", true)
    const response = middleware(request)
    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toContain("/dashboard")
  })

  it("should allow static file requests through", () => {
    const request = createRequest("/_next/static/chunks/main.js")
    const response = middleware(request)
    expect(response.status).toBe(200)
  })
})

describe("middleware config", () => {
  it("should export a matcher config", () => {
    expect(config).toBeDefined()
    expect(config.matcher).toBeDefined()
    expect(config.matcher.length).toBeGreaterThan(0)
  })
})
