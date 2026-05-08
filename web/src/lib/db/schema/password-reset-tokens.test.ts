import { describe, it, expect } from "vitest"
import { passwordResetTokens } from "./schema/password-reset-tokens"

describe("password_reset_tokens schema", () => {
  it("should export the passwordResetTokens table", () => {
    expect(passwordResetTokens).toBeDefined()
    expect(passwordResetTokens).toHaveProperty("id")
    expect(passwordResetTokens).toHaveProperty("user_id")
    expect(passwordResetTokens).toHaveProperty("token_hash")
    expect(passwordResetTokens).toHaveProperty("expires_at")
    expect(passwordResetTokens).toHaveProperty("created_at")
  })
})
