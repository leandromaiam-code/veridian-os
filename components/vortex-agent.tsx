"use client";

import { useEffect, useRef, useState } from "react";

/* -----------------------------------------------------------------------------
 * VERIS — Veridian Intelligence agent
 *
 * Ethereal materialization: at +30s of session a small brass-seafoam orb
 * pulses in the bottom-right. Clicking expands into a glassmorphic chat
 * panel. Backend is the Vortex SDR widget API (same that powers kNexo).
 *
 *   POST https://vortex-sales.vercel.app/api/widget
 *   { action: "start",   product: "veridian" }
 *   { action: "message", conversation_id, content, product: "veridian" }
 * --------------------------------------------------------------------------- */

const VORTEX_API = "https://vortex-sales.vercel.app/api/widget";
const PRODUCT_KEY = "veridian";
const APPEAR_AFTER_MS = 30_000;

type Msg = { role: "agent" | "user"; text: string };

const FALLBACK_WELCOME =
  "I'm Veris, the Veridian intelligence. Tell me about your idea — I'll show you what we'd build in 2 weeks.";

export function VortexAgent() {
  // visibility phases
  const [appeared, setAppeared] = useState(false); // orb materialized
  const [expanded, setExpanded] = useState(false); // chat panel open

  // conversation state
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 30-second arrival timer (persists across hot reloads in dev)
  useEffect(() => {
    const t = setTimeout(() => setAppeared(true), APPEAR_AFTER_MS);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll messages on update
  useEffect(() => {
    if (!expanded) return;
    const id = requestAnimationFrame(() =>
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }),
    );
    return () => cancelAnimationFrame(id);
  }, [messages, expanded]);

  // Boot the conversation the first time the user opens the chat
  const openChat = async () => {
    setExpanded(true);
    if (conversationId || sending) return;
    setSending(true);
    setBootError(null);
    try {
      const res = await fetch(VORTEX_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", product: PRODUCT_KEY }),
      });
      const data = await res.json();
      if (data?.conversation_id) {
        setConversationId(data.conversation_id);
      }
      // Always lead with our brand welcome; the API welcome is product-config
      // dependent (and currently points at the default product).
      setMessages([{ role: "agent", text: FALLBACK_WELCOME }]);
    } catch {
      setBootError("Connection failed. Try again.");
      setMessages([{ role: "agent", text: FALLBACK_WELCOME }]);
    } finally {
      setSending(false);
    }
  };

  const send = async () => {
    const content = draft.trim();
    if (!content || sending) return;
    setDraft("");
    setMessages((m) => [...m, { role: "user", text: content }]);
    setSending(true);
    try {
      const res = await fetch(VORTEX_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "message",
          conversation_id: conversationId,
          content,
          product: PRODUCT_KEY,
        }),
      });
      const data = await res.json();
      const reply =
        (typeof data?.reply === "string" && data.reply) ||
        (typeof data?.message === "string" && data.message) ||
        (typeof data?.content === "string" && data.content) ||
        "…";
      setMessages((m) => [...m, { role: "agent", text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "agent",
          text: "Connection slipped. Try once more — I'm still here.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!appeared) return null;

  return (
    <>
      {/* -- Orb (collapsed state) ---------------------------------------- */}
      {!expanded && (
        <button
          type="button"
          onClick={openChat}
          aria-label="Talk to Veris, the Veridian intelligence"
          className="group fixed bottom-5 right-5 lg:bottom-7 lg:right-7 z-50 w-[68px] h-[68px] lg:w-[76px] lg:h-[76px] rounded-full flex items-center justify-center pointer-events-auto"
          style={{ animation: "veris-arrive 700ms var(--ease-organic, cubic-bezier(0.22, 1, 0.36, 1)) both" }}
        >
          {/* Soft outer glow — breathing */}
          <span
            aria-hidden
            className="absolute inset-[-24px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(232,200,138,0.35) 0%, rgba(232,200,138,0.10) 35%, rgba(232,200,138,0) 70%)",
              animation: "veris-breathe 4.2s ease-in-out infinite",
            }}
          />
          {/* Outer pulse ring */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(232,200,138,0.5)",
              animation: "veris-pulse 3s ease-out infinite",
            }}
          />
          {/* Glass core */}
          <span
            className="relative w-full h-full rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, rgba(180,210,200,0.4) 0%, rgba(50,90,80,0.65) 45%, rgba(10,22,16,0.85) 100%)",
              border: "1px solid rgba(232,200,138,0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow:
                "inset 0 0 20px rgba(133,191,168,0.35), 0 10px 28px -6px rgba(0,0,0,0.7)",
            }}
          >
            {/* Inner orb light — animated core */}
            <span
              aria-hidden
              className="absolute w-[40%] h-[40%] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(232,235,210,0.95) 0%, rgba(133,191,168,0.7) 60%, rgba(133,191,168,0) 100%)",
                filter: "blur(2px)",
                animation: "veris-core 3.5s ease-in-out infinite",
              }}
            />
            {/* Sigil (V mark) — italic Cormorant, signature touch */}
            <span
              aria-hidden
              className="relative font-cormorant text-parchment/95 text-2xl lg:text-3xl italic font-light"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
            >
              V
            </span>
          </span>
          {/* Speech balloon — clean, direct, materializes alongside the orb */}
          <span
            aria-hidden
            className="hidden sm:flex absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 items-center px-4 py-2 rounded-full whitespace-nowrap font-sans text-parchment text-[13px] lg:text-sm"
            style={{
              background: "rgba(10,22,16,0.82)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(232,200,138,0.25)",
              boxShadow: "0 8px 22px -8px rgba(0,0,0,0.65)",
              textShadow: "0 1px 6px rgba(0,0,0,0.7)",
              animation: "veris-balloon 900ms cubic-bezier(0.22, 1, 0.36, 1) 400ms both",
            }}
          >
            <span className="font-mono uppercase tracking-[0.22em] text-[9px] text-brass-light mr-2">
              Veris
            </span>
            <span>Need help? I&apos;m here.</span>
            {/* tail pointing to orb */}
            <span
              className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45"
              style={{
                background: "rgba(10,22,16,0.78)",
                borderRight: "1px solid rgba(232,200,138,0.32)",
                borderTop: "1px solid rgba(232,200,138,0.32)",
              }}
            />
          </span>
        </button>
      )}

      {/* -- Chat panel (expanded state) ---------------------------------- */}
      {expanded && (
        <div
          className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5 lg:right-7 lg:bottom-7 z-50 sm:w-[400px] lg:w-[420px] max-w-[calc(100vw-24px)] h-[min(72vh,640px)] rounded-[4px] flex flex-col overflow-hidden pointer-events-auto"
          style={{
            background: "rgba(10,22,16,0.72)",
            backdropFilter: "blur(22px) saturate(140%)",
            WebkitBackdropFilter: "blur(22px) saturate(140%)",
            border: "1px solid rgba(232,200,138,0.28)",
            boxShadow:
              "0 60px 100px -25px rgba(0,0,0,0.85), inset 0 0 1px rgba(232,200,138,0.3)",
            animation: "veris-expand 600ms cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: "1px solid rgba(232,200,138,0.18)" }}
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="w-2 h-2 rounded-full bg-seafoam"
                style={{
                  boxShadow:
                    "0 0 12px rgba(133,191,168,0.85), 0 0 24px rgba(133,191,168,0.5)",
                  animation: "veris-live 2.2s ease-in-out infinite",
                }}
              />
              <div className="flex flex-col leading-tight">
                <span
                  className="font-cormorant text-parchment text-base tracking-wide"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.65)" }}
                >
                  Veris
                </span>
                <span
                  className="font-mono uppercase tracking-[0.28em] text-[8.5px] text-brass-light/85"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                >
                  Veridian Intelligence
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="Minimize"
              className="font-mono uppercase tracking-[0.22em] text-[10px] text-parchment/55 hover:text-brass-light transition-colors duration-500 px-2 py-1"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <span
                  className="font-mono uppercase tracking-[0.28em] text-[10px] text-brass-light/70"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
                >
                  Materializing…
                </span>
              </div>
            )}
            {messages.map((m, i) =>
              m.role === "agent" ? (
                <AgentMessage key={i} text={m.text} />
              ) : (
                <UserMessage key={i} text={m.text} />
              ),
            )}
            {sending && messages.length > 0 && (
              <div className="flex items-center gap-2 px-1">
                <Dot delay={0} />
                <Dot delay={120} />
                <Dot delay={240} />
              </div>
            )}
            {bootError && (
              <p className="font-mono uppercase tracking-[0.18em] text-[9px] text-[#e8634a]">
                {bootError}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <div
            className="px-5 py-4"
            style={{ borderTop: "1px solid rgba(232,200,138,0.18)" }}
          >
            <div className="flex items-end gap-3">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                placeholder="Tell me about your idea…"
                className="flex-1 resize-none bg-transparent border-b border-brass-light/25 focus:border-brass-light/80 outline-none font-cormorant text-parchment text-base lg:text-lg placeholder:text-parchment/35 py-2 transition-colors"
                style={{ caretColor: "#e8c88a", maxHeight: 120 }}
                disabled={sending}
              />
              <button
                type="button"
                onClick={send}
                disabled={sending || !draft.trim()}
                aria-label="Send"
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-parchment hover:text-[#0a1610] hover:bg-brass-light transition-all duration-400 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  border: "1px solid rgba(232,200,138,0.45)",
                  background: "rgba(232,200,138,0.08)",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 13V3M8 3l-4 4M8 3l4 4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx global>{`
        @keyframes veris-arrive {
          0% {
            opacity: 0;
            transform: scale(0.4) translateY(20px);
            filter: blur(8px);
          }
          50% {
            opacity: 1;
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
        @keyframes veris-breathe {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.18); opacity: 1; }
        }
        @keyframes veris-pulse {
          0% { transform: scale(1); opacity: 0.7; }
          70% { transform: scale(1.55); opacity: 0; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        @keyframes veris-core {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.9; }
          33% { transform: scale(1.15) translate(2px, -1px); opacity: 1; }
          66% { transform: scale(0.95) translate(-1px, 2px); opacity: 0.8; }
        }
        @keyframes veris-expand {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.85);
            filter: blur(10px);
          }
          60% {
            opacity: 1;
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes veris-live {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @keyframes veris-dot {
          0%, 80%, 100% { opacity: 0.2; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-3px); }
        }
        @keyframes veris-balloon {
          0% {
            opacity: 0;
            transform: translate(12px, -50%) scale(0.85);
            filter: blur(6px);
          }
          70% {
            opacity: 1;
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translate(0, -50%) scale(1);
            filter: blur(0);
          }
        }
      `}</style>
    </>
  );
}

function AgentMessage({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="font-mono uppercase tracking-[0.28em] text-[8.5px] text-brass-light/75"
        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
      >
        Veris
      </span>
      <p
        className="font-cormorant text-parchment text-base lg:text-lg italic font-light leading-[1.45]"
        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
      >
        {text}
      </p>
    </div>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-1.5 items-end">
      <span
        className="font-mono uppercase tracking-[0.28em] text-[8.5px] text-parchment/55"
        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
      >
        You
      </span>
      <p
        className="font-cormorant text-parchment/90 text-base lg:text-lg font-light leading-[1.45] text-right max-w-[88%]"
        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
      >
        {text}
      </p>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-brass-light/80"
      style={{
        animation: "veris-dot 1.4s ease-in-out infinite",
        animationDelay: `${delay}ms`,
      }}
    />
  );
}
