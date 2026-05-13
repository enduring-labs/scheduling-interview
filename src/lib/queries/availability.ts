import { inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { availabilityWindows } from "@/lib/db/schema";

export async function getAvailabilityWindowsByWorkOrderIds(
  workOrderIds: string[],
) {
  if (workOrderIds.length === 0) return [];
  return db
    .select({
      id: availabilityWindows.id,
      workOrderId: availabilityWindows.workOrderId,
      date: availabilityWindows.date,
      startTime: availabilityWindows.startTime,
      endTime: availabilityWindows.endTime,
    })
    .from(availabilityWindows)
    .where(inArray(availabilityWindows.workOrderId, workOrderIds));
}
