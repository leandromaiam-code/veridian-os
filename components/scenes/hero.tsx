"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  BrassDivider,
  BrassParticles,
  Eyebrow,
  ForestButton,
  GhostButton,
  RomanNumeral,
} from "@/components/ui";

export function Hero() {
  const shieldRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-headline span", {
        yPercent: 110,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.3,
      });
      gsap.from(".hero-fade", {
        opacity: 0,
        y: 24,
        duration: 1.1,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.8,
      });
      gsap.from(".hero-shield", {
        opacity: 0,
        scale: 0.85,
        duration: 1.8,
        ease: "power3.out",
        delay: 0.1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-parchment">
      <BrassParticles count={20} />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-10 py-8 lg:px-16">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/logos/veridian-symbol.png"
            alt="Veridian"
            width={32}
            height={32}
            priority
            className="opacity-90"
          />
          <Eyebrow className="hidden sm:inline">
            Veridian · AI Studio & Venture
          </Eyebrow>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#manifesto" className="brass-link font-mono text-[11px] uppercase tracking-[0.22em]">
            Manifesto
          </a>
          <a href="#modules" className="brass-link font-mono text-[11px] uppercase tracking-[0.22em]">
            Ecosystem
          </a>
          <a href="#ventures" className="brass-link font-mono text-[11px] uppercase tracking-[0.22em]">
            Ventures
          </a>
          <a href="#apply" className="brass-link font-mono text-[11px] uppercase tracking-[0.22em]">
            Apply
          </a>
        </nav>
      </header>

      {/* Hero content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 px-10 lg:px-16 pt-8 pb-24">
        {/* Shield */}
        <div className="lg:col-span-5 xl:col-span-6 flex items-center justify-center order-2 lg:order-1">
          <div ref={shieldRef} className="hero-shield relative w-full max-w-[640px] aspect-square">
            {/* Halo */}
            <div className="absolute inset-0 -m-16 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,196,184,0.35)_0%,rgba(239,236,224,0)_60%)]" />
            <div className="absolute inset-0 -m-8 rounded-full bg-[radial-gradient(circle_at_center,rgba(201,165,107,0.18)_0%,rgba(239,236,224,0)_50%)]" />

            <div className="breathe relative w-full h-full">
              <Image
                src="/assets/logos/veridian-symbol.png"
                alt="Veridian shield"
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Reflection floor */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-[88%] w-[70%] h-32 opacity-30"
              style={{
                maskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0))",
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0))",
              }}
            >
              <Image
                src="/assets/logos/veridian-symbol.png"
                alt=""
                fill
                aria-hidden
                className="object-contain scale-y-[-1] blur-[2px]"
              />
            </div>
          </div>
        </div>

        {/* Text */}
        <div ref={textRef} className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center order-1 lg:order-2 pt-12 lg:pt-0">
          <div className="hero-fade flex items-center gap-4 mb-12">
            <RomanNumeral className="text-3xl">I.</RomanNumeral>
            <Eyebrow>Manifesto · 001</Eyebrow>
          </div>

          <h1 className="hero-headline font-cormorant font-light text-ink leading-[0.95] tracking-tight">
            <span className="block overflow-hidden">
              <span className="block text-[clamp(3rem,7.5vw,7.5rem)]">We grow</span>
            </span>
            <span className="block overflow-hidden">
              <span className="block italic text-emerald text-[clamp(3rem,7.5vw,7.5rem)]">
                autonomous
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="block text-[clamp(3rem,7.5vw,7.5rem)]">
                startups<span className="text-brass">.</span>
              </span>
            </span>
          </h1>

          <div className="hero-fade mt-10">
            <BrassDivider width="w-24" />
          </div>

          <p className="hero-fade mt-8 max-w-md font-cormorant text-stone text-2xl leading-snug font-light">
            From idea to real-world impact.
            <br />
            <span className="italic text-emerald">Built and scaled by AI.</span>
          </p>

          <div className="hero-fade mt-12 flex flex-wrap items-center gap-4">
            <ForestButton href="#apply">
              Apply your idea
              <span aria-hidden>→</span>
            </ForestButton>
            <GhostButton href="#ventures">
              View ventures
              <span aria-hidden>↓</span>
            </GhostButton>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone">
          Scroll
        </span>
        <div className="h-12 w-px bg-gradient-to-b from-brass-deep/60 to-transparent" />
      </div>
    </section>
  );
}
