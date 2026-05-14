import { describe, it, expect, vi, beforeEach } from "vitest"
import { POST } from "./route"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import * as auth from "@/lib/auth"
import * as rateLimit from "@/lib/rate-limit"
import * as audit from "@/lib/audit"

vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock("bcryptjs", () => ({
  default: { compare: vi.fn(), hash: vi.fn() },
  compare: vi.fn(),
  hash: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({
  getSessionUser: vi.fn(),
}))

vi.mock("@/lib/rate-limit", () => ({
  checkForgotPasswordRateLimit: vi.fn(() => ({ allowed: true, remaining: 2 })),
  checkRateLimit: vi.fn(() => ({ allowed: true, remaining: 4 })),
}))

vi.mock("@/lib/audit", () => ({
  securityLog: vi.fn(),
}))

vi.mock("@/lib/email/password-change", () => ({
  sendPasswordChangeEmail: vi.fn().mockResolvedValue(undefined),
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

const dbUser = {
  id: mockUser.id,
  email: mockUser.email,
  password_hash: "$2a$12$hashedpassword",
  display_name: mockUser.display_name,
  role: mockUser.role,
}

describe("POST /api/user/change-password", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(rateLimit.checkForgotPasswordRateLimit as ReturnType<typeof vi.fn>).mockReturnValue({ allowed: true, remaining: 2 })
  })

  it("should return 401 when not authenticated", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const request = new Request("http://localhost:3000/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: "OldPassword1!",
        newPassword: "NewPassword1!",
        confirmPassword: "NewPassword1!",
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it("should return 400 when current password is incorrect", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)
    ;(db.select as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([dbUser]),
        }),
      }),
    })
    ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(false)

    const request = new Request("http://localhost:3000/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: "WrongPassword1!",
        newPassword: "NewPassword1!",
        confirmPassword: "NewPassword1!",
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.message).toBe("Current password is incorrect")
    expect(audit.securityLog).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "PASSWORD_CHANGE_FAILED",
        userId: mockUser.id,
      })
    )
  })

  it("should change password successfully", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)
    ;(db.select as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([dbUser]),
        }),
      }),
    })
    ;(bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true)
    ;(bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue("$2a$12$newhashedpassword")
    ;(db.update as ReturnType<typeof vi.fn>).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    })

    const request = new Request("http://localhost:3000/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: "OldPassword1!",
        newPassword: "NewPassword1!",
        confirmPassword: "NewPassword1!",
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(bcrypt.hash).toHaveBeenCalledWith("NewPassword1!", 12)
    expect(audit.securityLog).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "PASSWORD_CHANGE_COMPLETED",
        userId: mockUser.id,
      })
    )
  })

  it("should return 400 for invalid input", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)

    const request = new Request("http://localhost:3000/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: "",
        newPassword: "short",
        confirmPassword: "different",
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("should return 429 when rate limited", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)
    ;(rateLimit.checkForgotPasswordRateLimit as ReturnType<typeof vi.fn>).mockReturnValue({
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 3600,
    })

    const request = new Request("http://localhost:3000/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: "OldPassword1!",
        newPassword: "NewPassword1!",
        confirmPassword: "NewPassword1!",
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(429)
  })

  it("should return 400 for OAuth-only accounts", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)
    const oauthUser = { ...dbUser, password_hash: null }
    ;(db.select as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([oauthUser]),
        }),
      }),
    })

    const request = new Request("http://localhost:3000/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: "OldPassword1!",
        newPassword: "NewPassword1!",
        confirmPassword: "NewPassword1!",
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.message).toContain("OAuth")
  })

  it("should return 400 when passwords do not match", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)

    const request = new Request("http://localhost:3000/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: "OldPassword1!",
        newPassword: "NewPassword1!",
        confirmPassword: "DifferentPassword1!",
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it("should handle server errors gracefully", async () => {
    ;(auth.getSessionUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser)
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error("DB connection failed")
    })

    const request = new Request("http://localhost:3000/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: "OldPassword1!",
        newPassword: "NewPassword1!",
        confirmPassword: "NewPassword1!",
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
  })
})