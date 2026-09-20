ALTER TABLE "settings" ADD COLUMN "promo_two_eyebrow" varchar(80) DEFAULT 'Bundle week' NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "promo_two_title" varchar(120) DEFAULT 'More tools. Less busywork.' NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "promo_two_description" text DEFAULT 'Pick the templates that keep your work moving.' NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "promo_two_cta_label" varchar(40) DEFAULT 'Browse the collection' NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "promo_three_eyebrow" varchar(80) DEFAULT 'Not sure where to start?' NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "promo_three_title" varchar(120) DEFAULT 'Ask before you order.' NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "promo_three_description" text DEFAULT 'We will help you choose the right product.' NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "promo_three_cta_label" varchar(40) DEFAULT 'Talk to HnJ' NOT NULL;