import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";

import { categories as categoryTable, products as productTable, settings as settingsTable } from "@/db/schema";
import { categories as fallbackCategories, getProduct, getProducts as getFallbackProducts, type Product } from "@/lib/catalog";
import { getDb } from "@/lib/db";
import { hasDatabaseConfig } from "@/lib/env";
import { defaultPublicSettings, type PublicSettings } from "@/lib/storefront";
import { getPublicAssetUrl } from "@/lib/r2";

type CatalogProduct = Product & { imageUrl?: string };
type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageKey: string | null;
  category: string | null;
  categoryLabel: string | null;
  featured: boolean;
};

const dbProductSelection = {
  id: productTable.id,
  name: productTable.name,
  slug: productTable.slug,
  description: productTable.description,
  price: productTable.price,
  imageKey: productTable.imageKey,
  category: categoryTable.slug,
  categoryLabel: categoryTable.name,
  featured: productTable.isFeatured,
};

function toCatalogProduct(row: ProductRow): CatalogProduct {
  const fallback = getProduct(row.slug);
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    category: row.category ?? "uncategorized",
    categoryLabel: row.categoryLabel ?? "Uncategorized",
    featured: row.featured,
    format: fallback?.format ?? "Digital download",
    art: fallback?.art ?? { background: "#e7e8e2", foreground: "#263329", accent: "#d7ec67", label: "GOODS" },
    imageUrl: row.imageKey ? getPublicAssetUrl(row.imageKey) : undefined,
  };
}

export async function getPublicProducts({ query, category, featured }: { query?: string; category?: string; featured?: boolean } = {}) {
  if (!hasDatabaseConfig()) return getFallbackProducts({ query, category }).filter((product) => featured ? product.featured : true);

  const filters = [eq(productTable.isActive, true)];
  if (category && category !== "all") filters.push(eq(categoryTable.slug, category));
  if (featured) filters.push(eq(productTable.isFeatured, true));

  const normalizedQuery = query?.trim();
  if (normalizedQuery) {
    const pattern = `%${normalizedQuery}%`;
    filters.push(or(ilike(productTable.name, pattern), ilike(productTable.description, pattern), ilike(categoryTable.name, pattern))!);
  }

  const rows = await getDb().select(dbProductSelection).from(productTable).leftJoin(categoryTable, eq(productTable.categoryId, categoryTable.id)).where(and(...filters)).orderBy(desc(productTable.createdAt));
  return rows.map(toCatalogProduct);
}

export async function getPublicProductBySlug(slug: string) {
  if (!hasDatabaseConfig()) return getProduct(slug);

  const [row] = await getDb().select(dbProductSelection).from(productTable).leftJoin(categoryTable, eq(productTable.categoryId, categoryTable.id)).where(and(eq(productTable.slug, slug), eq(productTable.isActive, true))).limit(1);
  return row ? toCatalogProduct(row) : undefined;
}

export async function getPublicCategories() {
  if (!hasDatabaseConfig()) return fallbackCategories;

  const rows = await getDb().select({ name: categoryTable.name, slug: categoryTable.slug, count: count(productTable.id) }).from(categoryTable).leftJoin(productTable, and(eq(productTable.categoryId, categoryTable.id), eq(productTable.isActive, true))).groupBy(categoryTable.id, categoryTable.name, categoryTable.slug).orderBy(asc(categoryTable.name));
  const total = rows.reduce((sum, category) => sum + Number(category.count), 0);
  return [{ name: "All products", slug: "all", count: total }, ...rows.map((category) => ({ ...category, count: Number(category.count) }))];
}

export async function getPublicSettings(): Promise<PublicSettings> {
  if (!hasDatabaseConfig()) return defaultPublicSettings;
  const [row] = await getDb().select({
    whatsappNumber: settingsTable.whatsappNumber,
    whatsappMessageTemplate: settingsTable.whatsappMessageTemplate,
    heroEyebrow: settingsTable.heroEyebrow,
    heroTitle: settingsTable.heroTitle,
    heroDescription: settingsTable.heroDescription,
    heroCtaLabel: settingsTable.heroCtaLabel,
    collectionEyebrow: settingsTable.collectionEyebrow,
    collectionTitle: settingsTable.collectionTitle,
    promoTwoEyebrow: settingsTable.promoTwoEyebrow,
    promoTwoTitle: settingsTable.promoTwoTitle,
    promoTwoDescription: settingsTable.promoTwoDescription,
    promoTwoCtaLabel: settingsTable.promoTwoCtaLabel,
    promoThreeEyebrow: settingsTable.promoThreeEyebrow,
    promoThreeTitle: settingsTable.promoThreeTitle,
    promoThreeDescription: settingsTable.promoThreeDescription,
    promoThreeCtaLabel: settingsTable.promoThreeCtaLabel,
  }).from(settingsTable).where(eq(settingsTable.id, 1)).limit(1);
  return row ?? defaultPublicSettings;
}
