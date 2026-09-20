import { Check, Download, FileText, MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductArt } from "@/components/site/product-art";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { formatPrice, type Product } from "@/lib/catalog";
import type { WhatsAppSettings } from "@/lib/whatsapp";

const highlights = [
  { label: "Format", value: "Source files included", icon: FileText },
  { label: "Delivery", value: "Sent after confirmation", icon: Download },
  { label: "Support", value: "Direct WhatsApp help", icon: MessageCircle },
];

export function ProductDetailCard({ product, settings }: { product: Product; settings?: WhatsAppSettings }) {
  return (
    <Card className="gap-0 overflow-hidden rounded-3xl border-[#dfdfda] bg-white py-0 shadow-[0_20px_60px_rgba(29,29,27,0.06)]">
      <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
        <div className="border-b border-[#e1e1dc] bg-[#ededeb] p-3 sm:p-5 lg:border-b-0 lg:border-r">
          <ProductArt product={product} className="h-[22rem] rounded-2xl sm:h-[28rem]" />
          <div className="mt-3 flex items-center justify-between px-1 text-xs text-[#858580]"><span>Product preview</span><span>{product.format}</span></div>
        </div>
        <CardContent className="p-5 sm:p-8 lg:p-10">
          <Badge className="border-[#e1e1dc] bg-[#f7f7f5] text-[#686864]">{product.categoryLabel}</Badge>
          <h1 className="mt-5 max-w-xl text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.92] tracking-[-0.085em] text-[#171716]">{product.name}</h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-[#6c6c68] sm:text-base sm:leading-7">{product.description}</p>
          <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="text-2xl font-semibold tracking-[-0.04em] text-[#171716]">{formatPrice(product.price)}</span><span className="text-sm text-[#858580]">one-time purchase</span></div>
          <WhatsAppButton product={product} settings={settings} label="Order via WhatsApp" size="lg" className="mt-7 w-full" />
          <p className="mt-3 text-center text-xs leading-5 text-[#858580]">No checkout here. We&apos;ll confirm the details with you first.</p>
          <Separator className="my-7" />
          <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">{highlights.map(({ label, value, icon: Icon }) => <div key={label} className="flex items-start gap-3"><span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f1f1ee] text-[#5f5f5b]"><Icon className="size-4" /></span><div><p className="text-xs text-[#999995]">{label}</p><p className="mt-1 text-sm font-medium leading-5 text-[#171716]">{value}</p></div></div>)}</div>
        </CardContent>
      </div>
      <div className="border-t border-[#e1e1dc] bg-[#fafaf8] px-5 py-5 sm:px-8 lg:px-10"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#999995]">What you can expect</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{["Ready to customize", `${product.format} files`, "Flexible for your workflow", "Friendly human support"].map((item) => <div key={item} className="flex items-center gap-2 text-sm text-[#656561]"><span className="inline-flex size-5 items-center justify-center rounded-full bg-[#e9e9e5] text-[#5f5f5b]"><Check className="size-3.5" /></span>{item}</div>)}</div></div>
    </Card>
  );
}


