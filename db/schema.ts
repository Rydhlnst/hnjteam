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
  brandColor: varchar("brand_color", { length: 9 }).notNull().default("#171716"),
  siteName: varchar("site_name", { length: 60 }).notNull().default("HnJ"),
  logoKey: text("logo_key"),
  faviconKey: text("favicon_key"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Unit Types (client-managed variant dimensions) ────────────────────────────

export const unitTypes = pgTable("unit_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 60 }).notNull(),
  slug: varchar("slug", { length: 80 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  slugUnique: uniqueIndex("unit_types_slug_unique").on(table.slug),
}));

// ── Product Variants ──────────────────────────────────────────────────────────

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  unitTypeId: uuid("unit_type_id").notNull().references(() => unitTypes.id, { onDelete: "restrict" }),
  price: integer("price").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  productIndex: index("product_variants_product_id_idx").on(table.productId),
}));

// ── better-auth Tables ────────────────────────────────────────────────────────

export const authUser = pgTable("auth_user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  username: text("username").unique(),
  displayUsername: text("display_username"),
});

export const authSession = pgTable("auth_session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => authUser.id, { onDelete: "cascade" }),
});

export const authAccount = pgTable("auth_account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => authUser.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const authVerification = pgTable("auth_verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ── Inferred types ────────────────────────────────────────────────────────────

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Settings = typeof settings.$inferSelect;
export type UnitType = typeof unitTypes.$inferSelect;
export type ProductVariantRow = typeof productVariants.$inferSelect;
