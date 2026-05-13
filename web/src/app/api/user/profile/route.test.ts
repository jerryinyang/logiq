import { describe, it, expect, vi, beforeEach } from "vitest"
import { PATCH, GET } from "./route"
import { db } from "@/lib/db"
import * as auth from "@/lib/auth"
import * as rateLimit from "@/lib/rate-limit"
import * as audit from "@/lib/audit"

vi.mock("@/lib/db", () => ({
  db: {
    update: vi.fn(),
    select: vi.fn(),
  },
}))

vi.mock("@/lib/auth", () => ({
  getSessionUser: vi.fn(),
}))

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true, remaining: 4 })),
}))

vi.mock("@/lib/audit", () => ({
  securityLog: vi.fn(),
}))

const mockUser = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "john@example.com",
  display_name: "John Doe",
  role: "user",
  date_of_birth: null,
  parental_consent: null,
  created_at: new Date(),
  updated_at: new Date(),
  session_expires_at: new Date(Date.now() + 86400000),
  session_token: "test-session-token",
}

describe("PATCH /api/user/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(rateLimit.checkRateLimit as ReturnType<typeof vi.fn>).mockReturnValue({ allowed: true, remaining: 4 })
  })

  it("should return 401 when not authenticated", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const request = new Request("http://localhost:3000/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: "New Name" }),
    })

    const response = await PATCH(request)
    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.message).toBe("Authentication required")
  })

  it("should update display name successfully", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)
    ;(db.update as ReturnType<typeof vi.fn>).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{
            id: mockUser.id,
            email: mockUser.email,
            display_name: "New Name",
            role: mockUser.role,
          }]),
        }),
      }),
    })

    const request = new Request("http://localhost:3000/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: "New Name" }),
    })

    const response = await PATCH(request)
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.user.displayName).toBe("New Name")
  })

  it("should return 400 for invalid display name", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)

    const request = new Request("http://localhost:3000/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: "A" }),
    })

    const response = await PATCH(request)
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.errors).toBeDefined()
  })

  it("should return 429 when rate limited", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)
    ;(rateLimit.checkRateLimit as ReturnType<typeof vi.fn>).mockReturnValue({
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 60,
    })

    const request = new Request("http://localhost:3000/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: "New Name" }),
    })

    const response = await PATCH(request)
    expect(response.status).toBe(429)
  })

  it("should return 400 for malformed JSON", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)

    const request = new Request("http://localhost:3000/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: "not json{",
    })

    const response = await PATCH(request)
    expect(response.status).toBe(400)
  })

  it("should log profile update in security audit", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)
    ;(db.update as ReturnType<typeof vi.fn>).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{
            id: mockUser.id,
            email: mockUser.email,
            display_name: "New Name",
            role: mockUser.role,
          }]),
        }),
      }),
    })

    const request = new Request("http://localhost:3000/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: "New Name" }),
    })

    await PATCH(request)
    expect(audit.securityLog).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "PROFILE_UPDATED",
        userId: mockUser.id,
      })
    )
  })
})

describe("GET /api/user/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return 401 when not authenticated", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const response = await GET()
    expect(response.status).toBe(401)
  })

  it("should return user profile data", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)

    const response = await GET()
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.user.id).toBe(mockUser.id)
    expect(data.user.email).toBe(mockUser.email)
    expect(data.user.displayName).toBe(mockUser.display_name)
    expect(data.user.role).toBe(mockUser.role)
  })
})