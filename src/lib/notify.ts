import "server-only";

type MoreRequest = {
  email: string;
  shopName: string;
  shopSlug: string;
  wanted: string;
  note: string;
};

/**
 * Emails a "more products" request to the site owner with Resend.
 * Needs RESEND_API_KEY and REQUESTS_NOTIFY_EMAIL; without them it does nothing, and the
 * request is still saved in the database. RESEND_FROM is optional (Resend's test sender
 * only delivers to the email address that owns the Resend account).
 */
export async function emailMoreRequest(r: MoreRequest) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.REQUESTS_NOTIFY_EMAIL;
  if (!key || !to) return;

  const site = (process.env.SITE_URL ?? "").replace(/\/$/, "");
  const text = [
    "Someone wants more than the free product limit.",
    "",
    `Email: ${r.email}`,
    `Shop: ${r.shopName || "(no name yet)"}${r.shopSlug && site ? ` - ${site}/${r.shopSlug}` : ""}`,
    `Products wanted: ${r.wanted || "not chosen"}`,
    `Note: ${r.note || "(none)"}`,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "My Product Shelf <onboarding@resend.dev>",
      to: [to],
      reply_to: r.email,
      subject: `More products request: ${r.shopName || r.email}`,
      text,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text().catch(() => "")}`);
}
