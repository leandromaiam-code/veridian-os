import crypto from "node:crypto";

/* Link de download assinado: só quem deixou o e-mail recebe um link que funciona.
 * A assinatura usa uma chave que existe só no servidor. */

const BASE = "https://studio.veriddan.com/api/skills/download";

function chave(): string {
  return process.env.SKILLS_DOWNLOAD_SECRET || process.env.LEADS_SUPABASE_SERVICE_KEY || "";
}

export function assinatura(slug: string, email: string): string {
  return crypto.createHmac("sha256", chave()).update(`${slug}:${email.toLowerCase()}`).digest("base64url").slice(0, 32);
}

export function linkDeDownload(slug: string, email: string): string {
  const e = Buffer.from(email.toLowerCase(), "utf8").toString("base64url");
  return `${BASE}/${slug}?e=${e}&k=${assinatura(slug, email)}`;
}

export function conferir(slug: string, e: string, k: string): string | null {
  if (!chave() || !e || !k) return null;
  let email = "";
  try { email = Buffer.from(e, "base64url").toString("utf8"); } catch { return null; }
  const esperado = assinatura(slug, email);
  const a = Buffer.from(esperado), b = Buffer.from(k);
  return a.length === b.length && crypto.timingSafeEqual(a, b) ? email : null;
}
