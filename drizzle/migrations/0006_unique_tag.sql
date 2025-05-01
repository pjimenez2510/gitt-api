ALTER TABLE "material" DROP CONSTRAINT "material_name_unique";--> statement-breakpoint
ALTER TABLE "material" ADD COLUMN "active" boolean DEFAULT true NOT NULL;