import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, phone, program } = await req.json();

    const apiKey     = process.env.CALLMEBOT_API_KEY;
    const adminPhone = process.env.ADMIN_WHATSAPP_PHONE || "923115170829";

    if (!apiKey) {
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
      "http://your-domain.com/admin/applications",
    ].join("\n");

    const url = `https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;

    await fetch(url, { method: "GET" });

    return NextResponse.json({ sent: true });
  } catch {
    // Never let notification failure break the submission
    return NextResponse.json({ error: "notification failed" }, { status: 200 });
  }
}
