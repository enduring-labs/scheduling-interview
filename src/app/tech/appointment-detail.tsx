"use client";

import { formatTime } from "@/lib/utils";

export interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string | null;
  workOrderTitle: string;
  workOrderDescription: string | null;
  workOrderPriority: string;
  propertyAddress: string;
  unitNumber: string | null;
  tenantName: string;
}

const priorityColor: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  normal: "bg-blue-100 text-blue-700",
  low: "bg-gray-100 text-gray-600",
};

interface AppointmentDetailProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export function AppointmentDetail({ appointment, onClose }: AppointmentDetailProps) {
  if (!appointment) return null;

  return (
    <div className="w-80 border-l bg-white p-5 overflow-y-auto">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 pr-2">
          {appointment.workOrderTitle}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
              priorityColor[appointment.workOrderPriority] ?? priorityColor.normal
            }`}
          >
            {appointment.workOrderPriority}
          </span>
        </div>

        <div>
          <p className="font-medium text-gray-700">Time</p>
          <p className="text-gray-600">
            {formatTime(appointment.startTime)} &ndash; {formatTime(appointment.endTime)}
          </p>
        </div>

        <div>
          <p className="font-medium text-gray-700">Address</p>
          <p className="text-gray-600">
            {appointment.propertyAddress}
            {appointment.unitNumber ? `, Unit ${appointment.unitNumber}` : ""}
          </p>
        </div>

        <div>
          <p className="font-medium text-gray-700">Tenant</p>
          <p className="text-gray-600">{appointment.tenantName}</p>
        </div>

        {appointment.workOrderDescription && (
          <div>
            <p className="font-medium text-gray-700">Description</p>
            <p className="text-gray-600">{appointment.workOrderDescription}</p>
          </div>
        )}

        {appointment.notes && (
          <div>
            <p className="font-medium text-gray-700">Notes</p>
            <p className="text-gray-600">{appointment.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
