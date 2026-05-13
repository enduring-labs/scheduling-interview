import { getTenantByPhone } from "@/lib/queries/tenants";
import { getWorkOrdersByTenantId } from "@/lib/queries/work-orders";
import { getAppointmentsByWorkOrderIds } from "@/lib/queries/appointments";
import { getAvailabilityWindowsByWorkOrderIds } from "@/lib/queries/availability";
import { updateAvailability } from "@/lib/actions/work-orders";
import { WorkOrderCard } from "./work-order-card";
import Link from "next/link";

export default async function TenantPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone: rawPhone } = await searchParams;
  const phone = rawPhone?.replace(/^\s/, "+");

  if (!phone) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="mb-4 text-2xl font-bold">Tenant Portal</h1>
        <p className="text-gray-500">
          Add <code className="rounded bg-gray-100 px-1">?phone=+15552001001</code> to view your work orders.
        </p>
      </main>
    );
  }

  const tenant = await getTenantByPhone(phone);

  if (!tenant) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="mb-4 text-2xl font-bold">Tenant Portal</h1>
        <p className="text-gray-500">No account found for this phone number.</p>
      </main>
    );
  }

  const orders = await getWorkOrdersByTenantId(tenant.id);
  const orderIds = orders.map((wo) => wo.id);

  const [appointmentsList, availabilityList] = await Promise.all([
    getAppointmentsByWorkOrderIds(orderIds),
    getAvailabilityWindowsByWorkOrderIds(orderIds),
  ]);

  // Group appointments by work order ID
  const appointmentsByWo = new Map<string, typeof appointmentsList>();
  for (const appt of appointmentsList) {
    const list = appointmentsByWo.get(appt.workOrderId) ?? [];
    list.push(appt);
    appointmentsByWo.set(appt.workOrderId, list);
  }

  // Group availability by work order ID
  const availabilityByWo = new Map<string, { date: string; startTime: string }[]>();
  for (const aw of availabilityList) {
    const list = availabilityByWo.get(aw.workOrderId) ?? [];
    list.push({ date: aw.date, startTime: aw.startTime });
    availabilityByWo.set(aw.workOrderId, list);
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Work Orders</h1>
          <p className="text-sm text-gray-500">{tenant.name}</p>
        </div>
        <Link
          href={`/tenant/new?phone=${encodeURIComponent(phone)}`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Submit Request
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No work orders found.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((wo) => {
            const appts = appointmentsByWo.get(wo.id) ?? [];
            const slots = availabilityByWo.get(wo.id) ?? [];
            const boundAction = updateAvailability.bind(null, wo.id, phone);
            return (
              <WorkOrderCard
                key={wo.id}
                workOrder={wo}
                slots={slots}
                appointments={appts}
                phone={phone}
                updateAction={boundAction}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
