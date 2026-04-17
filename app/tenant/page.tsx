import { db } from "@/lib/db";
import { workOrders, tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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

  const tenant = await db
    .select()
    .from(tenants)
    .where(eq(tenants.phone, phone))
    .then((rows) => rows[0]);

  if (!tenant) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="mb-4 text-2xl font-bold">Tenant Portal</h1>
        <p className="text-gray-500">No account found for this phone number.</p>
      </main>
    );
  }

  const orders = await db
    .select()
    .from(workOrders)
    .where(eq(workOrders.tenantId, tenant.id));

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
          {orders.map((wo) => (
            <div key={wo.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{wo.title}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {wo.propertyAddress}
                    {wo.unitNumber ? ` #${wo.unitNumber}` : ""}
                  </p>
                  {wo.description && (
                    <p className="mt-2 text-sm text-gray-600">{wo.description}</p>
                  )}
                </div>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase">
                  {wo.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
