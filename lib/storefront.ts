import { defaultWhatsAppSettings, type WhatsAppSettings } from "@/lib/whatsapp";

export type StorefrontSettings = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroCtaLabel: string;
  promoTwoEyebrow: string;
  promoTwoTitle: string;
  promoTwoDescription: string;
  promoTwoCtaLabel: string;
  promoThreeEyebrow: string;
  promoThreeTitle: string;
  promoThreeDescription: string;
  promoThreeCtaLabel: string;
  collectionEyebrow: string;
  collectionTitle: string;
};

export type PublicSettings = WhatsAppSettings & StorefrontSettings;

export const defaultStorefrontSettings: StorefrontSettings = {
  heroEyebrow: "Fresh digital goods",
  heroTitle: "Make your next move.",
  heroDescription: "Useful templates, ready when you are.",
  heroCtaLabel: "Shop the collection",
  promoTwoEyebrow: "Bundle week",
  promoTwoTitle: "More tools. Less busywork.",
  promoTwoDescription: "Pick the templates that keep your work moving.",
  promoTwoCtaLabel: "Browse the collection",
  promoThreeEyebrow: "Not sure where to start?",
  promoThreeTitle: "Ask before you order.",
  promoThreeDescription: "We will help you choose the right product.",
  promoThreeCtaLabel: "Talk to HnJ",
  collectionEyebrow: "Featured collection",
  collectionTitle: "Shop HnJ",
};

export const defaultPublicSettings: PublicSettings = {
  ...defaultWhatsAppSettings,
  ...defaultStorefrontSettings,
};