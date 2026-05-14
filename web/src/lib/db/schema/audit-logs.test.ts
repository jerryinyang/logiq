import { describe, it, expect } from "vitest"
import { auditLogs } from "./audit-logs"

describe("auditLogs schema", () => {
  it("should have all required columns", () => {
    const columns = Object.keys(auditLogs)
    expect(columns).toContain("id")
    expect(columns).toContain("user_id")
    expect(columns).toContain("action")
    expect(columns).toContain("ip_address")
    expect(columns).toContain("user_agent")
    expect(columns).toContain("metadata")
    expect(columns).toContain("created_at")
  })

  it("should have id as primary key", () => {
    const idColumn = auditLogs.id
    expect(idColumn).toBeDefined()
    expect(idColumn.primary).toBe(true)
  })

  it("should have action column not null", () => {
    const actionColumn = auditLogs.action
    expect(actionColumn).toBeDefined()
    expect(actionColumn.notNull).toBe(true)
  })
})