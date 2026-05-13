"use client";

import { useState } from "react";
import { AvailabilityGrid } from "@/components/calendar/availability-grid";
import { AvailabilityMiniGrid } from "@/components/calendar/availability-mini-grid";
import { formatDate, formatTime } from "@/lib/utils";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  technicianName: string;
}

interface AvailabilitySlot {
  date: string;
  startTime: string;
}

interface WorkOrder {
  id: string;
  title: string;
  description: string | null;
  status: string;
  propertyAddress: string;
  unitNumber: string | null;
}

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  slots: AvailabilitySlot[];
  appointments: Appointment[];
  phone: string;
  updateAction: (formData: FormData) => Promise<void>;
}

export function WorkOrderCard({
  workOrder,
  slots,
  appointments,
  phone,
  updateAction,
}: WorkOrderCardProps) {
  const [showAvailability, setShowAvailability] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const hasAppointments = appointments.length > 0;
  const hasSlots = slots.length > 0;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium">{workOrder.title}</p>
          <p className="mt-1 text-sm text-gray-500">
            {workOrder.propertyAddress}
            {workOrder.unitNumber ? ` #${workOrder.unitNumber}` : ""}
          </p>
          {workOrder.description && (
            <p className="mt-2 text-sm text-gray-600">
              {workOrder.description}
            </p>
          )}
        </div>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase">
          {workOrder.status}
        </span>
      </div>

      {/* Scheduled appointments */}
      {hasAppointments && (
        <div className="mt-3 space-y-2 border-t pt-3">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-800"
            >
              <span className="font-medium">Scheduled:</span>
              <span>
                {formatDate(a.date)} {formatTime(a.startTime)}&ndash;{formatTime(a.endTime)}
              </span>
              <span className="text-green-600">with {a.technicianName}</span>
            </div>
          ))}
        </div>
      )}

      {/* Availability section (only for open work orders without appointments) */}
      {!hasAppointments && (
        <div className="mt-3 border-t pt-3">
          {hasSlots ? (
            <>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAvailability((v) => !v)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  {showAvailability ? "Hide Availability" : "See Availability"}
                  <span className={`ml-1 inline-block transition-transform ${showAvailability ? "rotate-180" : ""}`}>&#9660;</span>
                </button>
                {showAvailability && (
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="text-sm font-medium text-blue-600 underline hover:text-blue-800"
                  >
                    Edit
                  </button>
                )}
              </div>
              {showAvailability && (
                <div className="mt-2">
                  <AvailabilityMiniGrid slots={slots} />
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                No availability submitted.
              </p>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Add Availability
              </button>
            </>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit Availability</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <form
              action={async (formData) => {
                await updateAction(formData);
                setShowModal(false);
              }}
            >
              <AvailabilityGrid initialSlots={slots} />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
