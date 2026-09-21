"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import type { DashboardFormState } from "@/app/dashboard/_components/form-state";
import { categories as categoriesTable, products as productsTable, productVariants as productVariantsTable, unitTypes as unitTypesTable } from "@/db/schema";
import { requireDashboardAuthentication } from "@/lib/dashboard-auth";
import { getDb } from "@/lib/db";
import { hasDatabaseConfig, isPreviewMode } from "@/lib/env";
import { deleteProductImage, uploadProductImage } from "@/lib/r2";

async function requireCatalogAuth() {
  if (isPreviewMode()) throw new Error("Preview mode — connect a database to save changes.");
  if (!hasDatabaseConfig()) throw new Error("DATABASE_URL is required.");
  await requireDashboardAuthentication();
}

async function handleImageUpload(formData: FormData, existingKey: string | null): Promise<string | null> {
  const remove = formData.get("_removeImage") === "true";
  const file = formData.get("image");
  const hasNew = file instanceof File && file.size > 0;

  if ((remove || hasNew) && existingKey) {
    await deleteProductImage(existingKey).catch(() => {});
  }
  if (hasNew && !remove) {
    const buffer = Buffer.from(await (file as File).arrayBuffer());
    const key = `products/${crypto.randomUUID()}.webp`;
    await uploadProductImage(buffer, key);
    return key;
  }
  return remove ? null : existingKey;
}

const variantRowSchema = z.object({
  quantity: z.number().int().positive(),
  unitTypeId: z.string().uuid(),
  price: z.number().int().positive(),
  sortOrder: z.number().int().default(0),
});

async function upsertVariants(productId: string, variantsJson: string | null) {
  await getDb().delete(productVariantsTable).where(eq(productVariantsTable.productId, productId));
  if (!variantsJson) return;
  const parsed = z.array(variantRowSchema).safeParse(JSON.parse(variantsJson));
  if (!parsed.success || parsed.data.length === 0) return;
  await getDb().insert(productVariantsTable).values(
    parsed.data.map((v) => ({ productId, ...v, isActive: true }))
  );
}

// ─── Products ─────────────────────────────────────────────────────────────────

const productSchema = z.object({
  name: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only."),
  description: z.string().trim().min(5),
  price: z.coerce.number().int().positive("Price must be a positive number."),
  categoryId: z.string().uuid("Select a valid category."),
  isFeatured: z.string().optional().transform((v) => v === "true"),
  isActive: z.string().optional().transform((v) => v !== "false"),
});

export async function createProduct(_: DashboardFormState, formData: FormData): Promise<DashboardFormState> {
  try { await requireCatalogAuth(); } catch (e) { return { status: "error", message: (e as Error).message }; }

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input." };

  let imageKey: string | null = null;
  try { imageKey = await handleImageUpload(formData, null); } catch { return { status: "error", message: "Image upload failed — check R2 configuration." }; }

  let productId: string;
  try {
    const [inserted] = await getDb().insert(productsTable).values({ ...parsed.data, imageKey }).returning({ id: productsTable.id });
    productId = inserted.id;
  } catch {
    if (imageKey) await deleteProductImage(imageKey).catch(() => {});
    return { status: "error", message: "Slug already exists or category not found." };
  }

  await upsertVariants(productId, formData.get("variants") as string | null);

  revalidatePath("/", "layout");
  return { status: "success", message: "Product created." };
}

export async function updateProduct(id: string, _: DashboardFormState, formData: FormData): Promise<DashboardFormState> {
  try { await requireCatalogAuth(); } catch (e) { return { status: "error", message: (e as Error).message }; }

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input." };

  const [existing] = await getDb().select({ imageKey: productsTable.imageKey }).from(productsTable).where(eq(productsTable.id, id)).limit(1);
  if (!existing) return { status: "error", message: "Product not found." };

  let imageKey: string | null = existing.imageKey;
  try { imageKey = await handleImageUpload(formData, existing.imageKey); } catch { return { status: "error", message: "Image upload failed — check R2 configuration." }; }

  try {
    await getDb().update(productsTable).set({ ...parsed.data, imageKey, updatedAt: new Date() }).where(eq(productsTable.id, id));
  } catch { return { status: "error", message: "Slug already exists." }; }

  await upsertVariants(id, formData.get("variants") as string | null);

  revalidatePath("/", "layout");
  return { status: "success", message: "Product updated." };
}

