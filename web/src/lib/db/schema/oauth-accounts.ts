import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const oauthAccounts = pgTable(
  "oauth_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: varchar("provider", { length: 32 }).notNull(),
    provider_account_id: varchar("provider_account_id", { length: 255 }).notNull(),
    access_token: varchar("access_token", { length: 512 }),
    refresh_token: varchar("refresh_token", { length: 512 }),
    expires_at: timestamp("expires_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("uq_oauth_provider_account").on(table.provider, table.provider_account_id),
    index("idx_oauth_user_id").on(table.user_id),
    index("idx_oauth_provider").on(table.provider),
  ],
);
