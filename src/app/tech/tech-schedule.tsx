"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { getUpcomingDays, formatDateKey, HOURS } from "@/lib/calendar";
import { WeekGrid } from "@/components/calendar/week-grid";
import { AppointmentDetail, type Appointment } from "./appointment-detail";
import { priorityBlock } from "@/lib/calendar-styles";

interface TechScheduleProps {
  appointments: Appointment[];
}

export function TechSchedule({ appointments }: TechScheduleProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const weekDays = useMemo(() => getUpcomingDays(7, startDate), [startDate]);

  // Index appointments by dateKey → hour for quick lookup
  const appointmentsByCell = useMemo(() => {
    const map = new Map<string, Appointment>();
    for (const appt of appointments) {
      const startHour = parseInt(appt.startTime.split(":")[0], 10);
      const endHour = parseInt(appt.endTime.split(":")[0], 10);
      for (let h = startHour; h < endHour; h++) {
        map.set(`${appt.date}|${h}`, appt);
      }
    }
    return map;
  }, [appointments]);

  // Track which cells are the "start" of an appointment (render block only here)
  const appointmentStarts = useMemo(() => {
    const map = new Map<string, { appointment: Appointment; spanHours: number }>();
    for (const appt of appointments) {
      const startHour = parseInt(appt.startTime.split(":")[0], 10);
      const endHour = parseInt(appt.endTime.split(":")[0], 10);
      const span = Math.max(1, endHour - startHour);
      map.set(`${appt.date}|${startHour}`, { appointment: appt, spanHours: span });
    }
    return map;
  }, [appointments]);

  function handleCalendarSelect(date: Date | undefined) {
    if (!date) return;
    setStartDate(date);
    setShowCalendar(false);
  }

  return (
    <div className="relative">
      {/* Calendar overlay */}
      {showCalendar && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowCalendar(false)}
          />
          <div className="absolute left-0 top-10 z-50">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleCalendarSelect}
              className="rounded-md border bg-white shadow-lg"
            />
          </div>
        </>
      )}

      <div className="flex-1 min-w-0">
        {/* Calendar toggle */}
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
      </div>

      <div className={`flex ${showCalendar ? "blur-[1px] pointer-events-none" : ""}`}>
      <div className="flex-1 min-w-0">

        {/* Week grid */}
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

            // If this cell is part of an appointment but not the start, render empty
            // (the start cell's absolute-positioned block covers it)
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
                    onClick={() => setSelectedAppointment(start.appointment)}
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

      {/* Side panel */}
      {selectedAppointment && (
        <AppointmentDetail
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
      </div>
    </div>
  );
}
