import type { InferSelectModel } from "drizzle-orm";
import { workOrders } from "@/lib/db/schema";

type WorkOrder = InferSelectModel<typeof workOrders>;

export function TenantWorkOrderCard({ workOrder: wo }: { workOrder: WorkOrder }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
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
  );
}
