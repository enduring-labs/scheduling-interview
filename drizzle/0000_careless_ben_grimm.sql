CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"phone" varchar(32) NOT NULL,
	"email" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "technicians" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"phone" varchar(32) NOT NULL,
	"specialty" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"status" varchar(32) DEFAULT 'open' NOT NULL,
	"priority" varchar(32) DEFAULT 'normal' NOT NULL,
	"tenant_id" uuid NOT NULL,
	"property_address" varchar(256) NOT NULL,
	"unit_number" varchar(32),
	"assigned_technician_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_assigned_technician_id_technicians_id_fk" FOREIGN KEY ("assigned_technician_id") REFERENCES "public"."technicians"("id") ON DELETE no action ON UPDATE no action;
