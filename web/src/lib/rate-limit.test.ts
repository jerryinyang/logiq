import { describe, it, expect, beforeEach } from "vitest"
import { checkRateLimit, checkForgotPasswordRateLimit, _resetForTesting } from "./rate-limit"

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

describe("checkForgotPasswordRateLimit", () => {
  beforeEach(() => {
    _resetForTesting()
  })

  it("should allow first request with 2 remaining", () => {
    const result = checkForgotPasswordRateLimit("forgot:user@example.com")
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it("should allow up to 3 requests per hour", () => {
    const key = "forgot:test@example.com"
    for (let i = 0; i < 3; i++) {
      const result = checkForgotPasswordRateLimit(key)
      expect(result.allowed).toBe(true)
    }
  })

  it("should block the 4th request and provide retryAfterSeconds", () => {
    const key = "forgot:limit@example.com"
    for (let i = 0; i < 3; i++) {
      checkForgotPasswordRateLimit(key)
    }
    const result = checkForgotPasswordRateLimit(key)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })

  it("should use separate windows for different emails", () => {
    for (let i = 0; i < 3; i++) {
      checkForgotPasswordRateLimit("forgot:email-a@example.com")
    }
    const result = checkForgotPasswordRateLimit("forgot:email-b@example.com")
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })
})