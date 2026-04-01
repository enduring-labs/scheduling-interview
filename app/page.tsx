import { db } from "@/lib/db";
import { workOrders, technicians } from "@/lib/db/schema";

export default async function Home() {
  const orders = await db.select().from(workOrders);
  const techs = await db.select().from(technicians);

  // Grab a sample tenant phone for the link
  const samplePhone = orders[0]?.tenantPhone;

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-2xl font-bold">Maintenance Scheduling</h1>
      <p className="mb-8 text-gray-500">
        {orders.length} work orders &middot; {techs.length} technicians
      </p>

      <div className="space-y-3">
        <a
          href={`/tenant${samplePhone ? `?phone=${encodeURIComponent(samplePhone)}` : ""}`}
          className="block rounded-lg border bg-white p-4 shadow-sm hover:bg-gray-50"
        >
          <p className="font-semibold">Tenant Portal</p>
          <p className="text-sm text-gray-500">View work orders and submit availability</p>
        </a>

        <a
          href="/tech"
          className="block rounded-lg border bg-white p-4 shadow-sm hover:bg-gray-50"
        >
          <p className="font-semibold">Tech Portal</p>
          <p className="text-sm text-gray-500">View assigned work and schedule</p>
        </a>

        <a
          href="/dispatch"
          className="block rounded-lg border bg-white p-4 shadow-sm hover:bg-gray-50"
        >
          <p className="font-semibold">Dispatch</p>
          <p className="text-sm text-gray-500">Manage all scheduling across technicians</p>
        </a>
      </div>
    </main>
  );
}
