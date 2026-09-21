import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Separator } from "@/components/ui/separator";
import { getPublicSettings } from "@/lib/catalog-db";

export async function SiteFooter() {
  const settings = await getPublicSettings();
  return (
    <footer className="border-t border-[#2e2e2b] bg-[#1d1d1b] text-[#f5f5f3]">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_0.7fr_0.9fr] sm:gap-8">
          <div>
            <Link href="/" className="text-xl font-semibold tracking-[-0.06em]">{settings.siteName}<span className="text-[#8f8f8a]">.</span></Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#a7a7a1]">Simple digital products for work, business, and everyday making.</p>
          </div>
          <nav aria-label="Footer navigation">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#858580]">Explore</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#d1d1cc]">
              <Link href="/" className="transition hover:text-white">Home</Link>
              <Link href="/products" className="transition hover:text-white">Shop all products</Link>
            </div>
          </nav>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#858580]">Get in touch</p>
            <p className="mt-4 text-sm leading-6 text-[#a7a7a1]">Questions before ordering? Our admin can help.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 rounded-2xl bg-[#2a2a27] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div><p className="text-xs uppercase tracking-[0.16em] text-[#858580]">Need a hand?</p><h2 className="mt-2 text-xl font-medium tracking-[-0.04em]">Talk to {settings.siteName} Admin.</h2></div>
          <WhatsAppButton label="Chat with admin" variant="secondary" size="sm" />
        </div>

        <Separator className="my-8 bg-[#353531]" />
        <div className="flex flex-col gap-3 text-xs text-[#858580] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2025 HnJ. All rights reserved.</span>
          <span className="inline-flex items-center gap-1">Made for useful things <ArrowUpRight className="size-3" /></span>
        </div>
      </div>
    </footer>
  );
}
