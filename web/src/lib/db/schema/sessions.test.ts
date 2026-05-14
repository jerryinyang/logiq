import { describe, it, expect } from "vitest";
import { sessions } from "./sessions";

describe("sessions table", () => {
  it("should have correct table name", () => {
    expect(sessions).toBeDefined();
  });

  it("should include all required columns", () => {
    const columnNames = Object.keys(sessions);
    expect(columnNames).toContain("id");
    expect(columnNames).toContain("user_id");
    expect(columnNames).toContain("token");
    expect(columnNames).toContain("expires_at");
    expect(columnNames).toContain("created_at");
  });

  it("should have id as UUID primary key with defaultRandom", () => {
    expect(sessions.id).toBeDefined();
    expect(sessions.id.columnType).toBe("PgUUID");
    expect(sessions.id.primary).toBe(true);
  });

  it("should have user_id as not null UUID", () => {
    expect(sessions.user_id).toBeDefined();
    expect(sessions.user_id.columnType).toBe("PgUUID");
    expect(sessions.user_id.notNull).toBe(true);
  });

  it("should have token as not null varchar with unique constraint", () => {
    expect(sessions.token).toBeDefined();
    expect(sessions.token.columnType).toBe("PgVarchar");
    expect(sessions.token.notNull).toBe(true);
  });

  it("should have expires_at as not null timestamp with timezone", () => {
    expect(sessions.expires_at).toBeDefined();
    expect(sessions.expires_at.columnType).toBe("PgTimestamp");
    expect(sessions.expires_at.notNull).toBe(true);
  });

  it("should have created_at as not null timestamp with timezone", () => {
    expect(sessions.created_at).toBeDefined();
    expect(sessions.created_at.columnType).toBe("PgTimestamp");
    expect(sessions.created_at.notNull).toBe(true);
  });
});
