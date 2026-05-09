const APP_NAME = "LOGIQ";

function getAppUrl(): string {
  return (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
}

export function buildPasswordResetUrl(token: string): string {
  return `${getAppUrl()}/reset-password?token=${encodeURIComponent(token)}`;
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
): Promise<void> {
  const subject = `Reset your ${APP_NAME} password`;
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2563eb;">${APP_NAME} Password Reset</h2>
  <p>You requested a password reset for your ${APP_NAME} account.</p>
  <p>
    <a href="${resetUrl}" rel="noreferrer noopener"
       style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
      Reset Your Password
    </a>
  </p>
  <p style="margin-top: 24px;">Or copy and paste this link into your browser:</p>
  <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetUrl}</p>
  <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;">
  <p style="color: #9ca3af; font-size: 12px;">
    This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
  </p>
</body>
</html>`;

  const provider = process.env.EMAIL_PROVIDER || "smtp";

  if (provider === "resend") {
    await sendViaResend(email, subject, html);
  } else {
    await sendViaSmtp(email, subject, html);
  }
}

async function sendViaResend(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  const from = process.env.EMAIL_FROM || "noreply@logiq.dev";

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
    signal: controller.signal,
  })

  clearTimeout(timeout)

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error: ${response.status} ${body}`);
  }
}

async function sendViaSmtp(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  let nodemailer: typeof import("nodemailer");
  try {
    nodemailer = await import("nodemailer");
  } catch {
    throw new Error(
      "nodemailer is not installed. Install with: pnpm add nodemailer, or set EMAIL_PROVIDER=resend and RESEND_API_KEY.",
    );
  }

  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10)

  if (smtpPort < 1 || smtpPort > 65535 || isNaN(smtpPort)) {
    throw new Error(`Invalid SMTP_PORT: "${process.env.SMTP_PORT}". Must be 1-65535.`)
  }

  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: smtpPort,
    secure: process.env.SMTP_SECURE === "true",
    auth: smtpUser && smtpPass ? {
      user: smtpUser,
      pass: smtpPass,
    } : undefined,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "noreply@logiq.dev",
    to,
    subject,
    html,
  });
}

