import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { userRole } from "./enums";

export const userRoleEnum = pgEnum("user_role", userRole);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 512 }),
    display_name: varchar("display_name", { length: 255 }).notNull(),
    role: userRoleEnum("role").default("user").notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    sql`CONSTRAINT chk_display_name_not_empty CHECK (length(trim(${table.display_name})) > 0)`,
  ],
);
