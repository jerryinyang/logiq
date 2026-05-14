import nodemailer from "nodemailer"
import { writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"

const APP_NAME = "LOGIQ"

function getAppUrl(): string {
  return (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "")
}

interface PasswordChangeEmailData {
  displayName: string
}

export function buildPasswordChangeHtml(data: PasswordChangeEmailData): string {
  const supportUrl = `${getAppUrl()}/forgot-password`

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2563eb;">${APP_NAME} Password Changed</h2>
  <p>Hi ${data.displayName},</p>
  <p>Your password for your ${APP_NAME} account was successfully changed.</p>
  <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
  <p style="margin-top: 24px;">If you made this change, no further action is required.</p>
  <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;">
  <p style="color: #dc2626; font-weight: bold;">Did not make this change?</p>
  <p style="color: #374151;">
    If you did not change your password, your account may be compromised. Please take the following steps immediately:
  </p>
  <ol style="color: #374151;">
    <li>Reset your password immediately</li>
    <li>Review your account for any unauthorized changes</li>
    <li>Contact support if you need assistance</li>
  </ol>
  <p style="margin-top: 16px;">
    <a href="${supportUrl}" rel="noreferrer noopener"
       style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
      Reset Your Password Now
    </a>
  </p>
  <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;">
  <p style="color: #9ca3af; font-size: 12px;">
    This is a security notification from ${APP_NAME}. If you need help, please contact our support team.
  </p>
</body>
</html>`
}

export async function sendPasswordChangeEmail(
  email: string,
  data: PasswordChangeEmailData,
): Promise<void> {
  const subject = `Your ${APP_NAME} password was changed`
  const html = buildPasswordChangeHtml(data)

  console.log("========================================")
  console.log(`[PASSWORD CHANGE] To: ${email}`)
  console.log("========================================")

  const provider = process.env.EMAIL_PROVIDER || "resend"

  if (provider === "resend") {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set")
    }
    const from = process.env.EMAIL_FROM || "noreply@logiq.dev"

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: email, subject, html }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const body = await response.text()
      let hint = ""
      if (response.status === 403 && body.includes("domain is not verified")) {
        hint = " → Verify your domain at https://resend.com/domains, or switch to SMTP by setting EMAIL_PROVIDER=smtp."
      }
      throw new Error(`Resend API error: ${response.status} ${body}${hint}`)
    }
  } else if (provider === "smtp") {
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10)

    if (smtpPort < 1 || smtpPort > 65535 || isNaN(smtpPort)) {
      throw new Error(`Invalid SMTP_PORT: "${process.env.SMTP_PORT}". Must be 1-65535.`)
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "localhost",
      port: smtpPort,
      secure: process.env.SMTP_SECURE === "true",
      auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
    })

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@logiq.dev",
      to: email,
      subject,
      html,
    })
  } else {
    const timestamp = new Date().toISOString()
    const logEntry = `
========================================
DEV EMAIL @ ${timestamp}
To: ${email}
Subject: ${subject}
----------------------------------------
${html}
========================================
`

    try {
      const logDir = join(process.cwd(), "tmp")
      if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true })
      }
      const logFile = join(logDir, "dev-emails.log")
      writeFileSync(logFile, logEntry, { flag: "a" })
    } catch {
      // File logging is best-effort; don't fail the request
    }
  }
}