"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

import { WhatsAppButton } from "@/components/site/whatsapp-button";
import type { PublicSettings } from "@/lib/storefront";

type PromoBannerProps = { settings: PublicSettings };

export function PromoBanner({ settings }: PromoBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const promos = [
    { eyebrow: settings.heroEyebrow, title: settings.heroTitle, description: settings.heroDescription, cta: settings.heroCtaLabel },
    { eyebrow: settings.promoTwoEyebrow, title: settings.promoTwoTitle, description: settings.promoTwoDescription, cta: settings.promoTwoCtaLabel },
    { eyebrow: settings.promoThreeEyebrow, title: settings.promoThreeTitle, description: settings.promoThreeDescription, cta: settings.promoThreeCtaLabel },
  ];
  const activePromo = promos[activeIndex];
  const isContactPromo = activeIndex === 2;
  const changeSlide = (direction: -1 | 1) =>
    setActiveIndex((current) => (current + direction + promos.length) % promos.length);

  return (
    <section
      aria-label="Current promotions"
      className="relative overflow-hidden rounded-[1.75rem] border border-[#deded9] bg-[var(--brand)] text-white shadow-[0_16px_44px_rgba(23,23,22,0.12)]"
    >
      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.1),transparent_38%,transparent_66%,rgba(255,255,255,0.08))]" />

      {/* Two-column grid */}
      <div className="relative grid lg:grid-cols-[minmax(0,1fr)_16rem]">

        {/* ── Left: content column ─────────────────────────────── */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-start p-5 pb-20 sm:p-8 sm:pb-24 lg:p-12 lg:pb-28"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/62">
              {activePromo.eyebrow}
            </p>

            <h1 className="mt-8 max-w-[12ch] text-[clamp(2.35rem,5.5vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.075em]">
              {activePromo.title}
            </h1>

            <p className="mt-5 max-w-md text-sm leading-6 text-white/68 sm:text-base">
              {activePromo.description}
            </p>

            {isContactPromo ? (
              <WhatsAppButton
                label={activePromo.cta}
                variant="ghost"
                size="default"
                className="mt-7 h-auto rounded-none border-b border-white/45 px-0 pb-2 text-white hover:bg-transparent hover:text-white"
              />
            ) : (
              <a
                href="#collection"
                className="mt-7 inline-flex items-center gap-2 border-b border-white/45 pb-2 text-sm font-semibold text-white transition hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {activePromo.cta}
                <ArrowUpRight className="size-4" />
              </a>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Right: decorative panel (desktop only) ──────────── */}
        <div className="pointer-events-none relative hidden border-l border-white/10 bg-white/[0.035] lg:block">
          <div className="absolute inset-x-8 top-10 border-t border-white/15" />
          <p className="absolute right-9 top-14 text-[10px] font-semibold tracking-[0.22em] text-white/38">
            DIGITAL / HNJ
          </p>
          <p className="absolute bottom-20 right-9 text-right text-6xl font-semibold leading-none tracking-[-0.08em] text-white/8">
            0{activeIndex + 1}
          </p>
        </div>
      </div>

      {/* ── Bottom: slide navigation ─────────────────────────── */}
      <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between sm:bottom-8 sm:left-8 sm:right-8 lg:left-12 lg:right-12">
        <p
          className="text-[11px] font-semibold tracking-[0.18em] text-white/58"
          aria-live="polite"
        >
          0{activeIndex + 1} / 0{promos.length}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => changeSlide(-1)}
            aria-label="Previous promotion"
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => changeSlide(1)}
            aria-label="Next promotion"
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
