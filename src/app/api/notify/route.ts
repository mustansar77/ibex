import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Gmail email notification for new applications.
 *
 * Setup (free, takes 3 minutes):
 * 1. Go to your Google Account → Security → 2-Step Verification (enable if off)
 * 2. Then go to: https://myaccount.google.com/apppasswords
 * 3. Select "Mail" and your device → Generate → copy the 16-char password
 * 4. Add to Vercel environment variables:
 *    GMAIL_USER     = your Gmail address (e.g. ibexinstitute@gmail.com)
 *    GMAIL_APP_PASSWORD = the 16-char app password (no spaces)
 *    ADMIN_NOTIFY_EMAIL = email that receives the alerts (can be same as GMAIL_USER)
 */

export async function POST(req: Request) {
  try {
    const { name, phone, program } = await req.json();

    const gmailUser     = process.env.GMAIL_USER;
    const gmailPass     = process.env.GMAIL_APP_PASSWORD;
    const notifyEmail   = process.env.ADMIN_NOTIFY_EMAIL || gmailUser;

    if (!gmailUser || !gmailPass) {
      // Not configured — silently skip, don't break the form
      return NextResponse.json({ skipped: true });
    }

    const programLabel =
      program === "entry-test" ? "Entry Test Preparation" : "Evening Coaching";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `"IBEX Institute" <${gmailUser}>`,
      to: notifyEmail,
      subject: `📋 New Application — ${name} (${programLabel})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#f8fafc;padding:24px;border-radius:12px;">
          <div style="background:#1e3a5f;border-radius:8px;padding:20px 24px;margin-bottom:20px;">
            <h2 style="color:#fff;margin:0;font-size:20px;">🎓 New Application Received</h2>
            <p style="color:#93c5fd;margin:4px 0 0;font-size:13px;">IBEX Institute Bahawalpur</p>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;width:40%;">Student Name</td>
                <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#1e293b;">${name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;">Phone</td>
                <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#1e293b;">${phone}</td></tr>
            <tr><td style="padding:10px 0;color:#64748b;font-size:13px;">Program</td>
                <td style="padding:10px 0;font-weight:bold;color:#1e3a5f;">${programLabel}</td></tr>
          </table>
          <div style="margin-top:20px;text-align:center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://ibex-dusky.vercel.app"}/admin/applications"
               style="display:inline-block;background:#1e3a5f;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">
              Review Application →
            </a>
          </div>
          <p style="color:#94a3b8;font-size:11px;text-align:center;margin-top:16px;">IBEX Institute Admin Panel</p>
        </div>
      `,
    });

    return NextResponse.json({ sent: true });
  } catch (e) {
    // Never let notification failure break the submission
    console.error("[notify] Email error:", e);
    return NextResponse.json({ error: "notification failed" }, { status: 200 });
  }
}
