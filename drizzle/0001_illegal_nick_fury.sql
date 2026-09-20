ALTER TABLE "settings" ADD COLUMN "hero_eyebrow" varchar(80) DEFAULT 'HnJ / digital goods' NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "hero_title" varchar(120) DEFAULT 'Digital products that just work.' NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "hero_description" text DEFAULT 'Useful templates and systems for work, business, and everyday making. Browse the collection, then order directly through WhatsApp Admin.' NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "hero_cta_label" varchar(40) DEFAULT 'Chat with admin' NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "collection_eyebrow" varchar(80) DEFAULT 'Featured collection' NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "collection_title" varchar(80) DEFAULT 'Shop HnJ' NOT NULL;