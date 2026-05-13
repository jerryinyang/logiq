import { describe, it, expect, vi, beforeEach } from "vitest"
import { POST } from "./route"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import * as auth from "@/lib/auth"
import * as rateLimit from "@/lib/rate-limit"

vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn(),
    transaction: vi.fn(),
  },
}))

vi.mock("bcryptjs", () => ({
  default: { compare: vi.fn() },
  compare: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({
  createSession: vi.fn(),
  setSessionCookie: vi.fn(),
  getCsrfCookieName: vi.fn(() => "logiq_csrf"),
  generateCsrfToken: vi.fn(() => "test-csrf-token"),
  hashCsrfToken: vi.fn(() => "test-csrf-hash"),
}))

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true, remaining: 4 })),
}))

const mockUser = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "john@example.com",
  display_name: "John Doe",
  password_hash: "$2a$12$hashed_password",
  role: "user",
  created_at: new Date(),
  updated_at: new Date(),
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createSelectMock(result: any) {
  return vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue(result ? [result] : []),
      }),
    }),
  })
}

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(rateLimit.checkRateLimit as ReturnType<typeof vi.fn>).mockReturnValue({ allowed: true, remaining: 4 })
  })

  it("should authenticate valid credentials and return user data", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(createSelectMock(mockUser))
    ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true)
    ;(auth.createSession as ReturnType<typeof vi.fn>).mockResolvedValue("session-token")
    ;(auth.setSessionCookie as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "john@example.com",
        password: "MyPassword1!",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.user.email).toBe("john@example.com")
    expect(data.user.displayName).toBe("John Doe")
    expect(data.user.role).toBe("user")
    expect(bcrypt.compare).toHaveBeenCalledWith("MyPassword1!", mockUser.password_hash)
    expect(auth.createSession).toHaveBeenCalledWith(mockUser.id, 30)
    expect(auth.setSessionCookie).toHaveBeenCalledWith("session-token", 30)
  })

  it("should extend session to 90 days when rememberMe is true", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(createSelectMock(mockUser))
    ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true)
    ;(auth.createSession as ReturnType<typeof vi.fn>).mockResolvedValue("session-token-90")
    ;(auth.setSessionCookie as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "john@example.com",
        password: "MyPassword1!",
        rememberMe: true,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(auth.createSession).toHaveBeenCalledWith(mockUser.id, 90)
    expect(auth.setSessionCookie).toHaveBeenCalledWith("session-token-90", 90)
  })

  it("should return 401 for incorrect password with generic message", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(createSelectMock(mockUser))
    ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(false)

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "john@example.com",
        password: "WrongPassword1!",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.message).toBe("Invalid email or password")
    expect(auth.createSession).not.toHaveBeenCalled()
  })

  it("should return 401 for non-existent email with generic message", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(createSelectMock(null))

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "nonexistent@example.com",
        password: "MyPassword1!",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.message).toBe("Invalid email or password")
    expect(auth.createSession).not.toHaveBeenCalled()
  })

  it("should return 429 when rate limited", async () => {
    ;(rateLimit.checkRateLimit as ReturnType<typeof vi.fn>).mockReturnValue({ allowed: false, remaining: 0, retryAfterSeconds: 45 })

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "john@example.com",
        password: "MyPassword1!",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(429)
    expect(data.message).toContain("Too many requests")
  })

  it("should return 400 for invalid input", async () => {
    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "not-an-email",
        password: "",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.errors).toBeDefined()
    expect(data.errors.length).toBeGreaterThan(0)
  })

  it("should return 400 for malformed JSON body", async () => {
    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json{",
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe("Invalid request body. Please send valid JSON.")
  })

  it("should return 400 for missing fields", async () => {
    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it("should handle server errors gracefully", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error("DB connection failed")
    })

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "john@example.com",
        password: "MyPassword1!",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.message).toBe("An unexpected error occurred. Please try again.")
  })

  it("should handle user with no password_hash (OAuth-only user)", async () => {
    const oauthUser = { ...mockUser, password_hash: null }
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(createSelectMock(oauthUser))

    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "oauth@example.com",
        password: "AnyPassword1!",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.message).toBe("Invalid email or password")
    expect(auth.createSession).not.toHaveBeenCalled()
  })
})
