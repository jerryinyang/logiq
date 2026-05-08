# Deferred Work

## Deferred from: code review of 1-6-implement-password-reset-flow (2026-05-08)

- **[LOW] In-memory rate limiter doesn't share across instances** — Pre-existing issue in `rate-limit.ts`. Module-level `Map` means each process/pod has independent counters. In horizontally-scaled deployments, per-email rate limiting is trivially bypassed. Requires Redis or DB-backed rate limiter for multi-instance deployments.
- **[LOW] No background cleanup for expired reset tokens** — `password_reset_tokens` only cleaned up when someone attempts to use an expired token. Without a scheduled cleanup job (cron, DB TTL policy), the table grows indefinitely. Consider adding a periodic cleanup task or a PostgreSQL `ON DELETE` trigger.