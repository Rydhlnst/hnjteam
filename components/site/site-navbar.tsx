"use client";

import Link from "next/link";
import { Menu, MoveUpRight } from "lucide-react";
import { useState } from "react";

import { CartButton } from "@/components/site/cart-button";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";

const links = [
  { label: "Shop all", href: "/products" },
  { label: "Home", href: "/" },
];

function BrandMark() {
  return <span className="text-lg font-semibold tracking-[-0.07em] text-[#1d1d1b]">HnJ<span className="text-[#8b8b87]">.</span></span>;
}

export function SiteNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[#deded9]/90 bg-[#f7f7f5]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="HnJ home"><BrandMark /></Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className="text-xs font-medium uppercase tracking-[0.12em] text-[#737370] transition hover:text-[#1d1d1b]">{link.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-2 lg:flex"><CartButton /><WhatsAppButton label="Ask before ordering" size="sm" className="rounded-full" /></div>
        <div className="flex items-center gap-2 lg:hidden"><CartButton /><button className="inline-flex size-10 items-center justify-center rounded-xl border border-[#d7d7d2] bg-white text-[#1d1d1b] shadow-sm transition hover:bg-[#efefec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171716] focus-visible:ring-offset-2" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="size-[18px]" /></button></div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[min(90vw,360px)] border-l border-[#deded9] bg-[#f7f7f5] p-0 sm:max-w-md">
          <div className="flex h-full flex-col px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between pr-11"><BrandMark /><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b8b87]">Menu</span></div>
            <nav className="mt-9 border-t border-[#deded9]" aria-label="Mobile navigation">
              {links.map((link) => <SheetClose asChild key={link.href}><Link href={link.href} className="flex min-h-16 items-center justify-between border-b border-[#deded9] text-base font-semibold tracking-[-0.03em] text-[#1d1d1b] transition hover:pl-1"><span>{link.label}</span><MoveUpRight className="size-4 text-[#999995]" /></Link></SheetClose>)}
            </nav>
            <div className="mt-auto rounded-2xl bg-[#171716] p-4 text-white"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Need a quick answer?</p><p className="mt-3 text-sm leading-5 text-white/78">Ask HnJ before you choose a product.</p><WhatsAppButton label="Talk to HnJ" variant="secondary" size="lg" className="mt-4 h-11 w-full rounded-xl bg-white text-[#171716] hover:bg-[#eaeae7]" /></div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}