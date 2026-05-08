const APP_NAME = "LOGIQ";
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export function buildPasswordResetUrl(token: string): string {
  return `${APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
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
    <a href="${resetUrl}"
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

  if (process.env.NODE_ENV !== "production") {
    console.log("──────────────────────────────────────────");
    console.log(`  [DEV EMAIL] Password reset for: ${email}`);
    console.log(`  [DEV EMAIL] Link: ${resetUrl}`);
    console.log("──────────────────────────────────────────");
    return;
  }

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

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

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
  const nodemailer = await getNodemailer();
  if (!nodemailer) {
    console.warn(
      "[EMAIL] nodemailer not installed. Email not sent. Install with: pnpm add nodemailer @types/nodemailer",
    );
    return;
  }

  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "noreply@logiq.dev",
    to,
    subject,
    html,
  });
}
async function getNodemailer() {
  try {
    return await new Function("return import('nodemailer')")();
  } catch {
    return null;
  }
}
