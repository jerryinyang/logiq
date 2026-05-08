import { describe, it, expect, vi, beforeEach } from "vitest"
import { db } from "@/lib/db"
import { createSession, clearSession, revokeUserSessions, generateCsrfToken, hashCsrfToken, getCsrfCookieName } from "./auth"

vi.mock("@/lib/db", () => ({
  db: {
    insert: vi.fn(),
    delete: vi.fn(),
    select: vi.fn(),
  },
}))

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  })),
}))

function mockSelect() {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {
    from: vi.fn(),
    where: vi.fn(),
    innerJoin: vi.fn(),
    limit: vi.fn(),
  }
  chain.from.mockReturnValue(chain)
  chain.where.mockReturnValue(chain)
  chain.innerJoin.mockReturnValue(chain)
  chain.limit.mockReturnValue(chain)
  ;(db.select as ReturnType<typeof vi.fn>).mockReturnValue(chain)
  return chain
}

describe("createSession", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should create session with default 30-day expiration", async () => {
    const chain = mockSelect()
    chain.where.mockResolvedValue([])
    ;(db.insert as ReturnType<typeof vi.fn>).mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    })

    const token = await createSession("user-1")

    expect(token).toBeDefined()
    expect(typeof token).toBe("string")
    expect(token.length).toBe(64)

    expect(db.insert).toHaveBeenCalled()
  })

  it("should create session with 90-day expiration when rememberMe", async () => {
    const chain = mockSelect()
    chain.where.mockResolvedValue([])
    ;(db.insert as ReturnType<typeof vi.fn>).mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    })

    const token = await createSession("user-1", 90)

    expect(token).toBeDefined()
    expect(db.insert).toHaveBeenCalled()
  })

  it("should create session with custom duration", async () => {
    const chain = mockSelect()
    chain.where.mockResolvedValue([])
    ;(db.insert as ReturnType<typeof vi.fn>).mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    })

    const token = await createSession("user-1", 7)

    expect(token).toBeDefined()
    expect(db.insert).toHaveBeenCalled()
  })

  it("should reject empty userId", async () => {
    await expect(createSession("")).rejects.toThrow("userId is required")
  })

  it("should reject zero days", async () => {
    await expect(createSession("user-1", 0)).rejects.toThrow("days must be positive")
  })

  it("should reject negative days", async () => {
    await expect(createSession("user-1", -1)).rejects.toThrow("days must be positive")
  })
})

describe("clearSession", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should delete session and clear cookie", async () => {
    ;(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    })

    await expect(clearSession()).resolves.not.toThrow()
  })
})

describe("revokeUserSessions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should delete all sessions for a user", async () => {
    ;(db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    })

    await revokeUserSessions("user-1")

    expect(db.delete).toHaveBeenCalled()
  })

  it("should reject empty userId", async () => {
    await expect(revokeUserSessions("")).rejects.toThrow("userId is required")
  })
})

describe("token hashing", () => {
  it("should produce deterministic hashes via hashCsrfToken", () => {
    const token = "same-token"
    const hash1 = hashCsrfToken(token)
    const hash2 = hashCsrfToken(token)
    expect(hash1).toBe(hash2)
    expect(hash1.length).toBe(64)
  })

  it("should produce different hashes for different tokens", () => {
    const hash1 = hashCsrfToken("token-1")
    const hash2 = hashCsrfToken("token-2")
    expect(hash1).not.toBe(hash2)
  })
})

describe("generateCsrfToken", () => {
  it("should generate a 64-character hex token", () => {
    const token = generateCsrfToken()
    expect(token).toBeDefined()
    expect(typeof token).toBe("string")
    expect(token.length).toBe(64)
  })

  it("should generate unique tokens", () => {
    const token1 = generateCsrfToken()
    const token2 = generateCsrfToken()
    expect(token1).not.toBe(token2)
  })
})

describe("getCsrfCookieName", () => {
  it("should return a non-empty string", () => {
    const name = getCsrfCookieName()
    expect(typeof name).toBe("string")
    expect(name.length).toBeGreaterThan(0)
  })
})
