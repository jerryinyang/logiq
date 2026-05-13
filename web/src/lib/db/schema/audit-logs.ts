import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core"

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id"),
    action: varchar("action", { length: 100 }).notNull(),
    ip_address: varchar("ip_address", { length: 45 }),
    user_agent: varchar("user_agent", { length: 512 }),
    metadata: jsonb("metadata"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_audit_logs_user_id").on(table.user_id),
    index("idx_audit_logs_action").on(table.action),
    index("idx_audit_logs_created_at").on(table.created_at),
  ],
)