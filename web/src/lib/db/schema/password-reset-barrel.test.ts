import { describe, it, expect } from "vitest"
import { passwordResetTokens } from "@/lib/db/schema"
import { userRole, type UserRole } from "@/lib/db/schema"

describe("schema barrel exports", () => {
  it("should export passwordResetTokens", () => {
    expect(passwordResetTokens).toBeDefined()
  })

  it("should still export existing schemas", () => {
    expect(userRole).toBeDefined()
    expect(userRole).toContain("user")
    expect(userRole).toContain("creator")
    expect(userRole).toContain("admin")
  })
})
