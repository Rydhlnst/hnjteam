"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight, ShoppingBag } from "lucide-react";

import { useCart } from "@/components/site/cart-provider";

export function MobileCartBar() {
  const { itemCount, setOpen } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const summary = itemCount ? `${itemCount} ${itemCount === 1 ? "item" : "items"} added` : "Your cart is empty";

  const openCart = () => {
    setIsExpanded(false);
    setOpen(true);
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 sm:hidden">
      <AnimatePresence mode="wait" initial={false}>
        {isExpanded ? (
          <motion.button key="expanded" type="button" onClick={openCart} initial={reduceMotion ? false : { opacity: 0, scale: 0.96, x: 12 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96, x: 12 }} transition={{ duration: 0.18, ease: "easeOut" }} className="pointer-events-auto flex w-[min(calc(100vw-2rem),32rem)] items-center gap-3 rounded-2xl border border-[#deded9] bg-white/95 p-2 shadow-[0_12px_40px_rgba(23,23,22,0.14)] backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171716] focus-visible:ring-offset-2" aria-label={`Open cart, ${itemCount} items`}>
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#171716] text-white"><ShoppingBag className="size-4" /></span>
            <span className="min-w-0 flex-1 text-left"><span className="block text-sm font-semibold text-[#171716]">View cart</span><span className="block text-xs text-[#777773]">{summary}</span></span>
            <ChevronRight className="mr-2 size-5 text-[#777773]" />
          </motion.button>
        ) : (
          <motion.button key="collapsed" type="button" onClick={() => setIsExpanded(true)} initial={reduceMotion ? false : { opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, scale: 0.86 }} transition={{ duration: 0.18, ease: "easeOut" }} className="pointer-events-auto relative inline-flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-[#171716] text-white shadow-[0_12px_32px_rgba(23,23,22,0.2)] transition hover:bg-[#30302d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171716] focus-visible:ring-offset-2" aria-label={`Expand cart summary, ${itemCount} items`}>
            <ShoppingBag className="size-5" />
            {itemCount ? <span className="absolute -right-1.5 -top-1.5 inline-flex size-5 items-center justify-center rounded-full border-2 border-[#f7f7f5] bg-white text-[10px] font-semibold text-[#171716]">{itemCount > 9 ? "9+" : itemCount}</span> : null}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}