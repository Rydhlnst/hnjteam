"use client";

import { usePathname } from "next/navigation";

import { CartDrawer } from "@/components/site/cart-drawer";
import { MobileCartBar } from "@/components/site/mobile-cart-bar";

export function StorefrontOverlays() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;

  return <><CartDrawer /><MobileCartBar /></>;
}
