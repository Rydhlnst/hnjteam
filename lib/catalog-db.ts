import { and, asc, count, desc, eq, ilike, inArray, or } from "drizzle-orm";

import { categories as categoryTable, products as productTable, productVariants as productVariantsTable, settings as settingsTable, unitTypes as unitTypesTable } from "@/db/schema";
import { categories as fallbackCategories, getProduct, getProducts as getFallbackProducts, type Product, type ProductVariant } from "@/lib/catalog";
import { getDb } from "@/lib/db";
import { hasDatabaseConfig } from "@/lib/env";
import { defaultPublicSettings, type PublicSettings } from "@/lib/storefront";
import { getPublicAssetUrl } from "@/lib/r2";

export type DashboardProduct = Product & {
  imageUrl?: string;
  imageKey: string | null;
  categoryId: string;
  isActive: boolean;
};

export type DashboardUnitType = { id: string; name: string; slug: string; sortOrder: number };

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
    variants: [],
    art: fallback?.art ?? { background: "#e7e8e2", foreground: "#263329", accent: "#d7ec67", label: "GOODS" },
    imageUrl: row.imageKey ? getPublicAssetUrl(row.imageKey) : undefined,
  };
}

async function attachVariants(products: CatalogProduct[]): Promise<CatalogProduct[]> {
  if (products.length === 0) return products;
  const ids = products.map((p) => p.id);
  const variantRows = await getDb()
    .select({
      productId: productVariantsTable.productId,
      id: productVariantsTable.id,
      quantity: productVariantsTable.quantity,
      price: productVariantsTable.price,
      sortOrder: productVariantsTable.sortOrder,
      unitTypeId: productVariantsTable.unitTypeId,
      unitTypeName: unitTypesTable.name,
      unitTypeSlug: unitTypesTable.slug,
    })
    .from(productVariantsTable)
    .leftJoin(unitTypesTable, eq(productVariantsTable.unitTypeId, unitTypesTable.id))
    .where(and(inArray(productVariantsTable.productId, ids), eq(productVariantsTable.isActive, true)))
    .orderBy(asc(productVariantsTable.sortOrder));

  const byProduct = new Map<string, ProductVariant[]>();
  for (const v of variantRows) {
    if (!v.unitTypeName) continue;
    if (!byProduct.has(v.productId)) byProduct.set(v.productId, []);
    byProduct.get(v.productId)!.push({
      id: v.id,
      quantity: v.quantity,
      unitTypeId: v.unitTypeId,
      unitTypeName: v.unitTypeName,
      unitTypeSlug: v.unitTypeSlug ?? v.unitTypeName.toLowerCase(),
      price: v.price,
      sortOrder: v.sortOrder,
    });
  }

  return products.map((p) => ({ ...p, variants: byProduct.get(p.id) ?? [] }));
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
  const products = rows.map(toCatalogProduct);
  return attachVariants(products);
}

export async function getPublicProductBySlug(slug: string) {
  if (!hasDatabaseConfig()) return getProduct(slug);

  const [row] = await getDb().select(dbProductSelection).from(productTable).leftJoin(categoryTable, eq(productTable.categoryId, categoryTable.id)).where(and(eq(productTable.slug, slug), eq(productTable.isActive, true))).limit(1);
  if (!row) return undefined;
  const [product] = await attachVariants([toCatalogProduct(row)]);
  return product;
}

export async function getPublicCategories() {
  if (!hasDatabaseConfig()) return fallbackCategories;

  const rows = await getDb().select({ name: categoryTable.name, slug: categoryTable.slug, count: count(productTable.id) }).from(categoryTable).leftJoin(productTable, and(eq(productTable.categoryId, categoryTable.id), eq(productTable.isActive, true))).groupBy(categoryTable.id, categoryTable.name, categoryTable.slug).orderBy(asc(categoryTable.name));
  const total = rows.reduce((sum, category) => sum + Number(category.count), 0);
  return [{ name: "All products", slug: "all", count: total }, ...rows.map((category) => ({ ...category, count: Number(category.count) }))];
}

export type DashboardCategory = { id: string; name: string; slug: string };

export async function getDashboardProducts(): Promise<DashboardProduct[]> {
  if (!hasDatabaseConfig()) {
    return (getFallbackProducts() as Product[]).map((p) => ({
      ...p,
      imageKey: null,
      categoryId: "",
      isActive: true,
    }));
  }

  const rows = await getDb()
    .select({
      id: productTable.id,
      name: productTable.name,
      slug: productTable.slug,
      description: productTable.description,
      price: productTable.price,
      imageKey: productTable.imageKey,
      categoryId: productTable.categoryId,
      category: categoryTable.slug,
      categoryLabel: categoryTable.name,
      featured: productTable.isFeatured,
      isActive: productTable.isActive,
    })
    .from(productTable)
    .leftJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
    .orderBy(desc(productTable.createdAt));

  const products: DashboardProduct[] = rows.map((row) => {
    const fallback = getProduct(row.slug);
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      price: row.price,
      imageKey: row.imageKey,
      imageUrl: row.imageKey ? getPublicAssetUrl(row.imageKey) : undefined,
      categoryId: row.categoryId,
      category: row.category ?? "uncategorized",
      categoryLabel: row.categoryLabel ?? "Uncategorized",
      featured: row.featured,
      isActive: row.isActive,
      variants: [],
      format: fallback?.format ?? "Digital download",
      art: fallback?.art ?? { background: "#e7e8e2", foreground: "#263329", accent: "#d7ec67", label: "GOODS" },
    };
  });

  const withVariants = await attachVariants(products);
  return withVariants as DashboardProduct[];
}

export async function getDashboardCategories(): Promise<DashboardCategory[]> {
  if (!hasDatabaseConfig()) return [];
  return getDb()
    .select({ id: categoryTable.id, name: categoryTable.name, slug: categoryTable.slug })
    .from(categoryTable)
    .orderBy(asc(categoryTable.name));
}

export async function getDashboardUnitTypes(): Promise<DashboardUnitType[]> {
  if (!hasDatabaseConfig()) return [];
  return getDb()
    .select({ id: unitTypesTable.id, name: unitTypesTable.name, slug: unitTypesTable.slug, sortOrder: unitTypesTable.sortOrder })
    .from(unitTypesTable)
    .orderBy(asc(unitTypesTable.sortOrder), asc(unitTypesTable.name));
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
    brandColor: settingsTable.brandColor,
    siteName: settingsTable.siteName,
    logoKey: settingsTable.logoKey,
    faviconKey: settingsTable.faviconKey,
  }).from(settingsTable).where(eq(settingsTable.id, 1)).limit(1);
  if (!row) return defaultPublicSettings;
  // Fall back to defaults for fields that were saved as empty strings
  // (can happen if branding was saved before storefront settings were configured)
  return {
    ...row,
    whatsappNumber: row.whatsappNumber || defaultPublicSettings.whatsappNumber,
    whatsappMessageTemplate: row.whatsappMessageTemplate || defaultPublicSettings.whatsappMessageTemplate,
  };
}
