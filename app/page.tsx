import { db } from "@/lib/db";
import { workOrders, technicians } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const orders = await db.select().from(workOrders);
  const techs = await db.select().from(technicians);

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Work Orders</h1>
      <div className="space-y-3">
        {orders.map((wo) => {
          const tech = techs.find((t) => t.id === wo.assignedTechnicianId);
          return (
            <div key={wo.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{wo.title}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {wo.tenantName} &middot; {wo.propertyAddress}
                    {wo.unitNumber ? ` #${wo.unitNumber}` : ""}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase">
                    {wo.status}
                  </span>
                  {tech && (
                    <p className="mt-1 text-gray-500">{tech.name}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
