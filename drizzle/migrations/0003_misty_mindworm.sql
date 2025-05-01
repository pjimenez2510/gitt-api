ALTER TABLE "asset_type" RENAME TO "item_type";--> statement-breakpoint
ALTER TABLE "item" RENAME COLUMN "asset_type_id" TO "item_type_id";--> statement-breakpoint
ALTER TABLE "item_type" DROP CONSTRAINT "asset_type_code_unique";--> statement-breakpoint
ALTER TABLE "category" DROP CONSTRAINT "category_parent_category_id_category_id_fk";
--> statement-breakpoint
ALTER TABLE "item" DROP CONSTRAINT "item_asset_type_id_asset_type_id_fk";
--> statement-breakpoint
ALTER TABLE "item_type" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_item_type_id_item_type_id_fk" FOREIGN KEY ("item_type_id") REFERENCES "public"."item_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_type" ADD CONSTRAINT "item_type_code_unique" UNIQUE("code");