CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"phone" varchar(32) NOT NULL,
	"email" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "work_orders" ADD COLUMN "tenant_id" uuid NOT NULL;
--> statement-breakpoint
ALTER TABLE "work_orders" DROP COLUMN "tenant_name";
--> statement-breakpoint
ALTER TABLE "work_orders" DROP COLUMN "tenant_phone";
--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
