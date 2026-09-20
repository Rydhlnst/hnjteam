import type { MetadataRoute } from "next";

import { getPublicProducts } from "@/lib/catalog-db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const products = await getPublicProducts();

  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/products`, lastModified: new Date() },
    ...products.map((product) => ({ url: `${siteUrl}/products/${product.slug}`, lastModified: new Date() })),
  ];
}
