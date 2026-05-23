"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BrassDivider,
  Eyebrow,
  PullQuote,
  RomanNumeral,
  SectionLabel,
} from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".manifesto-line", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 50%",
        },
      });

      gsap.to(".manifesto-shield", {
        rotation: 360,
        duration: 80,
        ease: "none",
        repeat: -1,
      });

      gsap.to(".manifesto-shield-wrap", {
        y: -60,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative py-32 lg:py-40 bg-parchment"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-10 lg:px-16">
        {/* Text */}
        <div className="lg:col-span-7 max-w-2xl">
          <SectionLabel number="002" name="Manifesto" className="manifesto-line mb-12" />

          <div className="flex items-baseline gap-6 mb-10">
            <RomanNumeral className="text-7xl manifesto-line">II.</RomanNumeral>
            <h2 className="manifesto-line font-cormorant font-light text-ink text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05]">
              Most companies
              <br />
              <span className="text-stone">hire teams.</span>
            </h2>
          </div>

          <PullQuote className="manifesto-line text-3xl lg:text-4xl leading-tight mb-12">
            We build systems that{" "}
            <span className="not-italic text-ink font-normal">build the company</span>.
          </PullQuote>

          <BrassDivider width="w-24" className="manifesto-line mb-10" />

          <p className="manifesto-line font-sans text-stone text-lg leading-relaxed max-w-xl">
            Three modules —{" "}
            <span className="text-ink font-medium underline decoration-brass decoration-1 underline-offset-4">
              Jarvis
            </span>
            ,{" "}
            <span className="text-ink font-medium underline decoration-brass decoration-1 underline-offset-4">
              Fabric
            </span>
            ,{" "}
            <span className="text-ink font-medium underline decoration-brass decoration-1 underline-offset-4">
              Vortex
            </span>{" "}
            — operate as one organism. They research markets, design products, write
            code, generate sales, manage operations.
          </p>

          <p className="manifesto-line mt-8 font-cormorant italic text-2xl text-emerald font-light">
            You bring the idea. We grow the venture.
          </p>
        </div>

        {/* Shield pinned right */}
        <div className="lg:col-span-5 hidden lg:flex items-start justify-center">
          <div className="manifesto-shield-wrap sticky top-32 w-full max-w-md aspect-square">
            <div className="absolute inset-0 -m-12 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,196,184,0.25)_0%,rgba(239,236,224,0)_60%)]" />
            <div className="manifesto-shield relative w-full h-full">
              <Image
                src="/assets/logos/veridian-symbol.png"
                alt=""
                fill
                aria-hidden
                className="object-contain opacity-90"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
