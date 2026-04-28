import { NextResponse } from "next/server";

/**
 * Telegram Bot notification for new applications.
 *
 * Setup (free, takes 2 minutes):
 * 1. Open Telegram and message @BotFather
 * 2. Send /newbot and follow prompts → you get a BOT_TOKEN
 * 3. Start a chat with your new bot (send /start)
 * 4. Visit: https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
 *    and copy the "id" value from "chat" → that is your CHAT_ID
 * 5. Add to .env.local:
 *    TELEGRAM_BOT_TOKEN=123456:ABCdef...
 *    TELEGRAM_CHAT_ID=987654321
 */

export async function POST(req: Request) {
  try {
    const { name, phone, program } = await req.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId   = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      // Not configured — silently skip, don't break the form
      return NextResponse.json({ skipped: true });
    }

    const programLabel =
      program === "entry-test" ? "Entry Test Preparation" : "Evening Coaching";

    const message = [
      "🎓 *New Application — IBEX Institute*",
      "",
      `👤 Name: ${name}`,
      `📞 Phone: ${phone}`,
      `📚 Program: ${programLabel}`,
      "",
      "Login to admin panel to review:",
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://ibex-dusky.vercel.app"}/admin/applications`,
    ].join("\n");

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[notify] Telegram error:", err);
    }

    return NextResponse.json({ sent: res.ok });
  } catch (e) {
    // Never let notification failure break the submission
    console.error("[notify] Unexpected error:", e);
    return NextResponse.json({ error: "notification failed" }, { status: 200 });
  }
}
