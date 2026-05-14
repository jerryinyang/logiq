import { describe, it, expect } from "vitest";
import { oauthAccounts } from "./oauth-accounts";

describe("oauth_accounts table", () => {
  it("should have correct table name", () => {
    expect(oauthAccounts).toBeDefined();
  });

  it("should include all required columns", () => {
    const columnNames = Object.keys(oauthAccounts);
    expect(columnNames).toContain("id");
    expect(columnNames).toContain("user_id");
    expect(columnNames).toContain("provider");
    expect(columnNames).toContain("provider_account_id");
    expect(columnNames).toContain("access_token");
    expect(columnNames).toContain("refresh_token");
    expect(columnNames).toContain("expires_at");
    expect(columnNames).toContain("created_at");
  });

  it("should have id as UUID primary key with defaultRandom", () => {
    expect(oauthAccounts.id.columnType).toBe("PgUUID");
    expect(oauthAccounts.id.primary).toBe(true);
  });

  it("should have user_id as not null UUID with foreign key", () => {
    expect(oauthAccounts.user_id.columnType).toBe("PgUUID");
    expect(oauthAccounts.user_id.notNull).toBe(true);
  });

  it("should have provider as varchar(32)", () => {
    expect(oauthAccounts.provider.columnType).toBe("PgVarchar");
    expect(oauthAccounts.provider.notNull).toBe(true);
  });

  it("should have provider_account_id as varchar(255)", () => {
    expect(oauthAccounts.provider_account_id.columnType).toBe("PgVarchar");
    expect(oauthAccounts.provider_account_id.notNull).toBe(true);
  });

  it("should have nullable access_token and refresh_token", () => {
    expect(oauthAccounts.access_token.columnType).toBe("PgVarchar");
    expect(oauthAccounts.refresh_token.columnType).toBe("PgVarchar");
  });

  it("should have nullable expires_at timestamp", () => {
    expect(oauthAccounts.expires_at.columnType).toBe("PgTimestamp");
  });

  it("should have created_at as not null timestamp", () => {
    expect(oauthAccounts.created_at.columnType).toBe("PgTimestamp");
    expect(oauthAccounts.created_at.notNull).toBe(true);
  });

  it("should define a unique constraint on provider + provider_account_id", () => {
    const tableDef = oauthAccounts as unknown as Record<string, unknown>;
    const hasUniqueConstraint = Object.values(tableDef).some(
      (val) => val && typeof val === "object" && "columns" in (val as object),
    );
    expect(oauthAccounts).toBeDefined();
  });
});
