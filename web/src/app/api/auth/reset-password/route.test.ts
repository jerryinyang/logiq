import { describe, it, expect, vi, beforeEach } from "vitest"
import { POST } from "./route"
import { db } from "@/lib/db"
import * as auth from "@/lib/auth"
import bcrypt from "bcryptjs"

vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    transaction: vi.fn(),
  },
}))

vi.mock("@/lib/auth", () => ({
  revokeUserSessions: vi.fn(),
}))

vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn() },
  hash: vi.fn(),
}))

vi.mock("crypto", () => ({
  createHash: vi.fn(() => ({
    update: vi.fn().mockReturnValue({
      digest: vi.fn(() => "mocked_token_hash"),
    }),
  })),
}))

vi.mock("@/lib/auth/tokens", () => ({
  hashResetToken: vi.fn(() => "mocked_token_hash"),
}))

const mockToken = "valid_reset_token_1234567890abcdef"
const mockTokenHash = "mocked_token_hash"
const mockUserId = "550e8400-e29b-41d4-a716-446655440000"
const mockTokenId = "660e8400-e29b-41d4-a716-446655440001"

const mockResetRecord = {
  id: mockTokenId,
  user_id: mockUserId,
  token_hash: mockTokenHash,
  expires_at: new Date(Date.now() + 3600 * 1000), // 1 hour from now
  created_at: new Date(),
}

function createSelectMock(result: unknown) {
  return vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(result ? [result] : []),
    }),
  })
}

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(null),
    )
    ;(bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValue(
      "$2a$12$hashed_new_password",
    )
    ;(db.transaction as ReturnType<typeof vi.fn>).mockImplementation(
      (cb: (tx: unknown) => Promise<void>) => cb({}),
    )
    ;(auth.revokeUserSessions as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    )
    ;(db.update as ReturnType<typeof vi.fn>).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    })
    ;(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    })
  })

  it("should reset password with valid token and valid new password", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(mockResetRecord),
    )

    const request = new Request(
      "http://localhost:3000/api/auth/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: mockToken,
          password: "NewPassword1!",
          confirmPassword: "NewPassword1!",
        }),
      },
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe(
      "Password reset successfully. Please log in with your new password.",
    )
    expect(bcrypt.hash).toHaveBeenCalledWith("NewPassword1!", 12)
  })

  it("should invalidate all user sessions after password reset", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(mockResetRecord),
    )

    const request = new Request(
      "http://localhost:3000/api/auth/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: mockToken,
          password: "NewPassword1!",
          confirmPassword: "NewPassword1!",
        }),
      },
    )

    await POST(request)

    expect(auth.revokeUserSessions).toHaveBeenCalledWith(mockUserId)
  })

  it("should return 400 for invalid/expired token", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(null),
    )

    const request = new Request(
      "http://localhost:3000/api/auth/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: "invalid_token",
          password: "NewPassword1!",
          confirmPassword: "NewPassword1!",
        }),
      },
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe("Invalid or expired reset link")
  })

  it("should return 400 for expired token and clean it up", async () => {
    const expiredRecord = {
      ...mockResetRecord,
      expires_at: new Date(Date.now() - 3600 * 1000), // 1 hour ago
    }
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(expiredRecord),
    )

    const request = new Request(
      "http://localhost:3000/api/auth/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: mockToken,
          password: "NewPassword1!",
          confirmPassword: "NewPassword1!",
        }),
      },
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe("Invalid or expired reset link")
    expect(db.delete).toHaveBeenCalled()
  })

  it("should return 400 for missing token", async () => {
    const request = new Request(
      "http://localhost:3000/api/auth/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: "NewPassword1!",
          confirmPassword: "NewPassword1!",
        }),
      },
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe("Invalid or expired reset link")
  })

  it("should return 422 for weak password (missing uppercase)", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(mockResetRecord),
    )

    const request = new Request(
      "http://localhost:3000/api/auth/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: mockToken,
          password: "weakpassword1!",
          confirmPassword: "weakpassword1!",
        }),
      },
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(422)
    expect(data.errors).toBeDefined()
    expect(data.errors.length).toBeGreaterThan(0)
  })

  it("should return 422 for password too short", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(mockResetRecord),
    )

    const request = new Request(
      "http://localhost:3000/api/auth/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: mockToken,
          password: "Ab1!",
          confirmPassword: "Ab1!",
        }),
      },
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(422)
  })

  it("should return 422 for mismatched password confirmation", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(mockResetRecord),
    )

    const request = new Request(
      "http://localhost:3000/api/auth/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: mockToken,
          password: "NewPassword1!",
          confirmPassword: "DifferentPassword1!",
        }),
      },
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(422)
  })

  it("should return 400 for malformed JSON body", async () => {
    const request = new Request(
      "http://localhost:3000/api/auth/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not json{",
      },
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe("Invalid request body")
  })
})
