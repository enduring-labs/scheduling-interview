"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { workOrders, availabilityWindows } from "@/lib/db/schema";

export async function createWorkOrder(
  tenantId: string,
  phone: string,
  formData: FormData,
) {
  const [inserted] = await db
    .insert(workOrders)
    .values({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      propertyAddress: formData.get("propertyAddress") as string,
      unitNumber: (formData.get("unitNumber") as string) || null,
      priority: (formData.get("priority") as string) || "normal",
      tenantId,
    })
    .returning({ id: workOrders.id });

  const slotsRaw = formData.get("slots") as string | null;
  if (slotsRaw) {
    const slots: { date: string; startTime: string; endTime: string }[] =
      JSON.parse(slotsRaw);
    if (slots.length > 0) {
      await db.insert(availabilityWindows).values(
        slots.map((s) => ({
          workOrderId: inserted.id,
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
        }))
      );
    }
  }

  redirect(`/tenant?phone=${encodeURIComponent(phone)}`);
}

export async function updateAvailability(
  workOrderId: string,
  phone: string,
  formData: FormData,
) {
  // Delete existing availability windows for this work order
  await db
    .delete(availabilityWindows)
    .where(eq(availabilityWindows.workOrderId, workOrderId));

  // Insert new slots
  const slotsRaw = formData.get("slots") as string | null;
  if (slotsRaw) {
    const slots: { date: string; startTime: string; endTime: string }[] =
      JSON.parse(slotsRaw);
    if (slots.length > 0) {
      await db.insert(availabilityWindows).values(
        slots.map((s) => ({
          workOrderId,
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
        })),
      );
    }
  }

  revalidatePath(`/tenant`);
}
