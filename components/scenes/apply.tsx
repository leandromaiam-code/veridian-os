"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BrassDivider,
  Eyebrow,
  ForestButton,
  RomanNumeral,
} from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

export function Apply() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".apply-anim", {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="apply"
      ref={sectionRef}
      className="relative py-32 lg:py-44 bg-parchment overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-10 lg:px-16">
        {/* Headline + shield */}
        <div className="lg:col-span-6">
          <div className="apply-anim flex items-center gap-4 mb-8">
            <Eyebrow>Apply · 006</Eyebrow>
            <BrassDivider width="w-16" />
          </div>

          <div className="apply-anim flex items-baseline gap-6 mb-10">
            <RomanNumeral className="text-6xl">VI.</RomanNumeral>
          </div>

          <h2 className="apply-anim font-cormorant font-light text-ink text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] mb-10">
            Have an idea
            <br />
            worth <span className="italic text-emerald">forging?</span>
          </h2>

          <p className="apply-anim font-cormorant italic font-light text-stone text-2xl leading-snug max-w-md mb-12">
            We take 2-3 founders per quarter. Every application reviewed
            personally.
          </p>

          <div className="apply-anim relative w-full max-w-md aspect-square hidden lg:block">
            <div className="absolute inset-0 -m-12 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,196,184,0.35)_0%,rgba(239,236,224,0)_60%)]" />
            <div className="absolute inset-0 -m-6 rounded-full bg-[radial-gradient(circle_at_center,rgba(201,165,107,0.22)_0%,rgba(239,236,224,0)_55%)]" />
            <div className="breathe relative w-full h-full">
              <Image
                src="/assets/logos/veridian-symbol.png"
                alt=""
                fill
                aria-hidden
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-6 lg:pl-12">
          {!submitted ? (
            <form
              onSubmit={onSubmit}
              className="apply-anim flex flex-col gap-8 max-w-xl"
            >
              <Field label="Your name" name="name" />
              <Field label="Email" name="email" type="email" />
              <Field label="Your idea (40 words)" name="idea" textarea />
              <Field label="Linkedin" name="linkedin" type="url" placeholder="https://" />
              <Field label="What's your edge?" name="edge" textarea />

              <div className="flex items-center justify-between pt-4">
                <span className="font-mono uppercase tracking-[0.22em] text-[10px] text-stone">
                  Q2 / 2026 · 12 in review
                </span>
                <ForestButton as="button" type="submit">
                  Submit application
                  <span aria-hidden>↗</span>
                </ForestButton>
              </div>
            </form>
          ) : (
            <div className="apply-anim flex flex-col items-start gap-6 max-w-xl">
              <div className="relative w-32 h-32 breathe">
                <Image
                  src="/assets/logos/veridian-symbol.png"
                  alt=""
                  fill
                  aria-hidden
                  className="object-contain"
                />
              </div>
              <RomanNumeral className="text-4xl">VII.</RomanNumeral>
              <h3 className="font-cormorant font-light text-ink text-5xl leading-tight">
                Application <span className="italic text-emerald">received</span>.
              </h3>
              <p className="font-sans text-stone text-lg leading-relaxed max-w-md">
                We respond within 7 days. If accepted, you&apos;ll meet the three
                modules personally.
              </p>
              <BrassDivider />
            </div>
          )}

          {/* Live counter */}
          {!submitted && (
            <div className="apply-anim mt-16 pt-8 border-t border-brass-deep/20">
              <Eyebrow className="mb-3 block">Applications Q2 / 2026</Eyebrow>
              <p className="font-cormorant text-3xl text-ink leading-tight">
                47 received <span className="text-brass">·</span> 3 selected{" "}
                <span className="text-brass">·</span> 12 in review
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="group flex flex-col gap-2">
      <span className="font-mono uppercase tracking-[0.22em] text-[10px] text-stone">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          placeholder={placeholder}
          className="resize-none border-b border-brass-deep/30 bg-transparent py-2 font-cormorant text-2xl text-ink placeholder:text-stone/40 outline-none transition-colors focus:border-brass-deep"
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className="border-b border-brass-deep/30 bg-transparent py-2 font-cormorant text-2xl text-ink placeholder:text-stone/40 outline-none transition-colors focus:border-brass-deep"
        />
      )}
    </label>
  );
}
