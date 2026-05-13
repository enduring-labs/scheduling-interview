import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { appointments, technicians, workOrders, tenants } from "@/lib/db/schema";

export async function getAppointmentsByWorkOrderIds(workOrderIds: string[]) {
  if (workOrderIds.length === 0) return [];
  return db
    .select({
      id: appointments.id,
      workOrderId: appointments.workOrderId,
      date: appointments.date,
      startTime: appointments.startTime,
      endTime: appointments.endTime,
      notes: appointments.notes,
      technicianName: technicians.name,
    })
    .from(appointments)
    .innerJoin(technicians, eq(appointments.technicianId, technicians.id))
    .where(inArray(appointments.workOrderId, workOrderIds));
}

export async function getAllAppointments() {
  return db
    .select({
      id: appointments.id,
      workOrderId: appointments.workOrderId,
      technicianId: appointments.technicianId,
      date: appointments.date,
      startTime: appointments.startTime,
      endTime: appointments.endTime,
      notes: appointments.notes,
      technicianName: technicians.name,
      workOrderTitle: workOrders.title,
      workOrderPriority: workOrders.priority,
      propertyAddress: workOrders.propertyAddress,
      unitNumber: workOrders.unitNumber,
      tenantName: tenants.name,
    })
    .from(appointments)
    .innerJoin(technicians, eq(appointments.technicianId, technicians.id))
    .innerJoin(workOrders, eq(appointments.workOrderId, workOrders.id))
    .innerJoin(tenants, eq(workOrders.tenantId, tenants.id));
}

export async function getAppointmentsByTechnicianId(technicianId: string) {
  return db
    .select({
      id: appointments.id,
      date: appointments.date,
      startTime: appointments.startTime,
      endTime: appointments.endTime,
      notes: appointments.notes,
      workOrderTitle: workOrders.title,
      workOrderDescription: workOrders.description,
      workOrderPriority: workOrders.priority,
      propertyAddress: workOrders.propertyAddress,
      unitNumber: workOrders.unitNumber,
      tenantName: tenants.name,
    })
    .from(appointments)
    .innerJoin(workOrders, eq(appointments.workOrderId, workOrders.id))
    .innerJoin(tenants, eq(workOrders.tenantId, tenants.id))
    .where(eq(appointments.technicianId, technicianId));
}
