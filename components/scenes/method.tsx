"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrassDivider, Eyebrow, RomanNumeral } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    title: "Idea",
    body: "Submit your idea. We read every application personally.",
  },
  {
    num: "02",
    title: "Research",
    body: "Jarvis maps the market, surfaces gaps, finds the wedge.",
  },
  {
    num: "03",
    title: "Build",
    body: "Fabric builds the product. Agents, pipelines, infrastructure.",
  },
  {
    num: "04",
    title: "Launch",
    body: "Vortex runs the revenue motion. Sales on day one.",
  },
  {
    num: "05",
    title: "Scale",
    body: "The three modules compound. Venture grows autonomously.",
  },
];

export function Method() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 60%",
            scrub: 1,
          },
        });
      }
      gsap.from(".method-step", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-40 bg-parchment"
    >
      <div className="px-10 lg:px-16">
        <div className="flex items-center gap-4 mb-8">
          <Eyebrow>Method · 004</Eyebrow>
          <BrassDivider width="w-16" />
        </div>

        <h2 className="font-cormorant font-light text-ink text-[clamp(2.5rem,5vw,5rem)] leading-[1.02] max-w-3xl mb-20">
          <RomanNumeral className="text-[0.85em] mr-4">IV.</RomanNumeral>
          From idea
          <br />
          to <span className="italic text-emerald">venture.</span>
        </h2>

        {/* Timeline */}
        <div className="relative">
          <svg
            className="absolute left-0 right-0 top-12 w-full h-2 hidden md:block"
            viewBox="0 0 1000 4"
            preserveAspectRatio="none"
          >
            <path
              ref={pathRef}
              d="M 20 2 L 980 2"
              stroke="#c9a56b"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          <ol className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
            {steps.map((s) => (
              <li key={s.num} className="method-step relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative z-10 w-6 h-6 rounded-full bg-parchment border-2 border-brass flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-brass-deep" />
                  </div>
                  <span className="font-mono uppercase tracking-[0.22em] text-[10px] text-brass-deep">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-cormorant font-light text-3xl text-ink mb-3">
                  {s.title}
                </h3>
                <p className="font-sans text-sm text-stone leading-relaxed max-w-[200px]">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Punchline */}
        <div className="mt-32 flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-t border-brass-deep/20 pt-12">
          <div>
            <Eyebrow className="mb-4 block">Time from idea to V1</Eyebrow>
            <p className="font-cormorant font-light text-ink text-[clamp(3rem,6vw,6rem)] leading-none">
              ~12 <span className="italic text-emerald">weeks.</span>
            </p>
          </div>
          <p className="font-sans text-stone text-base max-w-sm leading-relaxed">
            Real timeline from accepted application to product live in market,
            generating revenue, with autonomous ops.
          </p>
        </div>
      </div>
    </section>
  );
}
