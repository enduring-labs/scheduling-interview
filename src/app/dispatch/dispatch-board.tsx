"use client";

import { useState } from "react";
import { WorkOrderPanel } from "./work-order-panel";
import { TechSchedulePanel } from "./tech-schedule-panel";
import { cn } from "@/lib/utils";
import { priorityBadge } from "@/lib/calendar-styles";

interface WorkOrder {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  tenantId: string;
  tenantName: string;
  propertyAddress: string;
  unitNumber: string | null;
}

interface Tech {
  id: string;
  name: string;
  specialty: string;
}

interface AvailSlot {
  id: string;
  workOrderId: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface AppointmentData {
  id: string;
  workOrderId: string;
  technicianId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string | null;
  technicianName: string;
  workOrderTitle: string;
  workOrderPriority: string;
  propertyAddress: string;
  unitNumber: string | null;
  tenantName: string;
}

interface DispatchBoardProps {
  workOrders: WorkOrder[];
  technicians: Tech[];
  availabilityByWO: Record<string, AvailSlot[]>;
  appointmentsByWO: Record<string, AppointmentData[]>;
  allAppointments: AppointmentData[];
}

export function DispatchBoard({
  workOrders,
  technicians,
  availabilityByWO,
  appointmentsByWO,
  allAppointments,
}: DispatchBoardProps) {
  const [activeTab, setActiveTab] = useState<"work-orders" | "technicians">("work-orders");
  const [selectedWOId, setSelectedWOId] = useState<string | null>(null);
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
  const [woFilter, setWoFilter] = useState<"all" | "unscheduled" | "scheduled">("all");

  const selectedWO = workOrders.find((wo) => wo.id === selectedWOId) ?? null;
  const selectedTech = technicians.find((t) => t.id === selectedTechId) ?? null;

  const techAppointments = selectedTechId
    ? allAppointments.filter((a) => a.technicianId === selectedTechId)
    : [];

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col">
      {/* Tabs */}
      <div className="flex border-b bg-white px-4">
        <button
          type="button"
          onClick={() => { setActiveTab("work-orders"); setSelectedTechId(null); }}
          className={cn(
            "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
            activeTab === "work-orders"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Work Orders
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab("technicians"); setSelectedWOId(null); }}
          className={cn(
            "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
            activeTab === "technicians"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Technicians
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar */}
        <div className="w-80 border-r bg-white overflow-y-auto">
          {activeTab === "work-orders" ? (
            <div className="p-3 space-y-2">
              {/* Filter toggles */}
              <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs font-medium">
                {(["all", "unscheduled", "scheduled"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setWoFilter(f)}
                    className={cn(
                      "flex-1 rounded-md px-2 py-1.5 capitalize transition-colors",
                      woFilter === f
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {workOrders
                .filter((wo) => {
                  if (woFilter === "all") return true;
                  const hasAppts = (appointmentsByWO[wo.id] ?? []).length > 0;
                  return woFilter === "scheduled" ? hasAppts : !hasAppts;
                })
                .sort((a, b) => {
                  const rank: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
                  return (rank[a.priority] ?? 99) - (rank[b.priority] ?? 99);
                })
                .map((wo) => {
                const avail = availabilityByWO[wo.id] ?? [];
                const appts = appointmentsByWO[wo.id] ?? [];
                const availCount = avail.length;
                const apptCount = appts.length;

                return (
                  <button
                    key={wo.id}
                    type="button"
                    onClick={() => setSelectedWOId(wo.id)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-colors cursor-pointer",
                      selectedWOId === wo.id
                        ? "border-blue-400 bg-blue-50 ring-1 ring-blue-400"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm">{wo.title}</p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          priorityBadge[wo.priority] ?? priorityBadge.normal
                        }`}
                      >
                        {wo.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {wo.tenantName} &middot; {wo.propertyAddress}
                      {wo.unitNumber ? ` #${wo.unitNumber}` : ""}
                    </p>
                    <div className="mt-1.5 flex gap-3 text-[11px] text-gray-400">
                      <span>{availCount > 0 ? `${availCount} windows` : "No availability"}</span>
                      <span>{apptCount > 0 ? `${apptCount} visit${apptCount > 1 ? "s" : ""}` : "No visits"}</span>
                    </div>
                  </button>
                );
              })}
              {workOrders.filter((wo) => {
                if (woFilter === "all") return true;
                const hasAppts = (appointmentsByWO[wo.id] ?? []).length > 0;
                return woFilter === "scheduled" ? hasAppts : !hasAppts;
              }).length === 0 && (
                <p className="text-sm text-gray-400 p-2">
                  {workOrders.length === 0
                    ? "No work orders."
                    : woFilter === "scheduled"
                      ? "No scheduled work orders."
                      : "No unscheduled work orders."}
                </p>
              )}
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {technicians.map((tech) => {
                const techAppts = allAppointments.filter(
                  (a) => a.technicianId === tech.id
                );
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => setSelectedTechId(tech.id)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-colors cursor-pointer",
                      selectedTechId === tech.id
                        ? "border-blue-400 bg-blue-50 ring-1 ring-blue-400"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    )}
                  >
                    <p className="font-medium text-sm">{tech.name}</p>
                    <p className="text-xs text-gray-500">{tech.specialty}</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {techAppts.length > 0
                        ? `${techAppts.length} appointment${techAppts.length > 1 ? "s" : ""}`
                        : "No appointments"}
                    </p>
                  </button>
                );
              })}
              {technicians.length === 0 && (
                <p className="text-sm text-gray-400 p-2">No technicians.</p>
              )}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {activeTab === "work-orders" ? (
            selectedWO ? (
              <WorkOrderPanel
                key={selectedWO.id}
                workOrder={selectedWO}
                technicians={technicians}
                availability={availabilityByWO[selectedWO.id] ?? []}
                appointments={(appointmentsByWO[selectedWO.id] ?? []).map((a) => ({
                  ...a,
                }))}
                allAppointments={allAppointments}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                Select a work order to view scheduling
              </div>
            )
          ) : selectedTech ? (
            <TechSchedulePanel
              key={selectedTech.id}
              techName={selectedTech.name}
              appointments={techAppointments}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Select a technician to view their schedule
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
