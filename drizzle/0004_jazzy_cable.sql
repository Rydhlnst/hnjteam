ALTER TABLE "settings" ADD COLUMN "site_name" varchar(60) DEFAULT 'HnJ' NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "logo_key" text;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "favicon_key" text;