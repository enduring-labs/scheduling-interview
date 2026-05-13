"use server";

import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function bookAppointment(
  workOrderId: string,
  technicianId: string,
  date: string,
  startTime: string,
  endTime: string,
) {
  await db.insert(appointments).values({
    workOrderId,
    technicianId,
    date,
    startTime,
    endTime,
  });

  revalidatePath("/dispatch");
}
