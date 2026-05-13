"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { getUpcomingDays, formatDateKey, HOURS } from "@/lib/calendar";
import { formatTime } from "@/lib/utils";
import { WeekGrid } from "@/components/calendar/week-grid";
import { priorityBlock, priorityBadge } from "@/lib/calendar-styles";

interface TechAppointment {
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

interface TechSchedulePanelProps {
  techName: string;
  appointments: TechAppointment[];
}

export function TechSchedulePanel({ techName, appointments }: TechSchedulePanelProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<TechAppointment | null>(null);

  const weekDays = useMemo(() => getUpcomingDays(7, startDate), [startDate]);

  const appointmentsByCell = useMemo(() => {
    const map = new Map<string, TechAppointment>();
    for (const appt of appointments) {
      const startH = parseInt(appt.startTime.split(":")[0], 10);
      const endH = parseInt(appt.endTime.split(":")[0], 10);
      for (let h = startH; h < endH; h++) {
        map.set(`${appt.date}|${h}`, appt);
      }
    }
    return map;
  }, [appointments]);

  const appointmentStarts = useMemo(() => {
    const map = new Map<string, { appointment: TechAppointment; spanHours: number }>();
    for (const appt of appointments) {
      const startH = parseInt(appt.startTime.split(":")[0], 10);
      const endH = parseInt(appt.endTime.split(":")[0], 10);
      const span = Math.max(1, endH - startH);
      map.set(`${appt.date}|${startH}`, { appointment: appt, spanHours: span });
    }
    return map;
  }, [appointments]);

  function handleCalendarSelect(date: Date | undefined) {
    if (!date) return;
    setStartDate(date);
    setShowCalendar(false);
  }

  return (
    <div className="p-4 relative">
      <h2 className="text-lg font-semibold mb-2">{techName}</h2>

      {/* Calendar overlay */}
      {showCalendar && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowCalendar(false)} />
          <div className="absolute left-4 top-20 z-50">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleCalendarSelect}
              className="rounded-md border bg-white shadow-lg"
            />
          </div>
        </>
      )}

      <p className="mb-4 text-sm text-gray-500">
        Start Date:{" "}
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className="underline text-gray-900 font-medium hover:text-gray-700 cursor-pointer"
        >
          {startDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </button>
      </p>

      <div className={`flex ${showCalendar ? "blur-[1px] pointer-events-none" : ""}`}>
        <div className="flex-1 min-w-0">
          <WeekGrid
            days={weekDays}
            cellHeight="h-16"
            labelWidth="4rem"
            textSize="text-sm"
            renderCell={(dateKey, hour, rowIdx) => {
              const cellKey = `${dateKey}|${hour}`;
              const isLast = rowIdx === HOURS.length - 1;
              const start = appointmentStarts.get(cellKey);
              const occupied = appointmentsByCell.has(cellKey);

              if (occupied && !start) {
                return (
                  <div
                    className={`w-full h-16 border-x border-t ${isLast ? "border-b" : ""} border-gray-200 bg-white`}
                  />
                );
              }

              return (
                <div
                  className={`relative w-full h-16 border-x border-t ${isLast ? "border-b" : ""} border-gray-200 bg-white`}
                >
                  {start && (
                    <button
                      type="button"
                      onClick={() => setSelectedAppt(start.appointment)}
                      className={`absolute inset-x-0.5 top-0.5 z-10 rounded border px-1.5 py-0.5 text-left text-xs cursor-pointer hover:opacity-80 overflow-hidden ${
                        priorityBlock[start.appointment.workOrderPriority] ??
                        priorityBlock.normal
                      }`}
                      style={{
                        height: `calc(${start.spanHours} * 4rem - 0.25rem)`,
                      }}
                    >
                      <p className="font-medium truncate">{start.appointment.workOrderTitle}</p>
                      <p className="text-[10px] opacity-75 truncate">
                        {start.appointment.tenantName}
                      </p>
                    </button>
                  )}
                </div>
              );
            }}
          />
        </div>

        {/* Detail panel */}
        {selectedAppt && (
          <div className="w-72 border-l bg-white p-4 overflow-y-auto">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900 pr-2">
                {selectedAppt.workOrderTitle}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedAppt(null)}
                className="shrink-0 rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  priorityBadge[selectedAppt.workOrderPriority] ?? priorityBadge.normal
                }`}
              >
                {selectedAppt.workOrderPriority}
              </span>
              <div>
                <p className="font-medium text-gray-700">Time</p>
                <p className="text-gray-600">
                  {formatTime(selectedAppt.startTime)} – {formatTime(selectedAppt.endTime)}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Address</p>
                <p className="text-gray-600">
                  {selectedAppt.propertyAddress}
                  {selectedAppt.unitNumber ? `, Unit ${selectedAppt.unitNumber}` : ""}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Tenant</p>
                <p className="text-gray-600">{selectedAppt.tenantName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