export async function deleteProduct(id: string): Promise<void> {
  try { await requireCatalogAuth(); } catch { return; }

  const [existing] = await getDb().select({ imageKey: productsTable.imageKey }).from(productsTable).where(eq(productsTable.id, id)).limit(1);
  await getDb().delete(productsTable).where(eq(productsTable.id, id));
  if (existing?.imageKey) await deleteProductImage(existing.imageKey).catch(() => {});

  revalidatePath("/", "layout");
}

// ─── Categories ───────────────────────────────────────────────────────────────

const categorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only."),
});

export async function createCategory(_: DashboardFormState, formData: FormData): Promise<DashboardFormState> {
  try { await requireCatalogAuth(); } catch (e) { return { status: "error", message: (e as Error).message }; }

  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input." };

  try { await getDb().insert(categoriesTable).values(parsed.data); } catch { return { status: "error", message: "Slug already exists." }; }

  revalidatePath("/dashboard");
  return { status: "success", message: "Category created." };
}

export async function updateCategory(id: string, _: DashboardFormState, formData: FormData): Promise<DashboardFormState> {
  try { await requireCatalogAuth(); } catch (e) { return { status: "error", message: (e as Error).message }; }

  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input." };

  try { await getDb().update(categoriesTable).set({ ...parsed.data, updatedAt: new Date() }).where(eq(categoriesTable.id, id)); } catch { return { status: "error", message: "Slug already exists." }; }

  revalidatePath("/", "layout");
  return { status: "success", message: "Category updated." };
}

export async function deleteCategory(id: string): Promise<{ error?: string }> {
  try { await requireCatalogAuth(); } catch (e) { return { error: (e as Error).message }; }

  try { await getDb().delete(categoriesTable).where(eq(categoriesTable.id, id)); } catch { return { error: "Cannot delete — products still reference this category." }; }

  revalidatePath("/dashboard");
  return {};
}

// ─── Unit Types ───────────────────────────────────────────────────────────────

const unitTypeSchema = z.object({
  name: z.string().trim().min(1).max(60),
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only."),
});

export async function createUnitType(_: DashboardFormState, formData: FormData): Promise<DashboardFormState> {
  try { await requireCatalogAuth(); } catch (e) { return { status: "error", message: (e as Error).message }; }

  const parsed = unitTypeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input." };

  try { await getDb().insert(unitTypesTable).values(parsed.data); } catch { return { status: "error", message: "Slug already exists." }; }

  revalidatePath("/dashboard");
  return { status: "success", message: "Unit type created." };
}

export async function updateUnitType(id: string, _: DashboardFormState, formData: FormData): Promise<DashboardFormState> {
  try { await requireCatalogAuth(); } catch (e) { return { status: "error", message: (e as Error).message }; }

  const parsed = unitTypeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input." };

  try { await getDb().update(unitTypesTable).set(parsed.data).where(eq(unitTypesTable.id, id)); } catch { return { status: "error", message: "Slug already exists." }; }

  revalidatePath("/dashboard");
  return { status: "success", message: "Unit type updated." };
}

export async function deleteUnitType(id: string): Promise<{ error?: string }> {
  try { await requireCatalogAuth(); } catch (e) { return { error: (e as Error).message }; }

  try { await getDb().delete(unitTypesTable).where(eq(unitTypesTable.id, id)); } catch { return { error: "Cannot delete — product variants still use this unit type." }; }

  revalidatePath("/dashboard");
  return {};
}
