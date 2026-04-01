import { db } from "@/lib/db";
import { workOrders, technicians } from "@/lib/db/schema";
import { isNull } from "drizzle-orm";

export default async function DispatchPage() {
  const orders = await db.select().from(workOrders);
  const techs = await db.select().from(technicians);

  const unassigned = orders.filter((wo) => !wo.assignedTechnicianId);
  const byTech = techs.map((tech) => ({
    tech,
    orders: orders.filter((wo) => wo.assignedTechnicianId === tech.id),
  }));

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Dispatch</h1>

      {/* Unassigned work orders */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">
          Unassigned ({unassigned.length})
        </h2>
        {unassigned.length === 0 ? (
          <p className="text-sm text-gray-500">All work orders are assigned.</p>
        ) : (
          <div className="space-y-2">
            {unassigned.map((wo) => (
              <div
                key={wo.id}
                className="rounded-lg border border-amber-200 bg-amber-50 p-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{wo.title}</p>
                    <p className="text-sm text-gray-600">
                      {wo.tenantName} &middot; {wo.propertyAddress}
                      {wo.unitNumber ? ` #${wo.unitNumber}` : ""}
                    </p>
                  </div>
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium uppercase text-amber-800">
                    {wo.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Per-technician view */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Technicians</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {byTech.map(({ tech, orders }) => (
            <div key={tech.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="mb-3 border-b pb-2">
                <p className="font-semibold">{tech.name}</p>
                <p className="text-xs text-gray-500">{tech.specialty}</p>
              </div>
              {orders.length === 0 ? (
                <p className="text-sm text-gray-400">No assigned work.</p>
              ) : (
                <div className="space-y-2">
                  {orders.map((wo) => (
                    <div key={wo.id} className="rounded bg-gray-50 p-2 text-sm">
                      <p className="font-medium">{wo.title}</p>
                      <p className="text-gray-500">
                        {wo.propertyAddress}
                        {wo.unitNumber ? ` #${wo.unitNumber}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
