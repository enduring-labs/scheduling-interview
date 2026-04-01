import { db } from "@/lib/db";
import { workOrders, technicians } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function TechPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (!id) {
    const techs = await db.select().from(technicians);
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="mb-4 text-2xl font-bold">Tech Portal</h1>
        <p className="mb-4 text-gray-500">Select a technician:</p>
        <div className="space-y-2">
          {techs.map((t) => (
            <a
              key={t.id}
              href={`/tech?id=${t.id}`}
              className="block rounded-lg border bg-white p-3 shadow-sm hover:bg-gray-50"
            >
              <p className="font-medium">{t.name}</p>
              <p className="text-sm text-gray-500">{t.specialty}</p>
            </a>
          ))}
        </div>
      </main>
    );
  }

  const tech = await db
    .select()
    .from(technicians)
    .where(eq(technicians.id, id))
    .then((r) => r[0]);

  if (!tech) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <p className="text-gray-500">Technician not found.</p>
      </main>
    );
  }

  const orders = await db
    .select()
    .from(workOrders)
    .where(eq(workOrders.assignedTechnicianId, id));

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-1 text-2xl font-bold">{tech.name}</h1>
      <p className="mb-6 text-sm text-gray-500">{tech.specialty}</p>

      {orders.length === 0 ? (
        <p className="text-gray-500">No assigned work orders.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((wo) => (
            <div key={wo.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{wo.title}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {wo.tenantName} &middot; {wo.propertyAddress}
                    {wo.unitNumber ? ` #${wo.unitNumber}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase">
                    {wo.status}
                  </span>
                  <p className="mt-1 text-xs text-gray-400">
                    {wo.priority} priority
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
