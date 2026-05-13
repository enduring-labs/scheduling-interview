import { getTenantByPhone } from "@/lib/queries/tenants";
import { createWorkOrder } from "@/lib/actions/work-orders";
import { redirect } from "next/navigation";
import { WorkOrderForm } from "./work-order-form";

export default async function NewWorkOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone: rawPhone } = await searchParams;
  const phone = rawPhone?.replace(/^\s/, "+");

  if (!phone) redirect("/tenant");

  const tenant = await getTenantByPhone(phone);

  if (!tenant) redirect("/tenant");

  const handleSubmit = createWorkOrder.bind(null, tenant.id, phone);

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

      <WorkOrderForm action={handleSubmit} />
    </main>
  );
}
