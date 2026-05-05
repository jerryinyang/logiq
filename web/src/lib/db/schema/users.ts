import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { userRole } from "./enums";

export const userRoleEnum = pgEnum("user_role", userRole);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 255 }),
    display_name: varchar("display_name", { length: 255 }).notNull(),
    role: userRoleEnum("role").default("user").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    session_token: varchar("session_token", { length: 255 }),
    session_expires_at: timestamp("session_expires_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_users_email").on(table.email),
  ],
);