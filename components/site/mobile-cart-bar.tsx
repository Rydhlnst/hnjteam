"use client";

import { ChevronRight, ShoppingBag } from "lucide-react";

import { useCart } from "@/components/site/cart-provider";

export function MobileCartBar() {
  const { itemCount, setOpen } = useCart();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:hidden">
      <button type="button" onClick={() => setOpen(true)} className="pointer-events-auto mx-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-[#deded9] bg-white/95 p-2 shadow-[0_12px_40px_rgba(23,23,22,0.14)] backdrop-blur" aria-label={`Open cart, ${itemCount} items`}>
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#171716] text-white"><ShoppingBag className="size-4" /></span>
        <span className="min-w-0 flex-1 text-left"><span className="block text-sm font-semibold text-[#171716]">View cart</span><span className="block text-xs text-[#777773]">{itemCount ? `${itemCount} ${itemCount === 1 ? "item" : "items"} added` : "Your cart is empty"}</span></span>
        <ChevronRight className="mr-2 size-5 text-[#777773]" />
      </button>
    </div>
  );
}
