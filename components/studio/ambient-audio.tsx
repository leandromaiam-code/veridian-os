"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Background ambient track. Loops at very low volume. User can toggle anytime.
 * Persists preference in localStorage. Respects browser autoplay policy:
 * waits for the first user interaction before attempting to play.
 */
const STORAGE_KEY = "veridian_audio";
// Ambient floor — barely audible. Should sit under voice/typing, never compete.
const VOLUME = 0.045;

export function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Read preference + listen for first interaction
  useEffect(() => {
    setMounted(true);
    try {
      const pref = localStorage.getItem(STORAGE_KEY);
      // Default: ON. Only off if user explicitly muted.
      setEnabled(pref !== "off");
    } catch {
      setEnabled(true);
    }

    const onInteract = () => {
      setInteracted(true);
    };
    window.addEventListener("pointerdown", onInteract, { once: true });
    window.addEventListener("wheel", onInteract, { once: true, passive: true });
    window.addEventListener("touchstart", onInteract, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", onInteract, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("wheel", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, []);

  // Drive playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = VOLUME;
    audio.loop = true;
    if (enabled && interacted) {
      audio.play().catch(() => {
        // Autoplay may still be blocked even after interaction in some cases
      });
    } else {
      audio.pause();
    }
  }, [enabled, interacted]);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {}
    // If turning on without prior interaction (rare — button click counts),
    // mark interacted so the effect picks it up.
    if (next) setInteracted(true);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/assets/audio/clockwork-ascent.mp3"
        preload="auto"
        loop
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={enabled ? "Mute background track" : "Play background track"}
        title={enabled ? "Mute background track" : "Play background track"}
        className="fixed bottom-5 left-4 lg:bottom-6 lg:left-6 z-40 inline-flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-brass-light/30 hover:border-brass-light/70 text-parchment/75 hover:text-brass-light transition-all duration-500"
        style={{
          background: "rgba(10,22,16,0.55)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 6px 18px -4px rgba(0,0,0,0.55)",
          opacity: mounted ? 1 : 0,
          transition:
            "opacity 1.5s var(--ease-organic), border-color 0.5s, color 0.5s",
        }}
      >
        {enabled ? <SpeakerOnIcon active={enabled && interacted} /> : <SpeakerOffIcon />}
      </button>
    </>
  );
}

function SpeakerOnIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* speaker body */}
      <path d="M3 5.5h2.5L9 3v10L5.5 10.5H3z" />
      {/* sound waves */}
      <path
        d="M11.5 6.2c.7.6 1 1.4 1 2.3s-.3 1.7-1 2.3"
        opacity={active ? 1 : 0.5}
      />
      <path
        d="M13 4.3c1.3 1 2 2.4 2 4.2s-.7 3.2-2 4.2"
        opacity={active ? 0.85 : 0.35}
      />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 5.5h2.5L9 3v10L5.5 10.5H3z" />
      {/* X mark */}
      <path d="M11.5 6.5l3 3M14.5 6.5l-3 3" />
    </svg>
  );
}
