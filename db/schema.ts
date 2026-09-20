import { boolean, index, integer, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 140 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  slugUnique: uniqueIndex("categories_slug_unique").on(table.slug),
  createdAtIndex: index("categories_created_at_idx").on(table.createdAt),
}));

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  imageKey: text("image_key"),
  categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "restrict" }),
  isFeatured: boolean("is_featured").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  slugUnique: uniqueIndex("products_slug_unique").on(table.slug),
  categoryIndex: index("products_category_id_idx").on(table.categoryId),
  activeFeaturedIndex: index("products_active_featured_idx").on(table.isActive, table.isFeatured),
  createdAtIndex: index("products_created_at_idx").on(table.createdAt),
}));

export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),
  whatsappNumber: varchar("whatsapp_number", { length: 32 }).notNull(),
  whatsappMessageTemplate: text("whatsapp_message_template").notNull(),
  heroEyebrow: varchar("hero_eyebrow", { length: 80 }).notNull().default("HnJ / digital goods"),
  heroTitle: varchar("hero_title", { length: 120 }).notNull().default("Digital products that just work."),
  heroDescription: text("hero_description").notNull().default("Useful templates and systems for work, business, and everyday making. Browse the collection, then order directly through WhatsApp Admin."),
  heroCtaLabel: varchar("hero_cta_label", { length: 40 }).notNull().default("Chat with admin"),
  collectionEyebrow: varchar("collection_eyebrow", { length: 80 }).notNull().default("Featured collection"),
  collectionTitle: varchar("collection_title", { length: 80 }).notNull().default("Shop HnJ"),
  promoTwoEyebrow: varchar("promo_two_eyebrow", { length: 80 }).notNull().default("Bundle week"),
  promoTwoTitle: varchar("promo_two_title", { length: 120 }).notNull().default("More tools. Less busywork."),
  promoTwoDescription: text("promo_two_description").notNull().default("Pick the templates that keep your work moving."),
  promoTwoCtaLabel: varchar("promo_two_cta_label", { length: 40 }).notNull().default("Browse the collection"),
  promoThreeEyebrow: varchar("promo_three_eyebrow", { length: 80 }).notNull().default("Not sure where to start?"),
  promoThreeTitle: varchar("promo_three_title", { length: 120 }).notNull().default("Ask before you order."),
  promoThreeDescription: text("promo_three_description").notNull().default("We will help you choose the right product."),
  promoThreeCtaLabel: varchar("promo_three_cta_label", { length: 40 }).notNull().default("Talk to HnJ"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Settings = typeof settings.$inferSelect;
