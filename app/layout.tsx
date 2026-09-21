import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { CartProvider } from "@/components/site/cart-provider";
import { StorefrontOverlays } from "@/components/site/storefront-overlays";
import { getPublicSettings } from "@/lib/catalog-db";
import { getPublicAssetUrl } from "@/lib/r2";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const name = settings.siteName;
  const faviconUrl = settings.faviconKey ? getPublicAssetUrl(settings.faviconKey) : undefined;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: `${name} — Simple digital products`, template: `%s — ${name}` },
    description: "Simple digital products for work, business, and everyday making.",
    openGraph: {
      title: `${name} — Simple digital products`,
      description: "Simple digital products for work, business, and everyday making.",
      type: "website",
    },
    ...(faviconUrl ? { icons: { icon: faviconUrl } } : {}),
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getPublicSettings();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body style={{ "--brand": settings.brandColor } as React.CSSProperties}>
        <CartProvider settings={settings}>
          {children}
          <StorefrontOverlays />
        </CartProvider>
      </body>
    </html>
  );
}
