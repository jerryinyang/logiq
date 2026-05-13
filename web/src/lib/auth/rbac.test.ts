import { describe, it, expect, vi } from "vitest"

vi.mock("@/lib/auth", () => ({
  getSessionUser: vi.fn(),
}))

import { hasRole, isAdmin, isCreator, getRequiredRole, isUnauthorizedAccess, roleDisplayName } from "./rbac"

describe("hasRole", () => {
  it("should return true when user has the exact required role", () => {
    expect(hasRole("user", "user")).toBe(true)
    expect(hasRole("creator", "creator")).toBe(true)
    expect(hasRole("admin", "admin")).toBe(true)
  })

  it("should return true when user has a higher role than required", () => {
    expect(hasRole("admin", "user")).toBe(true)
    expect(hasRole("admin", "creator")).toBe(true)
    expect(hasRole("creator", "user")).toBe(true)
  })

  it("should return false when user has a lower role than required", () => {
    expect(hasRole("user", "creator")).toBe(false)
    expect(hasRole("user", "admin")).toBe(false)
    expect(hasRole("creator", "admin")).toBe(false)
  })

  it("should return false for undefined role", () => {
    expect(hasRole(undefined, "user")).toBe(false)
    expect(hasRole(undefined, "admin")).toBe(false)
  })

  it("should return false for null role", () => {
    expect(hasRole(null, "user")).toBe(false)
  })
})

describe("isAdmin", () => {
  it("should return true for admin role", () => {
    expect(isAdmin("admin")).toBe(true)
  })

  it("should return false for non-admin roles", () => {
    expect(isAdmin("user")).toBe(false)
    expect(isAdmin("creator")).toBe(false)
  })

  it("should return false for undefined/null role", () => {
    expect(isAdmin(undefined)).toBe(false)
    expect(isAdmin(null)).toBe(false)
  })
})

describe("isCreator", () => {
  it("should return true for creator role", () => {
    expect(isCreator("creator")).toBe(true)
  })

  it("should return true for admin role (admin > creator)", () => {
    expect(isCreator("admin")).toBe(true)
  })

  it("should return false for user role", () => {
    expect(isCreator("user")).toBe(false)
  })
})

describe("getRequiredRole", () => {
  it("should require admin role for /admin routes", () => {
    expect(getRequiredRole("/admin/dashboard")).toBe("admin")
    expect(getRequiredRole("/admin/users")).toBe("admin")
  })

  it("should return null for non-restricted routes", () => {
    expect(getRequiredRole("/dashboard")).toBeNull()
    expect(getRequiredRole("/profile")).toBeNull()
    expect(getRequiredRole("/")).toBeNull()
  })
})

describe("isUnauthorizedAccess", () => {
  it("should return false for non-restricted routes regardless of role", () => {
    expect(isUnauthorizedAccess("user", "/dashboard")).toBe(false)
    expect(isUnauthorizedAccess(null, "/dashboard")).toBe(false)
  })

  it("should return true when user role is insufficient for restricted route", () => {
    expect(isUnauthorizedAccess("user", "/admin/dashboard")).toBe(true)
    expect(isUnauthorizedAccess("creator", "/admin/users")).toBe(true)
  })

  it("should return false when user has required role", () => {
    expect(isUnauthorizedAccess("admin", "/admin/dashboard")).toBe(false)
  })

  it("should return true for null/undefined role on restricted routes", () => {
    expect(isUnauthorizedAccess(null, "/admin/dashboard")).toBe(true)
    expect(isUnauthorizedAccess(undefined, "/admin/dashboard")).toBe(true)
  })
})

describe("roleDisplayName", () => {
  it("should return display names for all roles", () => {
    expect(roleDisplayName("admin")).toBe("Admin")
    expect(roleDisplayName("creator")).toBe("Creator")
    expect(roleDisplayName("user")).toBe("User")
  })
})