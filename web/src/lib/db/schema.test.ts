import { describe, it, expect } from "vitest";
import { users, userRoleEnum } from "./schema/users";
import { userRole, type UserRole } from "./schema/enums";

describe("schema barrel export", () => {
  it("should re-export users table", () => {
    expect(users).toBeDefined();
  });

  it("should re-export userRole enum values", () => {
    expect(userRole).toEqual(["user", "creator", "admin"]);
  });

  it("should re-export UserRole type", () => {
    const role: UserRole = "admin";
    expect(role).toBe("admin");
  });

  it("should re-export userRoleEnum pgEnum", () => {
    expect(userRoleEnum).toBeDefined();
  });
});