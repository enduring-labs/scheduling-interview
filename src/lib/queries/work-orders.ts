import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { workOrders, tenants } from "@/lib/db/schema";

export function getWorkOrders() {
  return db.select().from(workOrders);
}

export function getWorkOrdersWithTenants() {
  return db
    .select({
      id: workOrders.id,
      title: workOrders.title,
      description: workOrders.description,
      status: workOrders.status,
      priority: workOrders.priority,
      tenantId: workOrders.tenantId,
      tenantName: tenants.name,
      propertyAddress: workOrders.propertyAddress,
      unitNumber: workOrders.unitNumber,
    })
    .from(workOrders)
    .innerJoin(tenants, eq(workOrders.tenantId, tenants.id));
}

export function getWorkOrdersByTenantId(tenantId: string) {
  return db
    .select()
    .from(workOrders)
    .where(eq(workOrders.tenantId, tenantId));
}
