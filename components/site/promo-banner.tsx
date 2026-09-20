"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Button } from "@/components/ui/button";
import type { PublicSettings } from "@/lib/storefront";

type PromoBannerProps = { settings: PublicSettings };

export function PromoBanner({ settings }: PromoBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const promos = [
    { eyebrow: settings.heroEyebrow, title: settings.heroTitle, description: settings.heroDescription, cta: settings.heroCtaLabel, tone: "dark" },
    { eyebrow: settings.promoTwoEyebrow, title: settings.promoTwoTitle, description: settings.promoTwoDescription, cta: settings.promoTwoCtaLabel, tone: "light" },
    { eyebrow: settings.promoThreeEyebrow, title: settings.promoThreeTitle, description: settings.promoThreeDescription, cta: settings.promoThreeCtaLabel, tone: "warm" },
  ];
  const activePromo = promos[activeIndex];
  const isContactPromo = activeIndex === 2;
  const changeSlide = (direction: -1 | 1) => setActiveIndex((current) => (current + direction + promos.length) % promos.length);

  return (
    <section aria-label="Current promotions" className="relative overflow-hidden rounded-[1.75rem] border border-[#deded9] bg-[#171716] text-white shadow-[0_16px_44px_rgba(23,23,22,0.12)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.1),transparent_38%,transparent_66%,rgba(255,255,255,0.08))]" />
      <div className="relative grid min-h-[22rem] overflow-hidden p-5 sm:min-h-[25rem] sm:p-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:p-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={activeIndex} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -10 }} transition={{ duration: 0.22, ease: "easeOut" }} className="relative z-10 flex max-w-2xl flex-col items-start">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/62"><Sparkles className="size-3.5" />{activePromo.eyebrow}</p>
            <h1 className="mt-auto max-w-[12ch] pt-16 text-[clamp(2.35rem,6vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.075em]">{activePromo.title}</h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/68 sm:text-base">{activePromo.description}</p>
            {isContactPromo ? <WhatsAppButton label={activePromo.cta} variant="secondary" size="lg" className="mt-7 h-11 rounded-full border border-white/10 bg-white px-4 text-[#171716] shadow-sm hover:bg-[#eaeae7]" /> : <Button asChild variant="secondary" size="lg" className="mt-7 h-11 rounded-full border border-white/10 bg-white px-4 text-[#171716] shadow-sm hover:bg-[#eaeae7]"><a href="#collection">{activePromo.cta}<ArrowUpRight /></a></Button>}
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[38%] border-l border-white/10 bg-white/[0.035] lg:block"><div className="absolute inset-x-8 top-10 border-t border-white/15" /><p className="absolute right-9 top-14 text-[10px] font-semibold tracking-[0.22em] text-white/38">DIGITAL / HNJ</p><p className="absolute bottom-10 right-9 text-right text-6xl font-semibold leading-none tracking-[-0.08em] text-white/8">0{activeIndex + 1}</p></div>

        <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between sm:bottom-8 sm:left-8 sm:right-8 lg:left-10 lg:right-10">
          <div className="flex items-center gap-2" role="tablist" aria-label="Promotions">{promos.map((promo, index) => <button key={promo.title} type="button" role="tab" aria-selected={activeIndex === index} aria-label={`Show promotion ${index + 1}`} onClick={() => setActiveIndex(index)} className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${activeIndex === index ? "w-8 bg-white" : "w-1.5 bg-white/35 hover:bg-white/65"}`} />)}</div>
          <div className="flex gap-2"><button type="button" onClick={() => changeSlide(-1)} aria-label="Previous promotion" className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><ChevronLeft className="size-4" /></button><button type="button" onClick={() => changeSlide(1)} aria-label="Next promotion" className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><ChevronRight className="size-4" /></button></div>
        </div>
      </div>
    </section>
  );
}
