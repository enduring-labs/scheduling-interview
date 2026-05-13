import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { technicians } from "@/lib/db/schema";

export function getTechnicians() {
  return db.select().from(technicians);
}

export function getTechnicianById(id: string) {
  return db
    .select()
    .from(technicians)
    .where(eq(technicians.id, id))
    .then((r) => r[0]);
}
