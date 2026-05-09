import { describe, it, expect, vi, beforeEach } from "vitest"
import { sendPasswordResetEmail, buildPasswordResetUrl } from "./index"

const originalEnv = { ...process.env }

describe("email service", () => {
  beforeEach(() => {
    process.env = { ...originalEnv }
    vi.clearAllMocks()
  })

  describe("buildPasswordResetUrl", () => {
    it("should build correct reset URL with token", () => {
      const url = buildPasswordResetUrl("abc123")
      expect(url).toContain("/reset-password?token=abc123")
    })

    it("should URL-encode the token", () => {
      const url = buildPasswordResetUrl("a+b=c")
      expect(url).toContain("token=a%2Bb%3Dc")
    })
  })

  describe("sendPasswordResetEmail", () => {
    it("should use Resend provider when configured", async () => {
      process.env.EMAIL_PROVIDER = "resend"
      process.env.RESEND_API_KEY = "test_key"
      process.env.NODE_ENV = "development"

      const fetchMock = vi.fn().mockResolvedValue({ ok: true })
      vi.stubGlobal("fetch", fetchMock)

      await sendPasswordResetEmail("test@example.com", "http://localhost:3000/reset?token=abc")

      expect(fetchMock).toHaveBeenCalled()
    })

    it("should not throw in development mode with Resend", async () => {
      process.env.EMAIL_PROVIDER = "resend"
      process.env.RESEND_API_KEY = "test_key"
      process.env.NODE_ENV = "development"

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }))

      await expect(
        sendPasswordResetEmail("test@example.com", "http://localhost/reset?token=abc"),
      ).resolves.toBeUndefined()
    })

    it("should apply trailing-slash normalization to APP_URL", () => {
      process.env.APP_URL = "https://example.com/"
      const url = buildPasswordResetUrl("abc123")
      expect(url).toBe("https://example.com/reset-password?token=abc123")
    })
  })
})
