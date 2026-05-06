import { describe, it, expect, beforeEach } from "vitest"
import { checkRateLimit, _resetForTesting } from "./rate-limit"

describe("checkRateLimit", () => {
  beforeEach(() => {
    _resetForTesting()
  })

  it("should allow first request", () => {
    const result = checkRateLimit("test-key-1")
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it("should allow requests within limit", () => {
    const key = "test-key-2"
    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(key)
      expect(result.allowed).toBe(true)
    }
  })

  it("should block requests exceeding limit and provide retryAfterSeconds", () => {
    const key = "test-key-3"
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key)
    }
    const result = checkRateLimit(key)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })

  it("should use separate windows for different keys", () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit("key-a")
    }
    const result = checkRateLimit("key-b")
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })
})