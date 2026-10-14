"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Conta a visita no Vortex (Growth Project Veridian AI Studio): página e origem, sem dado pessoal.
export function VortexVisitas() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const body = JSON.stringify({
        event: "page_view",
        company: "veridian-ai-studio",
        page_path: pathname,
        referrer: document.referrer || undefined,
        utm_source: q.get("utm_source") || undefined,
        utm_medium: q.get("utm_medium") || undefined,
        utm_campaign: q.get("utm_campaign") || undefined,
      });
      fetch("https://vortex.4profitai.com/api/capture/page-event", {
        method: "POST",
        body,
        keepalive: true,
        headers: { "Content-Type": "text/plain" },
      }).catch(() => {});
    } catch {
      /* nunca quebra a página */
    }
  }, [pathname]);
  return null;
}
