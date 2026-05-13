import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";

export function getTenantByPhone(phone: string) {
  return db
    .select()
    .from(tenants)
    .where(eq(tenants.phone, phone))
    .then((rows) => rows[0]);
}
