import "dotenv/config";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { categories, products as productTable, settings } from "./schema";
import { products } from "../lib/catalog";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to seed the database");

const db = drizzle(neon(databaseUrl));
const categorySeeds = Array.from(new Map(products.map((product) => [product.category, { name: product.categoryLabel, slug: product.category }])).values());

async function seed() {
  await db.insert(categories).values(categorySeeds).onConflictDoNothing({ target: categories.slug });
  const savedCategories = await db.select({ id: categories.id, slug: categories.slug }).from(categories);
  const categoryIds = new Map(savedCategories.map((category) => [category.slug, category.id]));

  for (const product of products) {
    const categoryId = categoryIds.get(product.category);
    if (!categoryId) throw new Error(`Missing category for ${product.name}`);

    await db.insert(productTable).values({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      categoryId,
      isFeatured: product.featured,
      isActive: true,
    }).onConflictDoUpdate({
      target: productTable.slug,
      set: {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId,
        isFeatured: product.featured,
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }

  await db.insert(settings).values({
    id: 1,
    whatsappNumber: "628123456789",
    whatsappMessageTemplate: "Halo kak, saya tertarik dengan produk {product_name} seharga {product_price}. Apakah produknya masih tersedia?",
  }).onConflictDoUpdate({
    target: settings.id,
    set: { updatedAt: new Date() },
  });
}

seed().then(() => {
  console.log("Seed completed");
}).catch((error) => {
  console.error("Seed failed", error);
  process.exitCode = 1;
});
