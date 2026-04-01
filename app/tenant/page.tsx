import { TenantWorkOrderCard } from "@/components/tenant-work-order-card";
import { db } from "@/lib/db";
import { workOrders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function TenantPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone } = await searchParams;

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

  const orders = await db
    .select()
    .from(workOrders)
    .where(eq(workOrders.tenantPhone, phone));

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-1 text-2xl font-bold">My Work Orders</h1>
      <p className="mb-6 text-sm text-gray-500">{orders[0]?.tenantName}</p>

      {orders.length === 0 ? (
        <p className="text-gray-500">No work orders found for this number.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((wo) => (
            <TenantWorkOrderCard key={wo.id} workOrder={wo} />
          ))}
        </div>
      )}
    </main>
  );
}
