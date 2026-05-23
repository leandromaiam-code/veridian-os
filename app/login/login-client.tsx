"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Mode = "password" | "magic";

export default function LoginClient() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // If already signed in, bounce to /
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/");
    });
  }, [router]);

  const onSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setInfo(null);
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message || "Sign-in failed.");
      return;
    }
    router.push("/");
  };

  const onMagicLink = async () => {
    if (!email) {
      setError("Enter your email first.");
      return;
    }
    setError(null);
    setInfo(null);
    setSubmitting(true);
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/login`
        : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setSubmitting(false);
    if (error) {
      setError(error.message || "Could not send magic link.");
      return;
    }
    setInfo("Magic link sent. Check your inbox.");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a1620]">
      {/* Cathedral background */}
      <div className="absolute inset-0">
        <Image
          src="/assets/hero/veridian-cathedral.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(10,22,16,0.5) 0%, rgba(10,22,16,0.85) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(10,22,16,0.7) 100%)",
          }}
        />
      </div>

      <AmbientDustOverlay />

      <header className="relative z-20 flex items-center justify-between px-8 lg:px-14 py-7">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono uppercase tracking-[0.28em] text-[10px] text-parchment/75 hover:text-brass-light transition-colors"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
        >
          <span
            aria-hidden
            className="transition-transform duration-500 group-hover:-translate-x-1"
          >
            ←
          </span>
          Back to studio
        </Link>
        <span
          className="font-mono uppercase tracking-[0.28em] text-[10px] text-parchment/85"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
        >
          Veridian · AI Studio
        </span>
      </header>

      <div className="relative z-10 flex items-center justify-center px-6 py-16 min-h-[calc(100vh-120px)]">
        <form
          onSubmit={onSubmitPassword}
          className="w-full max-w-[440px] p-10 lg:p-14 rounded-[2px] relative"
          style={{
            background: "rgba(10,22,16,0.55)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            border: "1px solid rgba(232,200,138,0.25)",
            boxShadow:
              "0 50px 80px -30px rgba(0,0,0,0.75), inset 0 0 1px rgba(232,200,138,0.25)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 1.2s var(--ease-organic), transform 1.2s var(--ease-organic)",
          }}
        >
          <div className="flex flex-col items-center text-center mb-12">
            <Image
              src="/assets/logos/veridian-symbol.png"
              alt="Veridian"
              width={56}
              height={56}
              priority
              className="opacity-95 mb-6"
            />
            <span
              className="font-cormorant font-light text-parchment tracking-[0.32em] text-[clamp(1.8rem,2.6vw,2.6rem)] leading-none"
              style={{ textShadow: "0 2px 14px rgba(0,0,0,0.6)" }}
            >
              VERIDIAN
            </span>
            <span
              className="mt-3 font-mono uppercase tracking-[0.42em] text-[10px] text-brass-light"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
            >
              Enter the studio
            </span>
          </div>

          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="founder@veridian.ai"
            autoFocus
          />

          {mode === "password" && (
            <>
              <div className="h-7" />
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
              />
            </>
          )}

          {error && (
            <p className="mt-6 font-mono uppercase tracking-[0.18em] text-[9px] text-[#e8634a]">
              {error}
            </p>
          )}
          {info && (
            <p className="mt-6 font-mono uppercase tracking-[0.18em] text-[9px] text-seafoam">
              {info}
            </p>
          )}

          {mode === "password" ? (
            <button
              type="submit"
              disabled={submitting}
              className="mt-10 w-full inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-brass-deep/85 text-parchment font-mono uppercase tracking-[0.22em] text-[11px] transition-all duration-500 hover:bg-brass hover:gap-4 hover:shadow-[0_30px_60px_-20px_rgba(232,200,138,0.55)] border border-brass-light/40 disabled:opacity-50"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
            >
              {submitting ? "Entering…" : "Enter"}
              <span aria-hidden>↗</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onMagicLink}
              disabled={submitting}
              className="mt-10 w-full inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-brass-deep/85 text-parchment font-mono uppercase tracking-[0.22em] text-[11px] transition-all duration-500 hover:bg-brass hover:gap-4 hover:shadow-[0_30px_60px_-20px_rgba(232,200,138,0.55)] border border-brass-light/40 disabled:opacity-50"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
            >
              {submitting ? "Sending…" : "Send magic link"}
              <span aria-hidden>↗</span>
            </button>
          )}

          <div className="mt-8 flex items-center gap-3">
            <span className="h-px flex-1 bg-parchment/15" />
            <span className="font-mono uppercase tracking-[0.32em] text-[9px] text-parchment/40">
              or
            </span>
            <span className="h-px flex-1 bg-parchment/15" />
          </div>

          <button
            type="button"
            onClick={() => {
              setMode((m) => (m === "password" ? "magic" : "password"));
              setError(null);
              setInfo(null);
            }}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-parchment/15 text-parchment/75 font-mono uppercase tracking-[0.22em] text-[10px] transition-all duration-500 hover:border-brass-light/40 hover:text-brass-light hover:gap-3"
          >
            {mode === "password" ? "Use magic link instead" : "Use password instead"}
          </button>

          <p className="mt-8 text-center font-mono uppercase tracking-[0.22em] text-[9px] text-parchment/45">
            New here?{" "}
            <a
              href="mailto:contato@veridian.ai?subject=Veridian%20access"
              className="text-brass-light/85 hover:text-brass-light transition-colors"
            >
              Request access ↗
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono uppercase tracking-[0.22em] text-[10px] text-brass-light/85">
        {label}
      </span>
      <input
        type={type}
        required
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full border-b border-brass-light/25 bg-transparent py-2.5 font-cormorant text-lg lg:text-xl text-parchment placeholder:text-parchment/30 outline-none transition-colors focus:border-brass-light"
        style={{ caretColor: "#e8c88a" }}
      />
    </label>
  );
}

function AmbientDustOverlay() {
  const motes = Array.from({ length: 18 }).map((_, i) => ({
    left: (i * 79) % 100,
    top: (i * 53) % 100,
    size: 1.5 + ((i * 7) % 3),
    dur: 18 + ((i * 11) % 14),
    delay: (i * 3.1) % 14,
    opacity: 0.16 + ((i * 0.07) % 0.3),
    key: i,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[5]">
      {motes.map((m) => (
        <span
          key={m.key}
          className="absolute rounded-full"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            background: "#e8c88a",
            boxShadow: "0 0 6px #c9a56b",
            opacity: m.opacity,
            animation: `dust-drift ${m.dur}s ${m.delay}s linear infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes dust-drift {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          15%, 85% { opacity: 1; }
          100% { transform: translate(40px, -120vh) scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
