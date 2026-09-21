import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SiteNavbar } from "@/components/site/site-navbar";

export default function NotFound() {
  return <div className="min-h-screen bg-[#f5f5f3]"><SiteNavbar /><main className="mx-auto flex max-w-[1440px] flex-col items-start px-4 py-32 sm:px-6 lg:px-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b938c]">404</p><h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-[#1d1d1b]">That page wandered off.</h1><p className="mt-5 max-w-md text-base leading-7 text-[#6a726b]">The product you are looking for may have moved, or it never existed in the first place.</p><Button asChild className="mt-8"><Link href="/products">Back to catalog</Link></Button></main></div>;
}

