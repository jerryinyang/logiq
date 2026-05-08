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
    it("should log to console in development mode", async () => {
      process.env.NODE_ENV = "development"
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {})

      await sendPasswordResetEmail("test@example.com", "http://localhost:3000/reset-password?token=abc")

      expect(logSpy).toHaveBeenCalled()
      logSpy.mockRestore()
    })

    it("should not throw in development mode", async () => {
      process.env.NODE_ENV = "development"

      await expect(
        sendPasswordResetEmail("test@example.com", "http://localhost/reset?token=abc"),
      ).resolves.toBeUndefined()
    })
  })
})
