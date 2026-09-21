"use client";

import Link from "next/link";
import { Menu, MoveUpRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import { CartButton } from "@/components/site/cart-button";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";

const ease = [0.22, 1, 0.36, 1] as const;

const navStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const navItem = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
};

const links = [
  { label: "Shop all", href: "/products" },
  { label: "Home", href: "/" },
];

type Props = { siteName: string; logoPublicUrl?: string };

function BrandMark({ siteName, logoPublicUrl }: Props) {
  if (logoPublicUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoPublicUrl} alt={siteName} className="h-8 w-auto max-w-[140px] object-contain" />;
  }
  return (
    <span className="text-lg font-semibold tracking-[-0.07em] text-[#1d1d1b]">
      {siteName}<span className="text-[#8b8b87]">.</span>
    </span>
  );
}

export function NavbarInner({ siteName, logoPublicUrl }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8"
        variants={navStagger}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={navItem}>
          <Link href="/" aria-label={`${siteName} home`}>
            <BrandMark siteName={siteName} logoPublicUrl={logoPublicUrl} />
          </Link>
        </motion.div>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <motion.div key={link.href} variants={navItem}>
              <Link href={link.href} className="text-xs font-medium uppercase tracking-[0.12em] text-[#737370] transition hover:text-[#1d1d1b]">
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>
        <motion.div variants={navItem} className="hidden items-center gap-2 lg:flex">
          <CartButton />
          <WhatsAppButton label="Ask before ordering" size="sm" className="rounded-full" />
        </motion.div>
        <motion.div variants={navItem} className="flex items-center gap-2 lg:hidden">
          <CartButton />
          <button
            className="inline-flex size-10 items-center justify-center rounded-xl border border-[#d7d7d2] bg-white text-[#1d1d1b] shadow-sm transition hover:bg-[#efefec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171716] focus-visible:ring-offset-2"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-[18px]" />
          </button>
        </motion.div>
      </motion.div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[min(90vw,360px)] border-l border-[#deded9] bg-[#f7f7f5] p-0 sm:max-w-md">
          <div className="flex h-full flex-col px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between pr-11">
              <BrandMark siteName={siteName} logoPublicUrl={logoPublicUrl} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b8b87]">Menu</span>
            </div>
            <nav className="mt-9 border-t border-[#deded9]" aria-label="Mobile navigation">
              {links.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link href={link.href} className="flex min-h-16 items-center justify-between border-b border-[#deded9] text-base font-semibold tracking-[-0.03em] text-[#1d1d1b] transition hover:pl-1">
                    <span>{link.label}</span>
                    <MoveUpRight className="size-4 text-[#999995]" />
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto rounded-2xl bg-[#171716] p-4 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Need a quick answer?</p>
              <p className="mt-3 text-sm leading-5 text-white/78">Ask {siteName} before you choose a product.</p>
              <WhatsAppButton label={`Talk to ${siteName}`} variant="secondary" size="lg" className="mt-4 h-11 w-full rounded-xl bg-white text-[#171716] hover:bg-[#eaeae7]" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
