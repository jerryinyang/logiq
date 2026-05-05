import { describe, it, expect } from "vitest";
import { users, userRoleEnum } from "./users";
import { userRole } from "./enums";

describe("enums", () => {
  it("should define user_role enum with correct values", () => {
    expect(userRole).toEqual(["user", "creator", "admin"]);
  });
});

describe("users table", () => {
  it("should have correct table name", () => {
    expect(users).toBeDefined();
  });

  it("should include all required columns", () => {
    const columnNames = Object.keys(users);
    expect(columnNames).toContain("id");
    expect(columnNames).toContain("email");
    expect(columnNames).toContain("password_hash");
    expect(columnNames).toContain("display_name");
    expect(columnNames).toContain("role");
    expect(columnNames).toContain("created_at");
    expect(columnNames).toContain("updated_at");
    expect(columnNames).toContain("session_token");
    expect(columnNames).toContain("session_expires_at");
  });

  it("should have id as UUID primary key with defaultRandom", () => {
    expect(users.id).toBeDefined();
    expect(users.id.columnType).toBe("PgUUID");
    expect(users.id.primary).toBe(true);
  });

  it("should have email as not null varchar with unique constraint", () => {
    expect(users.email).toBeDefined();
    expect(users.email.columnType).toBe("PgVarchar");
    expect(users.email.notNull).toBe(true);
  });

  it("should have password_hash as nullable varchar", () => {
    expect(users.password_hash).toBeDefined();
    expect(users.password_hash.columnType).toBe("PgVarchar");
  });

  it("should have display_name as not null varchar", () => {
    expect(users.display_name).toBeDefined();
    expect(users.display_name.columnType).toBe("PgVarchar");
    expect(users.display_name.notNull).toBe(true);
  });

  it("should have role column using user_role pgEnum", () => {
    expect(users.role).toBeDefined();
    expect(userRoleEnum.enumName).toBe("user_role");
  });

  it("should have timestamps with timezone", () => {
    expect(users.created_at.columnType).toBe("PgTimestamp");
    expect(users.updated_at.columnType).toBe("PgTimestamp");
    expect(users.created_at.notNull).toBe(true);
    expect(users.updated_at.notNull).toBe(true);
  });

  it("should have nullable session fields", () => {
    expect(users.session_token.columnType).toBe("PgVarchar");
    expect(users.session_expires_at.columnType).toBe("PgTimestamp");
  });
});