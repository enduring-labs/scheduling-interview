import { db } from "@/lib/db";
import { tenants, workOrders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function NewWorkOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone: rawPhone } = await searchParams;
  const phone = rawPhone?.replace(/^\s/, "+");

  if (!phone) redirect("/tenant");

  const tenant = await db
    .select()
    .from(tenants)
    .where(eq(tenants.phone, phone))
    .then((rows) => rows[0]);

  if (!tenant) redirect("/tenant");

  async function createWorkOrder(formData: FormData) {
    "use server";
    await db.insert(workOrders).values({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      propertyAddress: formData.get("propertyAddress") as string,
      unitNumber: (formData.get("unitNumber") as string) || null,
      priority: (formData.get("priority") as string) || "normal",
      tenantId: tenant!.id,
    });
    redirect(`/tenant?phone=${encodeURIComponent(phone!)}`);
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-6">
        <a
          href={`/tenant?phone=${encodeURIComponent(phone)}`}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to my work orders
        </a>
      </div>
      <h1 className="mb-2 text-2xl font-bold">Submit a Maintenance Request</h1>
      <p className="mb-6 text-sm text-gray-500">Submitting as {tenant.name}</p>

      <form action={createWorkOrder} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Issue Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Kitchen faucet leaking"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Describe the issue in detail..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700">
            Property Address <span className="text-red-500">*</span>
          </label>
          <input
            id="propertyAddress"
            name="propertyAddress"
            type="text"
            required
            placeholder="123 Main St"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="unitNumber" className="block text-sm font-medium text-gray-700">
            Unit Number
          </label>
          <input
            id="unitNumber"
            name="unitNumber"
            type="text"
            placeholder="e.g. 2B"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue="normal"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Request
          </button>
        </div>
      </form>
    </main>
  );
}
