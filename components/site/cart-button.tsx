"use client";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/site/cart-provider";

export function CartButton() {
  const { itemCount, setOpen } = useCart();

  return (
    <Button variant="outline" size="icon-sm" onClick={() => setOpen(true)} className="relative bg-white" aria-label={`Open cart, ${itemCount} items`}>
      <ShoppingBag className="size-4" />
      {itemCount ? <span className="absolute -right-1.5 -top-1.5 inline-flex size-4 items-center justify-center rounded-full bg-[#171716] text-[9px] font-semibold text-white">{itemCount > 9 ? "9+" : itemCount}</span> : null}
    </Button>
  );
}
