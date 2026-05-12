# Deferred Work

## Deferred from: code review of 1-6-implement-password-reset-flow.md (2026-05-12)

- **[LOW] In-memory rate limiter doesn't share across instances** — Pre-existing issue in `rate-limit.ts`, not introduced by story 1.6. Needs Redis or external store for multi-instance deployments. [web/src/lib/rate-limit.ts]
- **[LOW] No background cleanup for expired reset tokens** — Tokens only deleted on use. Without a cleanup job, the `password_reset_tokens` table grows indefinitely. Needs a cron job or scheduled task. [password_reset_tokens table]
