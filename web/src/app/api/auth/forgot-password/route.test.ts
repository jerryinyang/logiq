import { describe, it, expect, vi, beforeEach } from "vitest"
import { POST } from "./route"
import { db } from "@/lib/db"
import * as rateLimit from "@/lib/rate-limit"
import * as emailModule from "@/lib/email"

vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn(),
    delete: vi.fn(),
    insert: vi.fn(),
    transaction: vi.fn(),
  },
}))

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true, remaining: 4 })),
  checkForgotPasswordRateLimit: vi.fn(() => ({ allowed: true, remaining: 2 })),
}))

vi.mock("@/lib/email", () => ({
  sendPasswordResetEmail: vi.fn(),
  buildPasswordResetUrl: vi.fn((token: string) => `http://localhost:3000/reset-password?token=${token}`),
}))

vi.mock("@/lib/auth/tokens", () => ({
  hashResetToken: vi.fn(() => "mocked_token_hash"),
}))

vi.mock("crypto", () => ({
  randomBytes: vi.fn(() => Buffer.from("a".repeat(64))),
}))

const mockUser = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "john@example.com",
  display_name: "John Doe",
  role: "user",
}

function createSelectMock(result: unknown) {
  return vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(result ? [result] : []),
    }),
  })
}

function createDeleteMock() {
  return vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(undefined),
  })
}

function createInsertMock() {
  return vi.fn().mockReturnValue({
    values: vi.fn().mockResolvedValue(undefined),
  })
}

describe("POST /api/auth/forgot-password", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(rateLimit.checkRateLimit as ReturnType<typeof vi.fn>).mockReturnValue({
      allowed: true,
      remaining: 4,
    })
    ;(rateLimit.checkForgotPasswordRateLimit as ReturnType<typeof vi.fn>).mockReturnValue({
      allowed: true,
      remaining: 2,
    })
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(null),
    )
    ;(db.delete as ReturnType<typeof vi.fn>).mockImplementation(createDeleteMock())
    ;(db.insert as ReturnType<typeof vi.fn>).mockImplementation(createInsertMock())
    ;(db.transaction as ReturnType<typeof vi.fn>).mockImplementation(
      async (cb: (tx: unknown) => Promise<void>) => {
        await cb({
          delete: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
          insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) }),
        })
      },
    )
  })

  it("should return generic success message for existing user", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(mockUser),
    )

    const request = new Request(
      "http://localhost:3000/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "john@example.com" }),
      },
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toContain(
      "If an account exists with this email, you'll receive a reset link",
    )
  })

  it("should return generic success message for non-existent email (prevent enumeration)", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(null),
    )

    const request = new Request(
      "http://localhost:3000/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "nonexistent@example.com" }),
      },
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toContain(
      "If an account exists with this email, you'll receive a reset link",
    )
  })

  it("should generate and store a reset token for existing user", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(mockUser),
    )

    const request = new Request(
      "http://localhost:3000/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "john@example.com" }),
      },
    )

    await POST(request)

    expect(db.transaction).toHaveBeenCalled()
  })

  it("should send the reset email for existing user", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(mockUser),
    )

    const request = new Request(
      "http://localhost:3000/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "john@example.com" }),
      },
    )

    await POST(request)

    expect(emailModule.sendPasswordResetEmail).toHaveBeenCalled()
  })

  it("should NOT generate token or send email for non-existent email", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(null),
    )

    const request = new Request(
      "http://localhost:3000/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "nonexistent@example.com" }),
      },
    )

    await POST(request)

    expect(db.transaction).not.toHaveBeenCalled()
    expect(emailModule.sendPasswordResetEmail).not.toHaveBeenCalled()
  })

  it("should return generic message when per-email rate limited", async () => {
    ;(rateLimit.checkForgotPasswordRateLimit as ReturnType<typeof vi.fn>).mockReturnValue({
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 3600,
    })

    const request = new Request(
      "http://localhost:3000/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "john@example.com" }),
      },
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toContain(
      "If an account exists with this email, you'll receive a reset link",
    )
  })

  it("should return generic message when per-IP rate limited", async () => {
    ;(rateLimit.checkRateLimit as ReturnType<typeof vi.fn>).mockReturnValue({
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 60,
    })

    const request = new Request(
      "http://localhost:3000/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "john@example.com" }),
      },
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toContain(
      "If an account exists with this email, you'll receive a reset link",
    )
  })

  it("should return generic success for invalid email format", async () => {
    const request = new Request(
      "http://localhost:3000/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "not-an-email" }),
      },
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toContain(
      "If an account exists with this email, you'll receive a reset link",
    )
  })

  it("should return generic message for malformed JSON body", async () => {
    const request = new Request(
      "http://localhost:3000/api/auth/forgot-password",
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

  it("should normalize email to lowercase before lookup", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(mockUser),
    )

    const request = new Request(
      "http://localhost:3000/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "JOHN@EXAMPLE.COM" }),
      },
    )

    await POST(request)

    expect(emailModule.sendPasswordResetEmail).toHaveBeenCalledWith(
      "john@example.com",
      expect.any(String),
    )
  })

  it("should still return 200 if email sending fails", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(
      createSelectMock(mockUser),
    )
    ;(
      emailModule.sendPasswordResetEmail as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error("SMTP error"))

    const request = new Request(
      "http://localhost:3000/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "john@example.com" }),
      },
    )

    const response = await POST(request)

    expect(response.status).toBe(200)
  })

  it("should return 200 even if DB query fails (prevent enumeration)", async () => {
    ;(db.select as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error("DB connection failed")
    })

    const request = new Request(
      "http://localhost:3000/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "john@example.com" }),
      },
    )

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toContain(
      "If an account exists with this email, you'll receive a reset link",
    )
  })
})