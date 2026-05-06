import { describe, it, expect, vi, beforeEach } from "vitest"
import { POST } from "./route"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import * as auth from "@/lib/auth"
import * as rateLimit from "@/lib/rate-limit"

vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    transaction: vi.fn(),
  },
}))

vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn() },
  hash: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({
  createSession: vi.fn(),
  setSessionCookie: vi.fn(),
}))

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true, remaining: 4 })),
}))

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(rateLimit.checkRateLimit as ReturnType<typeof vi.fn>).mockReturnValue({ allowed: true, remaining: 4 })
  })

  it("should register a new user and return success", async () => {
    const mockUser = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      email: "john@example.com",
      display_name: "John Doe",
      password_hash: "hashed_password",
      role: "user",
      created_at: new Date(),
      updated_at: new Date(),
    }

    ;(db.transaction as ReturnType<typeof vi.fn>).mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => {
      const tx = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([]),
            }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockUser]),
          }),
        }),
      }
      return fn(tx)
    })
    ;(bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue("hashed_password")
    ;(auth.createSession as ReturnType<typeof vi.fn>).mockResolvedValue("session-token")
    ;(auth.setSessionCookie as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)

    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "john@example.com",
        password: "StrongPass1!",
        confirmPassword: "StrongPass1!",
        displayName: "John Doe",
        parentalConsent: true,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.user.email).toBe("john@example.com")
    expect(data.user.displayName).toBe("John Doe")
    expect(data.user.role).toBe("user")
    expect(bcrypt.hash).toHaveBeenCalledWith("StrongPass1!", 12)
    expect(auth.createSession).toHaveBeenCalledWith(mockUser.id)
    expect(auth.setSessionCookie).toHaveBeenCalledWith("session-token")
  })

  it("should return 409 for duplicate email via transaction", async () => {
    ;(db.transaction as ReturnType<typeof vi.fn>).mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => {
      const tx = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([{ id: "existing-id" }]),
            }),
          }),
        }),
        insert: vi.fn(),
      }
      return fn(tx)
    })

    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "existing@example.com",
        password: "StrongPass1!",
        confirmPassword: "StrongPass1!",
        displayName: "Existing User",
        parentalConsent: true,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data.message).toBe("An account with this email already exists")
  })

  it("should return 400 for invalid input", async () => {
    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "not-an-email",
        password: "short",
        displayName: "",
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
    const request = new Request("http://localhost:3000/api/auth/register", {
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
    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it("should handle unique constraint error as 409", async () => {
    const uniqueError = new Error("duplicate key") as Error & { code: string }
    uniqueError.code = "23505"

    ;(db.transaction as ReturnType<typeof vi.fn>).mockRejectedValue(uniqueError)

    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "john@example.com",
        password: "StrongPass1!",
        confirmPassword: "StrongPass1!",
        displayName: "John Doe",
        parentalConsent: true,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data.message).toBe("An account with this email already exists")
  })

  it("should handle server errors gracefully", async () => {
    ;(db.transaction as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("DB connection failed"))

    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "john@example.com",
        password: "StrongPass1!",
        confirmPassword: "StrongPass1!",
        displayName: "John Doe",
        parentalConsent: true,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.message).toBe("An unexpected error occurred. Please try again.")
  })

  it("should return 429 when rate limited", async () => {
    ;(rateLimit.checkRateLimit as ReturnType<typeof vi.fn>).mockReturnValue({ allowed: false, remaining: 0, retryAfterSeconds: 45 })

    const request = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "john@example.com",
        password: "StrongPass1!",
        confirmPassword: "StrongPass1!",
        displayName: "John Doe",
        parentalConsent: true,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(429)
    expect(data.message).toContain("Too many requests")
  })
})