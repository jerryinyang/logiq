import { describe, it, expect } from "vitest"
import {
  updateDisplayNameSchema,
  changePasswordSchema,
  updateDisplayNameApiSchema,
  changePasswordApiSchema,
} from "./profile"

describe("updateDisplayNameSchema", () => {
  it("should accept valid display name", () => {
    const result = updateDisplayNameSchema.safeParse({ displayName: "John Doe" })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.displayName).toBe("John Doe")
    }
  })

  it("should trim whitespace from display name", () => {
    const result = updateDisplayNameSchema.safeParse({ displayName: "  John Doe  " })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.displayName).toBe("John Doe")
    }
  })

  it("should reject display name shorter than 3 characters", () => {
    const result = updateDisplayNameSchema.safeParse({ displayName: "Jo" })
    expect(result.success).toBe(false)
  })

  it("should reject display name longer than 50 characters", () => {
    const result = updateDisplayNameSchema.safeParse({ displayName: "A".repeat(51) })
    expect(result.success).toBe(false)
  })

  it("should reject display name with special characters", () => {
    const result = updateDisplayNameSchema.safeParse({ displayName: "John@Doe!" })
    expect(result.success).toBe(false)
  })

  it("should accept display name with Unicode characters", () => {
    const result = updateDisplayNameSchema.safeParse({ displayName: "José García" })
    expect(result.success).toBe(true)
  })

  it("should accept display name with hyphens and apostrophes", () => {
    const result = updateDisplayNameSchema.safeParse({ displayName: "Mary-Jane O'Brien" })
    expect(result.success).toBe(true)
  })

  it("should accept display name with underscores", () => {
    const result = updateDisplayNameSchema.safeParse({ displayName: "John_Doe" })
    expect(result.success).toBe(true)
  })
})

describe("changePasswordSchema", () => {
  const validData = {
    currentPassword: "OldPassword1!",
    newPassword: "NewPassword1!",
    confirmPassword: "NewPassword1!",
  }

  it("should accept valid password change data", () => {
    const result = changePasswordSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("should reject when current password is empty", () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      currentPassword: "",
    })
    expect(result.success).toBe(false)
  })

  it("should reject new password shorter than 8 characters", () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      newPassword: "Short1!",
      confirmPassword: "Short1!",
    })
    expect(result.success).toBe(false)
  })

  it("should reject new password without uppercase", () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      newPassword: "newpassword1!",
      confirmPassword: "newpassword1!",
    })
    expect(result.success).toBe(false)
  })

  it("should reject new password without lowercase", () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      newPassword: "NEWPASSWORD1!",
      confirmPassword: "NEWPASSWORD1!",
    })
    expect(result.success).toBe(false)
  })

  it("should reject new password without number", () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      newPassword: "NewPassword!",
      confirmPassword: "NewPassword!",
    })
    expect(result.success).toBe(false)
  })

  it("should reject new password without special character", () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      newPassword: "NewPassword1",
      confirmPassword: "NewPassword1",
    })
    expect(result.success).toBe(false)
  })

  it("should reject when confirm password does not match new password", () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      confirmPassword: "Different1!",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const confirmIssue = result.error.issues.find(i => i.path.includes("confirmPassword"))
      expect(confirmIssue).toBeDefined()
      expect(confirmIssue!.message).toBe("Passwords do not match")
    }
  })

  it("should reject when new password is same as current password", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "SamePassword1!",
      newPassword: "SamePassword1!",
      confirmPassword: "SamePassword1!",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const newPassIssue = result.error.issues.find(i => i.path.includes("newPassword"))
      expect(newPassIssue).toBeDefined()
      expect(newPassIssue!.message).toBe("New password must be different from current password")
    }
  })

  it("should reject empty confirm password", () => {
    const result = changePasswordSchema.safeParse({
      ...validData,
      confirmPassword: "",
    })
    expect(result.success).toBe(false)
  })
})

describe("updateDisplayNameApiSchema", () => {
  it("should accept valid display name without trimming", () => {
    const result = updateDisplayNameApiSchema.safeParse({ displayName: "John Doe" })
    expect(result.success).toBe(true)
  })

  it("should reject display name shorter than 3 characters", () => {
    const result = updateDisplayNameApiSchema.safeParse({ displayName: "Jo" })
    expect(result.success).toBe(false)
  })

  it("should reject display name longer than 50 characters", () => {
    const result = updateDisplayNameApiSchema.safeParse({ displayName: "A".repeat(51) })
    expect(result.success).toBe(false)
  })

  it("should reject display name with special characters", () => {
    const result = updateDisplayNameApiSchema.safeParse({ displayName: "John@Doe!" })
    expect(result.success).toBe(false)
  })
})

describe("changePasswordApiSchema", () => {
  it("should accept valid password change data", () => {
    const result = changePasswordApiSchema.safeParse({
      currentPassword: "OldPassword1!",
      newPassword: "NewPassword1!",
      confirmPassword: "NewPassword1!",
    })
    expect(result.success).toBe(true)
  })

  it("should reject when passwords do not match", () => {
    const result = changePasswordApiSchema.safeParse({
      currentPassword: "OldPassword1!",
      newPassword: "NewPassword1!",
      confirmPassword: "Different1!",
    })
    expect(result.success).toBe(false)
  })
})