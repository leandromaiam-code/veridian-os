import { NextResponse } from "next/server";

/* -----------------------------------------------------------------------------
 * POST /api/lead — the closing form of the site.
 *
 * Stores the lead in `vortex_service_leads` (Veridian Supabase) and pings the
 * operator on WhatsApp. Both credentials are server-only env vars; when the
 * storage one is missing, or the insert fails, the route answers 503 and the
 * form falls back to opening WhatsApp with the message prefilled — a lead is
 * never silently dropped.
 *
 *   LEADS_SUPABASE_URL, LEADS_SUPABASE_SERVICE_KEY   (required to store)
 *   LEADS_EVOLUTION_URL, LEADS_EVOLUTION_APIKEY,
 *   LEADS_EVOLUTION_INSTANCE, LEADS_NOTIFY_NUMBER    (optional, notification)
 * --------------------------------------------------------------------------- */

const MAX = { name: 120, contact: 160, idea: 2000 };

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, MAX.name);
  const contact = clean(body.contact, MAX.contact);
  const idea = clean(body.idea, MAX.idea);
  const locale = body.locale === "pt" ? "pt" : "en";
  if (!name || contact.length < 5 || !idea) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const supabaseUrl = process.env.LEADS_SUPABASE_URL;
  const serviceKey = process.env.LEADS_SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ ok: false, error: "storage_unavailable" }, { status: 503 });
  }

  const insert = await fetch(`${supabaseUrl}/rest/v1/vortex_service_leads`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name,
      // The column is called `email`, but the form accepts e-mail or WhatsApp.
      email: contact,
      company: `veridian-site (${locale})`,
      project_description: idea,
    }),
  }).catch(() => null);

  if (!insert || !insert.ok) {
    return NextResponse.json({ ok: false, error: "storage_failed" }, { status: 503 });
  }

  // Best-effort notification — the lead is already stored.
  const evoUrl = process.env.LEADS_EVOLUTION_URL;
  const evoKey = process.env.LEADS_EVOLUTION_APIKEY;
  const evoInstance = process.env.LEADS_EVOLUTION_INSTANCE;
  const number = process.env.LEADS_NOTIFY_NUMBER;
  if (evoUrl && evoKey && evoInstance && number) {
    const text =
      `Novo lead no site Veridian (${locale})\n\n` +
      `Nome: ${name}\nContato: ${contact}\n\nIdeia: ${idea}`;
    await fetch(`${evoUrl.replace(/\/$/, "")}/message/sendText/${evoInstance}`, {
      method: "POST",
      headers: { apikey: evoKey, "Content-Type": "application/json" },
      body: JSON.stringify({ number, text }),
      signal: AbortSignal.timeout(8000),
    }).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}
