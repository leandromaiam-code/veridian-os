"use client";

import { useState } from "react";
import { useLocale, useT, whatsappUrl } from "@/lib/i18n";

type Status = "idle" | "sending" | "sent" | "fallback";

/* Closing form: name, contact, idea. Posts to /api/lead; if that cannot store
 * the lead it opens WhatsApp with the same message prefilled, so nothing the
 * visitor typed is lost. */
export function LeadForm({ active }: { active: boolean }) {
  const t = useT();
  const locale = useLocale();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [idea, setIdea] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  // WhatsApp: full name and phone are required before the chat opens.
  const [wa, setWa] = useState(false);
  const [waName, setWaName] = useState("");
  const [waPhone, setWaPhone] = useState("");
  const [waError, setWaError] = useState("");

  const leadMessage = () =>
    t.form.whatsappLead
      .replace("{name}", name.trim())
      .replace("{contact}", contact.trim())
      .replace("{idea}", idea.trim());

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, idea, website, locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      window.open(whatsappUrl(leadMessage()), "_blank", "noopener");
      setStatus("fallback");
    }
  };

  const openWhatsapp = () => {
    const fullName = waName.trim().replace(/\s+/g, " ");
    const digits = waPhone.replace(/\D/g, "");
    if (fullName.split(" ").filter((w) => w.length > 1).length < 2) {
      setWaError(t.form.waNameError);
      return;
    }
    if (digits.length < 10 || digits.length > 15) {
      setWaError(t.form.waPhoneError);
      return;
    }
    setWaError("");
    const phone = waPhone.trim();
    // Open first (same click, so the browser does not block it), then store the lead.
    window.open(
      whatsappUrl(t.form.waMessage.replace("{name}", fullName).replace("{phone}", phone)),
      "_blank",
      "noopener",
    );
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullName,
        contact: phone,
        idea: idea.trim() || t.whatsappText,
        website,
        locale,
        channel: "whatsapp",
      }),
      keepalive: true,
    }).catch(() => null);
    setWa(false);
  };

  if (status === "sent" || status === "fallback") {
    return (
      <div className="mt-6 lg:mt-8 w-full max-w-xl text-center" role="status">
        <p className="font-cormorant text-brass-light text-2xl lg:text-3xl">
          {t.form.sentTitle}
        </p>
        <p className="mt-2 font-sans text-parchment text-sm lg:text-base leading-relaxed">
          {status === "sent" ? t.form.sent : t.form.fallback}
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-[3px] border border-brass-light/30 bg-[rgba(6,14,11,0.55)] px-3.5 py-2.5 font-sans text-[15px] text-parchment placeholder:text-parchment/55 outline-none transition-colors focus:border-brass-light";

  return (
    <form
      onSubmit={onSubmit}
      className="mt-5 lg:mt-7 w-full max-w-xl flex flex-col gap-2.5 text-left"
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <input
          className={field}
          type="text"
          required
          maxLength={120}
          autoComplete="name"
          placeholder={t.form.name}
          aria-label={t.form.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={field}
          type="text"
          required
          minLength={5}
          maxLength={160}
          placeholder={t.form.contact}
          aria-label={t.form.contact}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </div>
      <textarea
        className={`${field} resize-none`}
        required
        rows={2}
        maxLength={2000}
        placeholder={t.form.idea}
        aria-label={t.form.idea}
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
      />
      {/* Honeypot — hidden from people, tempting for bots */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />

      <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-3 px-7 lg:px-8 py-3 rounded-full bg-brass-deep/85 backdrop-blur-sm text-parchment font-mono uppercase whitespace-nowrap tracking-[0.14em] sm:tracking-[0.22em] text-[12.5px] lg:text-[13px] transition-all duration-500 hover:bg-brass hover:gap-4 hover:shadow-[0_30px_60px_-20px_rgba(232,200,138,0.6)] border border-brass-light/40 disabled:opacity-60"
        >
          {status === "sending" ? t.form.sending : t.form.submit}
          <span aria-hidden>↗</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setWa((v) => !v);
            setWaError("");
            if (!waName && name) setWaName(name);
          }}
          aria-expanded={wa}
          className="font-mono uppercase tracking-[0.18em] text-[11.5px] text-brass-light underline underline-offset-4 decoration-brass-light/40 hover:decoration-brass-light transition-colors"
        >
          {t.form.or}
        </button>
      </div>

      {wa && (
        <div className="mt-3 flex flex-col gap-2.5 rounded-[3px] border border-brass-light/30 bg-[rgba(6,14,11,0.55)] p-3.5">
          <p className="font-sans text-[13px] text-parchment">{t.form.waTitle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              className={field}
              type="text"
              maxLength={120}
              autoComplete="name"
              placeholder={t.form.waName}
              aria-label={t.form.waName}
              value={waName}
              onChange={(e) => setWaName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), openWhatsapp())}
            />
            <input
              className={field}
              type="tel"
              inputMode="tel"
              maxLength={25}
              autoComplete="tel"
              placeholder={t.form.waPhone}
              aria-label={t.form.waPhone}
              value={waPhone}
              onChange={(e) => setWaPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), openWhatsapp())}
            />
          </div>
          {waError && (
            <p role="alert" className="font-sans text-[13px] text-brass-light">
              {waError}
            </p>
          )}
          <button
            type="button"
            onClick={openWhatsapp}
            className="self-center inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-brass-deep/85 text-parchment font-mono uppercase tracking-[0.18em] text-[12px] border border-brass-light/40 transition-all hover:bg-brass"
          >
            {t.form.waOpen}
            <span aria-hidden>↗</span>
          </button>
        </div>
      )}
    </form>
  );
}
