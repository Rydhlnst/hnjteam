import type { Product, ProductVariant } from "@/lib/catalog";

export type WhatsAppSettings = {
  whatsappNumber: string;
  whatsappMessageTemplate: string;
};

export const defaultWhatsAppSettings: WhatsAppSettings = {
  whatsappNumber: "628123456789",
  whatsappMessageTemplate: "Halo kak, saya tertarik dengan produk {product_name} seharga {product_price}. Apakah produknya masih tersedia?",
};

export type WhatsAppCheckoutItem = {
  name: string;
  price: number;
  quantity: number;
  variantLabel?: string;
};

function formatWhatsAppPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);
}

export function getWhatsAppHref(product?: Product, settings: WhatsAppSettings = defaultWhatsAppSettings, variant?: ProductVariant) {
  let message: string;
  if (product) {
    const price = variant ? variant.price : product.price;
    const base = settings.whatsappMessageTemplate
      .replaceAll("{product_name}", product.name)
      .replaceAll("{product_price}", formatWhatsAppPrice(price));
    message = variant
      ? base.replace(/\.$/, "") + ` (paket ${variant.quantity} ${variant.unitTypeName}).`
      : base;
  } else {
    message = "Halo kak, saya ingin bertanya tentang produk digital yang tersedia.";
  }
  const phone = settings.whatsappNumber.replace(/\D/g, "");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppCheckoutHref(items: WhatsAppCheckoutItem[], settings: WhatsAppSettings = defaultWhatsAppSettings) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lineItems = items.map((item) => {
    const label = item.variantLabel ? ` (${item.variantLabel})` : "";
    return `• ${item.name}${label} × ${item.quantity} — ${formatWhatsAppPrice(item.price * item.quantity)}`;
  });
  const message = ["Halo kak, saya ingin memesan:", "", ...lineItems, "", `Total: ${formatWhatsAppPrice(total)}`, "", "Mohon info pembayaran dan proses selanjutnya ya."].join("\n");
  const phone = settings.whatsappNumber.replace(/\D/g, "");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
