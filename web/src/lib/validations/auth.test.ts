import { describe, it, expect } from "vitest"
import { registerSchema, signInSchema, type RegisterFormData, type SignInFormData } from "./auth"

const validInput = {
  email: "john@example.com",
  password: "StrongPass1!",
  confirmPassword: "StrongPass1!",
  displayName: "John Doe",
}

describe("registerSchema", () => {
  it("should accept valid registration data", () => {
    const result = registerSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it("should reject invalid email", () => {
    const result = registerSchema.safeParse({ ...validInput, email: "not-an-email" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email")
    }
  })

  it("should reject empty email", () => {
    const result = registerSchema.safeParse({ ...validInput, email: "" })
    expect(result.success).toBe(false)
  })

  it("should reject password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({ ...validInput, password: "Short1!", confirmPassword: "Short1!" })
    expect(result.success).toBe(false)
  })

  it("should reject password without uppercase letter", () => {
    const result = registerSchema.safeParse({ ...validInput, password: "weakpass1!", confirmPassword: "weakpass1!" })
    expect(result.success).toBe(false)
  })

  it("should reject password without lowercase letter", () => {
    const result = registerSchema.safeParse({ ...validInput, password: "WEAKPASS1!", confirmPassword: "WEAKPASS1!" })
    expect(result.success).toBe(false)
  })

  it("should reject password without number", () => {
    const result = registerSchema.safeParse({ ...validInput, password: "WeakPass!!", confirmPassword: "WeakPass!!" })
    expect(result.success).toBe(false)
  })

  it("should reject password without special character", () => {
    const result = registerSchema.safeParse({ ...validInput, password: "WeakPass1", confirmPassword: "WeakPass1" })
    expect(result.success).toBe(false)
  })

  it("should reject when passwords do not match", () => {
    const result = registerSchema.safeParse({ ...validInput, confirmPassword: "Different1!" })
    expect(result.success).toBe(false)
    if (!result.success) {
      const matchIssue = result.error.issues.find(i => i.path.includes("confirmPassword"))
      expect(matchIssue).toBeDefined()
      expect(matchIssue!.message).toBe("Passwords do not match")
    }
  })

  it("should reject empty confirmPassword", () => {
    const result = registerSchema.safeParse({ ...validInput, confirmPassword: "" })
    expect(result.success).toBe(false)
  })

  it("should reject display name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({ ...validInput, displayName: "J" })
    expect(result.success).toBe(false)
  })

  it("should reject display name longer than 50 characters", () => {
    const result = registerSchema.safeParse({ ...validInput, displayName: "A".repeat(51) })
    expect(result.success).toBe(false)
  })

  it("should accept display name with Unicode characters", () => {
    const result = registerSchema.safeParse({ ...validInput, displayName: "José García" })
    expect(result.success).toBe(true)
  })

  it("should accept display name with CJK characters", () => {
    const result = registerSchema.safeParse({ ...validInput, displayName: "日本太郎" })
    expect(result.success).toBe(true)
  })

  it("should reject display name with special characters like @ and !", () => {
    const result = registerSchema.safeParse({ ...validInput, displayName: "John @ Doe!" })
    expect(result.success).toBe(false)
  })

  it("should accept display name with spaces, letters, numbers, and underscores", () => {
    const result = registerSchema.safeParse({ ...validInput, displayName: "John_Doe 123" })
    expect(result.success).toBe(true)
  })

  it("should reject empty display name", () => {
    const result = registerSchema.safeParse({ ...validInput, displayName: "" })
    expect(result.success).toBe(false)
  })

  it("should normalize email to lowercase", () => {
    const result = registerSchema.safeParse({ ...validInput, email: "  John@Example.COM  " })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe("john@example.com")
    }
  })

  it("should transform displayName by trimming whitespace", () => {
    const result = registerSchema.safeParse({ ...validInput, displayName: "  John Doe  " })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.displayName).toBe("John Doe")
    }
  })

it("should trim leading/trailing whitespace from passwords", () => {
    const result = registerSchema.safeParse({ ...validInput, password: "  StrongPass1!  ", confirmPassword: "  StrongPass1!  " })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.password).toBe("StrongPass1!")
      expect(result.data.confirmPassword).toBe("StrongPass1!")
    }
  })

  it("should accept registration with optional dateOfBirth", () => {
    const result = registerSchema.safeParse({ ...validInput, dateOfBirth: "2000-01-01" })
    expect(result.success).toBe(true)
  })

  it("should support RegisterFormData type inference", () => {
    const data: RegisterFormData = {
      email: "test@example.com",
      password: "ValidPass1!",
      confirmPassword: "ValidPass1!",
      displayName: "Test User",
    }
    expect(data.email).toBe("test@example.com")
  })
})

const validSignIn = {
  email: "john@example.com",
  password: "MyPassword1!",
}

describe("signInSchema", () => {
  it("should accept valid sign-in data", () => {
    const result = signInSchema.safeParse(validSignIn)
    expect(result.success).toBe(true)
  })

  it("should accept sign-in with rememberMe=true", () => {
    const result = signInSchema.safeParse({ ...validSignIn, rememberMe: true })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.rememberMe).toBe(true)
    }
  })

  it("should default rememberMe to false when not provided", () => {
    const result = signInSchema.safeParse(validSignIn)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.rememberMe).toBe(false)
    }
  })

  it("should reject invalid email", () => {
    const result = signInSchema.safeParse({ ...validSignIn, email: "not-an-email" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email")
    }
  })

  it("should reject empty email", () => {
    const result = signInSchema.safeParse({ ...validSignIn, email: "" })
    expect(result.success).toBe(false)
  })

  it("should reject empty password", () => {
    const result = signInSchema.safeParse({ ...validSignIn, password: "" })
    expect(result.success).toBe(false)
  })

  it("should support SignInFormData type inference", () => {
    const data: SignInFormData = {
      email: "test@example.com",
      password: "ValidPass1!",
      rememberMe: true,
    }
    expect(data.email).toBe("test@example.com")
    expect(data.rememberMe).toBe(true)
  })
})