import { getWorkOrdersWithTenants } from "@/lib/queries/work-orders";
import { getTechnicians } from "@/lib/queries/technicians";
import { getAvailabilityWindowsByWorkOrderIds } from "@/lib/queries/availability";
import { getAllAppointments } from "@/lib/queries/appointments";
import { DispatchBoard } from "./dispatch-board";

export default async function DispatchPage() {
  const [workOrders, techs, allAppointments] = await Promise.all([
    getWorkOrdersWithTenants(),
    getTechnicians(),
    getAllAppointments(),
  ]);

  const woIds = workOrders.map((wo) => wo.id);
  const availability = await getAvailabilityWindowsByWorkOrderIds(woIds);

  // Group availability by work order ID
  const availabilityByWO: Record<string, typeof availability> = {};
  for (const slot of availability) {
    (availabilityByWO[slot.workOrderId] ??= []).push(slot);
  }

  // Group appointments by work order ID
  const appointmentsByWO: Record<string, typeof allAppointments> = {};
  for (const appt of allAppointments) {
    (appointmentsByWO[appt.workOrderId] ??= []).push(appt);
  }

  return (
    <main className="h-screen flex flex-col">
      <div className="px-6 py-3 border-b bg-white">
        <h1 className="text-xl font-bold">Dispatch</h1>
      </div>
      <DispatchBoard
        workOrders={workOrders}
        technicians={techs}
        availabilityByWO={availabilityByWO}
        appointmentsByWO={appointmentsByWO}
        allAppointments={allAppointments}
      />
    </main>
  );
}
