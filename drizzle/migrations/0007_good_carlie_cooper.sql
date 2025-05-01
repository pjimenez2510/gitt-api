ALTER TABLE "color" DROP CONSTRAINT "color_name_unique";--> statement-breakpoint
ALTER TABLE "color" ADD COLUMN "active" boolean DEFAULT true NOT NULL;