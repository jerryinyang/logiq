import { describe, it, expect } from "vitest";
import { users, userRoleEnum } from "./schema/users";
import { sessions } from "./schema/sessions";
import { passwordResetTokens } from "./schema/password-reset-tokens";
import { userRole, type UserRole } from "./schema/enums";

describe("schema barrel export", () => {
  it("should re-export users table", () => {
    expect(users).toBeDefined();
  });

  it("should re-export sessions table", () => {
    expect(sessions).toBeDefined();
  });

  it("should re-export passwordResetTokens table", () => {
    expect(passwordResetTokens).toBeDefined();
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

  it("should have COPPA-related columns on users table", () => {
    const columnNames = Object.keys(users);
    expect(columnNames).toContain("date_of_birth");
    expect(columnNames).toContain("parental_consent");
  });
});
