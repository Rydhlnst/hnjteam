import { ArrowUpRight, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getWhatsAppHref, type WhatsAppSettings } from "@/lib/whatsapp";
import type { Product, ProductVariant } from "@/lib/catalog";

type WhatsAppButtonProps = {
  product?: Product;
  settings?: WhatsAppSettings;
  variant_?: ProductVariant;
  label?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  showArrow?: boolean;
};

export function WhatsAppButton({ product, settings, variant_, label = "Chat on WhatsApp", variant = "secondary", size = "default", className, showArrow = true }: WhatsAppButtonProps) {
  return <Button asChild variant={variant} size={size} className={cn(className)}><a href={getWhatsAppHref(product, settings, variant_)} target="_blank" rel="noreferrer" aria-label={label}><MessageCircle className="size-4 shrink-0" />{label}{showArrow ? <ArrowUpRight className="size-4 shrink-0" /> : null}</a></Button>;
}
