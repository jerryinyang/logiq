import { describe, it, expect } from "vitest";
import { userRole } from "./enums";

describe("enums module", () => {
  it("should export userRole as a const array", () => {
    expect(userRole).toEqual(["user", "creator", "admin"]);
  });

  it("should have UserRole type with correct values", () => {
    const roles = userRole;
    expect(roles).toHaveLength(3);
    expect(roles).toContain("user");
    expect(roles).toContain("creator");
    expect(roles).toContain("admin");
  });
});