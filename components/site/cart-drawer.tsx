"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "@/components/site/cart-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/catalog";
import { getWhatsAppCheckoutHref } from "@/lib/whatsapp";

export function CartDrawer() {
  const { items, subtotal, isOpen, setOpen, setQuantity, removeItem, settings } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-[min(92vw,420px)] gap-0 border-l border-[#deded9] bg-[#f7f7f5] p-0 sm:max-w-md">
        <div className="flex h-full min-h-0 flex-col px-5 pb-5 pt-7 sm:px-6">
          <div className="pr-10"><SheetTitle className="text-2xl font-semibold tracking-[-0.06em] text-[#171716]">Your cart</SheetTitle><SheetDescription className="mt-1 text-sm text-[#777773]">Review your selections before chatting with admin.</SheetDescription></div>
          {items.length ? (
            <div className="mt-7 min-h-0 flex-1 overflow-y-auto pr-1">
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="rounded-2xl border border-[#e1e1dc] bg-white p-3">
                    <div className="flex gap-3">
                      <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#efefec] text-xs font-semibold tracking-[-0.04em] text-[#4f4f4b]">{item.name.slice(0, 2).toUpperCase()}</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#171716]">{item.name}</p>
                        <p className="mt-1 text-xs text-[#777773]">{item.variantLabel ?? item.categoryLabel}</p>
                        <p className="mt-2 text-sm font-semibold text-[#171716]">{formatPrice(item.price)}</p>
                      </div>
                      <Button variant="ghost" size="icon-xs" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}><Trash2 className="size-3.5" /></Button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-lg border border-[#e1e1dc] bg-[#fafaf8]">
                        <Button variant="ghost" size="icon-xs" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`}><Minus className="size-3" /></Button>
                        <span className="min-w-7 text-center text-xs font-semibold">{item.quantity}</span>
                        <Button variant="ghost" size="icon-xs" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`}><Plus className="size-3" /></Button>
                      </div>
                      <span className="text-sm font-semibold text-[#171716]">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-7 flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-[#d5d5d0] bg-white/70 px-6 text-center">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#efefec] text-[#5f5f5b]"><ShoppingBag className="size-5" /></span>
              <p className="mt-4 text-sm font-semibold text-[#171716]">Your cart is empty.</p>
              <p className="mt-2 text-xs leading-5 text-[#777773]">Add a product to prepare an order for WhatsApp Admin.</p>
              <Button variant="outline" size="sm" className="mt-5" onClick={() => setOpen(false)}>Continue shopping</Button>
            </div>
          )}
          {items.length ? (
            <div className="mt-5 border-t border-[#deded9] pt-5">
              <div className="flex items-center justify-between"><span className="text-sm text-[#777773]">Subtotal</span><span className="text-lg font-semibold tracking-[-0.04em] text-[#171716]">{formatPrice(subtotal)}</span></div>
              <a
                href={getWhatsAppCheckoutHref(items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity, variantLabel: i.variantLabel })), settings)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#171716] px-4 text-sm font-semibold text-white transition hover:bg-[#333330]"
              >
                Checkout via WhatsApp
              </a>
              <p className="mt-3 text-center text-xs leading-5 text-[#858580]">You&apos;ll confirm payment and delivery with admin.</p>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
