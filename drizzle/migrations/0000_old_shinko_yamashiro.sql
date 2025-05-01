CREATE TYPE "public"."asset_loan_status" AS ENUM('ACTIVE', 'FINISHED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."capacity_unit" AS ENUM('UNITS', 'METERS', 'SQUARE_METERS');--> statement-breakpoint
CREATE TYPE "public"."certificate_status" AS ENUM('DRAFT', 'APPROVED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."certificate_type" AS ENUM('ENTRY', 'EXIT', 'TRANSFER');--> statement-breakpoint
CREATE TYPE "public"."claim_status" AS ENUM('REPORTED', 'IN_PROGRESS', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."delivery_status" AS ENUM('PENDING', 'SENT', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('LOAN', 'RETURN');--> statement-breakpoint
CREATE TYPE "public"."exit_process_status" AS ENUM('INITIATED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."exit_process_type" AS ENUM('WRITE_OFF', 'DONATION', 'AUCTION', 'SCRAPPING', 'DESTRUCTION', 'RECYCLING');--> statement-breakpoint
CREATE TYPE "public"."found_status" AS ENUM('FOUND', 'NOT_FOUND', 'DAMAGED');--> statement-breakpoint
CREATE TYPE "public"."label_format" AS ENUM('CODE128', 'QR', 'PDF417', 'EAN13');--> statement-breakpoint
CREATE TYPE "public"."label_status" AS ENUM('ACTIVE', 'REPLACED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."label_type" AS ENUM('BARCODE', 'QR');--> statement-breakpoint
CREATE TYPE "public"."loan_status" AS ENUM('REQUESTED', 'APPROVED', 'DELIVERED', 'RETURNED', 'CANCELLED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."location_type" AS ENUM('BUILDING', 'FLOOR', 'OFFICE', 'WAREHOUSE', 'SHELF', 'LABORATORY');--> statement-breakpoint
CREATE TYPE "public"."maintenance_status" AS ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."maintenance_type" AS ENUM('PREVENTIVE', 'CORRECTIVE');--> statement-breakpoint
CREATE TYPE "public"."movement_type" AS ENUM('ENTRY', 'TRANSFER', 'EXIT');--> statement-breakpoint
CREATE TYPE "public"."normative_type" AS ENUM('PROPERTY', 'ADMINISTRATIVE_CONTROL', 'INVENTORY');--> statement-breakpoint
CREATE TYPE "public"."notification_channel" AS ENUM('EMAIL', 'SYSTEM', 'MOBILE');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('PENDING', 'READ', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('LOAN', 'RETURN', 'MAINTENANCE', 'SYSTEM', 'EXPIRATION');--> statement-breakpoint
CREATE TYPE "public"."origin" AS ENUM('PURCHASE', 'DONATION', 'MANUFACTURING', 'TRANSFER');--> statement-breakpoint
CREATE TYPE "public"."policy_status" AS ENUM('ACTIVE', 'EXPIRED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."report_format" AS ENUM('PDF', 'EXCEL', 'CSV', 'HTML');--> statement-breakpoint
CREATE TYPE "public"."report_frequency" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL');--> statement-breakpoint
CREATE TYPE "public"."report_type" AS ENUM('INVENTORY', 'LOANS', 'DEPRECIATION', 'VERIFICATION');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."user_type" AS ENUM('ADMINISTRATOR', 'MANAGER', 'TEACHER', 'STUDENT');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"action" varchar(100) NOT NULL,
	"module" varchar(50) NOT NULL,
	"entity_id" uuid,
	"entity_type" varchar(50),
	"date" timestamp with time zone DEFAULT now(),
	"client_ip" varchar(45),
	"details" text
);
--> statement-breakpoint
CREATE TABLE "asset_loan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"beneficiary_institution" varchar(255) NOT NULL,
	"delivery_responsible_id" uuid NOT NULL,
	"reception_responsible" varchar(255) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"contract_number" varchar(50),
	"reason" text,
	"conditions" text,
	"status" "asset_loan_status" DEFAULT 'ACTIVE',
	"observations" text,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "asset_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(20) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "asset_type_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "asset_value" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"currency" varchar(10) DEFAULT 'USD',
	"purchase_value" numeric(12, 2) NOT NULL,
	"repurchase" boolean DEFAULT false,
	"depreciable" boolean DEFAULT false,
	"entry_date" date NOT NULL,
	"last_depreciation_date" date,
	"useful_life" integer,
	"depreciation_end_date" date,
	"book_value" numeric(12, 2),
	"residual_value" numeric(12, 2),
	"ledger_value" numeric(12, 2),
	"accumulated_depreciation_value" numeric(12, 2),
	"on_loan" boolean DEFAULT false,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "asset_value_item_id_unique" UNIQUE("item_id")
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(20) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"parent_category_id" uuid,
	"standard_useful_life" integer,
	"depreciation_percentage" numeric(5, 2),
	"active" boolean DEFAULT true,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "category_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "certificate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"number" integer NOT NULL,
	"date" date,
	"type" "certificate_type",
	"status" "certificate_status",
	"delivery_responsible_id" uuid,
	"reception_responsible_id" uuid,
	"observations" text,
	"accounted" boolean DEFAULT false,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "certificate_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "color" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"hex_code" varchar(7),
	"description" text,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "color_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "condition" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"requires_maintenance" boolean DEFAULT false,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "condition_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "delivery_record" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notification_id" uuid NOT NULL,
	"channel" "notification_channel" NOT NULL,
	"delivery_status" "delivery_status" NOT NULL,
	"delivery_date" timestamp with time zone DEFAULT now(),
	"error_details" text,
	"attempts" integer DEFAULT 1,
	"update_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "depreciation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"depreciation_date" date NOT NULL,
	"initial_value" numeric(12, 2) NOT NULL,
	"depreciated_value" numeric(12, 2) NOT NULL,
	"accumulated_value" numeric(12, 2) NOT NULL,
	"current_value" numeric(12, 2) NOT NULL,
	"registration_user_id" uuid NOT NULL,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exit_detail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"process_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"appraisal_value" numeric(12, 2),
	"exit_value" numeric(12, 2),
	"beneficiary" varchar(255),
	"observations" text,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "exit_detail_process_id_item_id_unique" UNIQUE("process_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "exit_process" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"process_code" varchar(50) NOT NULL,
	"type" "exit_process_type" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"status" "exit_process_status" NOT NULL,
	"authorized_by_id" uuid NOT NULL,
	"supporting_document" varchar(255),
	"final_certificate" varchar(255),
	"observations" text,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "exit_process_process_code_unique" UNIQUE("process_code")
);
--> statement-breakpoint
CREATE TABLE "generated_report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "report_type" NOT NULL,
	"parameters" text,
	"generation_date" timestamp with time zone DEFAULT now(),
	"user_id" uuid NOT NULL,
	"document_url" varchar(255) NOT NULL,
	"format" "report_format" NOT NULL,
	"scheduled" boolean DEFAULT false,
	"frequency" "report_frequency",
	"update_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "insurance_claim" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"policy_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"claim_date" date NOT NULL,
	"claim_description" text NOT NULL,
	"claim_filing_date" date,
	"claim_status" "claim_status" NOT NULL,
	"claimed_value" numeric(12, 2) NOT NULL,
	"indemnified_value" numeric(12, 2),
	"indemnification_date" date,
	"supporting_documents" varchar(255),
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "insurance_policy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"policy_number" varchar(50) NOT NULL,
	"insurance_company" varchar(255) NOT NULL,
	"policy_type" varchar(100),
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"total_insured_value" numeric(12, 2) NOT NULL,
	"total_premium" numeric(10, 2) NOT NULL,
	"status" "policy_status" NOT NULL,
	"policy_document" varchar(255),
	"observations" text,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "insurance_policy_policy_number_unique" UNIQUE("policy_number")
);
--> statement-breakpoint
CREATE TABLE "insured_asset_detail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"policy_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"insured_value" numeric(12, 2) NOT NULL,
	"deductible" numeric(10, 2),
	"coverage" text,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "insured_asset_detail_policy_id_item_id_unique" UNIQUE("policy_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "inventory_statistics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"total_items" integer NOT NULL,
	"total_categories" integer NOT NULL,
	"total_active_loans" integer NOT NULL,
	"items_by_status" text NOT NULL,
	"items_by_category" text NOT NULL,
	"total_valuation" numeric(14, 2) NOT NULL,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_code" integer NOT NULL,
	"previous_code" varchar(50),
	"identifier" varchar(50),
	"certificate_id" uuid,
	"asset_type_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category_id" uuid NOT NULL,
	"status_id" uuid NOT NULL,
	"condition_id" uuid,
	"normative_type" "normative_type" NOT NULL,
	"registration_date" timestamp with time zone DEFAULT now(),
	"registration_user_id" uuid NOT NULL,
	"origin" "origin",
	"entry_origin" varchar(100),
	"entry_type" varchar(100),
	"acquisition_date" date,
	"commitment_number" varchar(100),
	"model_characteristics" varchar(200),
	"brand_breed_other" varchar(100),
	"identification_series" varchar(100),
	"serial_number" varchar(100),
	"warranty_date" date,
	"dimensions" varchar(100),
	"critical" boolean DEFAULT false,
	"dangerous" boolean DEFAULT false,
	"requires_special_handling" boolean DEFAULT false,
	"perishable_material" boolean DEFAULT false,
	"expiration_date" date,
	"item_line" integer,
	"accounting_account" varchar(50),
	"notes" text,
	"observations" text,
	"available_for_loan" boolean DEFAULT true,
	"location_id" uuid,
	"custodian_id" uuid,
	"active_custodian" boolean DEFAULT true,
	"insurance_policy_id" uuid,
	"enabled" boolean DEFAULT true,
	"active" boolean DEFAULT true,
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "item_asset_code_unique" UNIQUE("asset_code"),
	CONSTRAINT "item_identifier_unique" UNIQUE("identifier")
);
--> statement-breakpoint
CREATE TABLE "item_color" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"color_id" uuid NOT NULL,
	"percentage" integer,
	"is_main_color" boolean DEFAULT false,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "item_color_item_id_color_id_unique" UNIQUE("item_id","color_id")
);
--> statement-breakpoint
CREATE TABLE "item_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"file_path" varchar(255) NOT NULL,
	"type" varchar(50),
	"is_primary" boolean DEFAULT false,
	"description" text,
	"photo_date" date,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "item_material" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"material_id" uuid NOT NULL,
	"percentage" integer,
	"is_main_material" boolean DEFAULT false,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "item_material_item_id_material_id_unique" UNIQUE("item_id","material_id")
);
--> statement-breakpoint
CREATE TABLE "label" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"type" "label_type" NOT NULL,
	"content" varchar(255) NOT NULL,
	"format" "label_format" NOT NULL,
	"generation_date" timestamp with time zone DEFAULT now(),
	"print_date" timestamp with time zone,
	"image_url" varchar(255),
	"status" "label_status" DEFAULT 'ACTIVE' NOT NULL,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "label_template" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"configuration" text NOT NULL,
	"default_template" boolean DEFAULT false,
	"creator_id" uuid NOT NULL,
	"creation_date" timestamp with time zone DEFAULT now(),
	"active" boolean DEFAULT true,
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "label_template_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "loan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loan_code" varchar(50) NOT NULL,
	"request_date" timestamp with time zone DEFAULT now(),
	"approval_date" timestamp with time zone,
	"delivery_date" timestamp with time zone,
	"scheduled_return_date" timestamp with time zone NOT NULL,
	"actual_return_date" timestamp with time zone,
	"status" "loan_status" NOT NULL,
	"requestor_id" uuid NOT NULL,
	"approver_id" uuid,
	"reason" text NOT NULL,
	"associated_event" varchar(255),
	"external_location" varchar(255),
	"notes" text,
	"responsibility_document" varchar(255),
	"reminder_sent" boolean DEFAULT false,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "loan_loan_code_unique" UNIQUE("loan_code")
);
--> statement-breakpoint
CREATE TABLE "loan_detail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loan_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"exit_status_id" uuid,
	"return_status_id" uuid,
	"exit_observations" text,
	"return_observations" text,
	"exit_image" varchar(255),
	"return_image" varchar(255),
	"approved" boolean DEFAULT false,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "loan_detail_loan_id_item_id_unique" UNIQUE("loan_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "loan_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loan_id" uuid NOT NULL,
	"previous_status" "loan_status",
	"new_status" "loan_status" NOT NULL,
	"change_date" timestamp with time zone DEFAULT now(),
	"user_id" uuid NOT NULL,
	"comments" text,
	"registration_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "location" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"warehouse_id" uuid,
	"parent_location_id" uuid,
	"type" "location_type" NOT NULL,
	"building" varchar(100),
	"floor" varchar(50),
	"reference" varchar(255),
	"capacity" integer,
	"capacity_unit" "capacity_unit",
	"occupancy" integer DEFAULT 0,
	"qr_code" varchar(255),
	"coordinates" text,
	"notes" text,
	"active" boolean DEFAULT true,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "maintenance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"maintenance_date" date NOT NULL,
	"type" "maintenance_type" NOT NULL,
	"responsible_id" uuid,
	"external_responsible" varchar(255),
	"description" text,
	"cost" numeric(10, 2),
	"status" "maintenance_status",
	"scheduled_date" date,
	"execution_date" date,
	"completion_date" date,
	"activities_performed" text,
	"result" text,
	"warranty_until" date,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "material" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"material_type" varchar(50),
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "material_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "movement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"movement_type" "movement_type" NOT NULL,
	"origin_location_id" uuid,
	"destination_location_id" uuid,
	"movement_date" timestamp with time zone DEFAULT now(),
	"user_id" uuid NOT NULL,
	"loan_id" uuid,
	"observations" text,
	"reason" varchar(255),
	"transfer_certificate" varchar(50),
	"registration_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"creation_date" timestamp with time zone DEFAULT now(),
	"read_date" timestamp with time zone,
	"status" "notification_status" DEFAULT 'PENDING' NOT NULL,
	"action_url" varchar(255),
	"entity_id" uuid,
	"entity_type" varchar(50),
	"update_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notification_preference" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"notification_type" varchar(50) NOT NULL,
	"email_channel" boolean DEFAULT true,
	"system_channel" boolean DEFAULT true,
	"mobile_channel" boolean DEFAULT false,
	"active" boolean DEFAULT true,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "notification_preference_user_id_notification_type_unique" UNIQUE("user_id","notification_type")
);
--> statement-breakpoint
CREATE TABLE "notification_template" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "notification_type" NOT NULL,
	"template_title" text NOT NULL,
	"template_content" text NOT NULL,
	"channels" "notification_channel"[] NOT NULL,
	"active" boolean DEFAULT true,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "notification_template_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "physical_verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"responsible_id" uuid NOT NULL,
	"status" "verification_status" NOT NULL,
	"observations" text,
	"final_document" varchar(255),
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "physical_verification_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "report_template" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"type" "report_type" NOT NULL,
	"definition" text NOT NULL,
	"creator_id" uuid NOT NULL,
	"creation_date" timestamp with time zone DEFAULT now(),
	"active" boolean DEFAULT true,
	"required_permissions" text,
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "report_template_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "responsibility_document" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loan_id" uuid NOT NULL,
	"document_url" varchar(255) NOT NULL,
	"generation_date" timestamp with time zone DEFAULT now(),
	"signature_date" timestamp with time zone,
	"signature_hash" varchar(255),
	"type" "document_type" NOT NULL,
	"version" integer DEFAULT 1,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"permissions" jsonb,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "role_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "scan_record" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"scan_date" timestamp with time zone DEFAULT now(),
	"scan_location" text,
	"device" varchar(255),
	"action_performed" varchar(100),
	"registration_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"requires_maintenance" boolean DEFAULT false,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "status_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "status_change" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"previous_status_id" uuid,
	"new_status_id" uuid NOT NULL,
	"change_date" timestamp with time zone DEFAULT now(),
	"user_id" uuid NOT NULL,
	"loan_id" uuid NOT NULL,
	"observations" text,
	"evidence_image" varchar(255),
	"registration_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_number_tax_id" varchar(20) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"user_type" "user_type" NOT NULL,
	"status" "user_status" DEFAULT 'ACTIVE' NOT NULL,
	"phone" varchar(20),
	"department" varchar(100),
	"degree_program" varchar(100),
	"position" varchar(100),
	"registration_date" timestamp with time zone DEFAULT now(),
	"last_login" timestamp with time zone,
	"active" boolean DEFAULT true,
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_id_number_tax_id_unique" UNIQUE("id_number_tax_id"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"assignment_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_role_user_id_role_id_unique" UNIQUE("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "user_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"client_ip" varchar(45),
	"user_agent" varchar(255),
	"start_date" timestamp with time zone DEFAULT now(),
	"expiration_date" timestamp with time zone NOT NULL,
	"active" boolean DEFAULT true,
	CONSTRAINT "user_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "verification_detail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"verification_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"found_status" "found_status" NOT NULL,
	"found_location_id" uuid,
	"found_user_id" uuid,
	"observations" text,
	"evidence_photo" varchar(255),
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now(),
	CONSTRAINT "verification_detail_verification_id_item_id_unique" UNIQUE("verification_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "warehouse" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" varchar(255),
	"responsible_id" uuid,
	"description" text,
	"active" boolean DEFAULT true,
	"registration_date" timestamp with time zone DEFAULT now(),
	"update_date" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_loan" ADD CONSTRAINT "asset_loan_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_loan" ADD CONSTRAINT "asset_loan_delivery_responsible_id_user_id_fk" FOREIGN KEY ("delivery_responsible_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_value" ADD CONSTRAINT "asset_value_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_parent_category_id_category_id_fk" FOREIGN KEY ("parent_category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_delivery_responsible_id_user_id_fk" FOREIGN KEY ("delivery_responsible_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_reception_responsible_id_user_id_fk" FOREIGN KEY ("reception_responsible_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_record" ADD CONSTRAINT "delivery_record_notification_id_notification_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation" ADD CONSTRAINT "depreciation_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation" ADD CONSTRAINT "depreciation_registration_user_id_user_id_fk" FOREIGN KEY ("registration_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exit_detail" ADD CONSTRAINT "exit_detail_process_id_exit_process_id_fk" FOREIGN KEY ("process_id") REFERENCES "public"."exit_process"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exit_detail" ADD CONSTRAINT "exit_detail_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exit_process" ADD CONSTRAINT "exit_process_authorized_by_id_user_id_fk" FOREIGN KEY ("authorized_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_report" ADD CONSTRAINT "generated_report_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance_claim" ADD CONSTRAINT "insurance_claim_policy_id_insurance_policy_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."insurance_policy"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance_claim" ADD CONSTRAINT "insurance_claim_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insured_asset_detail" ADD CONSTRAINT "insured_asset_detail_policy_id_insurance_policy_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."insurance_policy"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insured_asset_detail" ADD CONSTRAINT "insured_asset_detail_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_certificate_id_certificate_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificate"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_asset_type_id_asset_type_id_fk" FOREIGN KEY ("asset_type_id") REFERENCES "public"."asset_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_status_id_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_condition_id_condition_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."condition"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_registration_user_id_user_id_fk" FOREIGN KEY ("registration_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_custodian_id_user_id_fk" FOREIGN KEY ("custodian_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_insurance_policy_id_insurance_policy_id_fk" FOREIGN KEY ("insurance_policy_id") REFERENCES "public"."insurance_policy"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_color" ADD CONSTRAINT "item_color_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_color" ADD CONSTRAINT "item_color_color_id_color_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."color"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_image" ADD CONSTRAINT "item_image_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_material" ADD CONSTRAINT "item_material_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_material" ADD CONSTRAINT "item_material_material_id_material_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."material"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "label" ADD CONSTRAINT "label_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "label_template" ADD CONSTRAINT "label_template_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan" ADD CONSTRAINT "loan_requestor_id_user_id_fk" FOREIGN KEY ("requestor_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan" ADD CONSTRAINT "loan_approver_id_user_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_detail" ADD CONSTRAINT "loan_detail_loan_id_loan_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_detail" ADD CONSTRAINT "loan_detail_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_detail" ADD CONSTRAINT "loan_detail_exit_status_id_status_id_fk" FOREIGN KEY ("exit_status_id") REFERENCES "public"."status"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_detail" ADD CONSTRAINT "loan_detail_return_status_id_status_id_fk" FOREIGN KEY ("return_status_id") REFERENCES "public"."status"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_history" ADD CONSTRAINT "loan_history_loan_id_loan_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_history" ADD CONSTRAINT "loan_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location" ADD CONSTRAINT "location_warehouse_id_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouse"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location" ADD CONSTRAINT "location_parent_location_id_location_id_fk" FOREIGN KEY ("parent_location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance" ADD CONSTRAINT "maintenance_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance" ADD CONSTRAINT "maintenance_responsible_id_user_id_fk" FOREIGN KEY ("responsible_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movement" ADD CONSTRAINT "movement_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movement" ADD CONSTRAINT "movement_origin_location_id_location_id_fk" FOREIGN KEY ("origin_location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movement" ADD CONSTRAINT "movement_destination_location_id_location_id_fk" FOREIGN KEY ("destination_location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movement" ADD CONSTRAINT "movement_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preference" ADD CONSTRAINT "notification_preference_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "physical_verification" ADD CONSTRAINT "physical_verification_responsible_id_user_id_fk" FOREIGN KEY ("responsible_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_template" ADD CONSTRAINT "report_template_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "responsibility_document" ADD CONSTRAINT "responsibility_document_loan_id_loan_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scan_record" ADD CONSTRAINT "scan_record_label_id_label_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."label"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scan_record" ADD CONSTRAINT "scan_record_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_change" ADD CONSTRAINT "status_change_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_change" ADD CONSTRAINT "status_change_previous_status_id_status_id_fk" FOREIGN KEY ("previous_status_id") REFERENCES "public"."status"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_change" ADD CONSTRAINT "status_change_new_status_id_status_id_fk" FOREIGN KEY ("new_status_id") REFERENCES "public"."status"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_change" ADD CONSTRAINT "status_change_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_change" ADD CONSTRAINT "status_change_loan_id_loan_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_detail" ADD CONSTRAINT "verification_detail_verification_id_physical_verification_id_fk" FOREIGN KEY ("verification_id") REFERENCES "public"."physical_verification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_detail" ADD CONSTRAINT "verification_detail_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_detail" ADD CONSTRAINT "verification_detail_found_location_id_location_id_fk" FOREIGN KEY ("found_location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_detail" ADD CONSTRAINT "verification_detail_found_user_id_user_id_fk" FOREIGN KEY ("found_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse" ADD CONSTRAINT "warehouse_responsible_id_user_id_fk" FOREIGN KEY ("responsible_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;