import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const technicians = pgTable("technicians", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  specialty: varchar("specialty", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workOrders = pgTable("work_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 32 }).notNull().default("open"),
  priority: varchar("priority", { length: 32 }).notNull().default("normal"),

  // Tenant info
  tenantName: varchar("tenant_name", { length: 128 }).notNull(),
  tenantPhone: varchar("tenant_phone", { length: 32 }).notNull(),

  // Property
  propertyAddress: varchar("property_address", { length: 256 }).notNull(),
  unitNumber: varchar("unit_number", { length: 32 }),

  // Assignment
  assignedTechnicianId: uuid("assigned_technician_id").references(
    () => technicians.id
  ),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
