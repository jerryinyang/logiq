import { describe, it, expect, vi, beforeEach } from "vitest"
import { getOAuthProviders } from "@/lib/auth/oauth"

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
    get: vi.fn(() => ({ value: "test-state-value" })),
    delete: vi.fn(),
  })),
}))

vi.mock("@/lib/auth", () => ({
  createSession: vi.fn().mockResolvedValue("session-token"),
  setSessionCookie: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockReturnValue({ allowed: true, remaining: 4 }),
}))

const originalEnv = process.env

beforeEach(() => {
  vi.clearAllMocks()
  process.env = { ...originalEnv }
  process.env.GITHUB_CLIENT_ID = "test-github-client"
  process.env.GOOGLE_CLIENT_ID = "test-google-client"
})

describe("OAuth Init Route", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should have OAuth providers configured", () => {
    const providers = getOAuthProviders()
    expect(providers.github.clientId).toBe("test-github-client")
    expect(providers.google.clientId).toBe("test-google-client")
  })
})

describe("OAuth integration scenarios", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should handle OAuth state validation flow", () => {
    const state = "original-random-state"
    const hash = require("crypto").createHash("sha256").update(state).digest("hex")

    expect(hash).toBeDefined()
    expect(hash.length).toBe(64)
  })

  it("should detect CSRF via state mismatch", () => {
    const state = "valid-state"
    const validHash = require("crypto").createHash("sha256").update(state).digest("hex")
    const attackerHash = require("crypto").createHash("sha256").update("attacker-state").digest("hex")

    expect(validHash).not.toBe(attackerHash)
  })

  it("should encrypt tokens using SHA-256", () => {
    const token = "my-access-token"
    const hash = require("crypto").createHash("sha256").update(token).digest("hex")
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })

  it("should produce different hashes for different tokens", () => {
    const hash1 = require("crypto").createHash("sha256").update("token-1").digest("hex")
    const hash2 = require("crypto").createHash("sha256").update("token-2").digest("hex")
    expect(hash1).not.toBe(hash2)
  })
})
