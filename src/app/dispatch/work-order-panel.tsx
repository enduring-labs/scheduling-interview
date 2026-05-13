"use client";

import { useState, useMemo, useTransition, useCallback, useEffect, useRef } from "react";
import { WeekGrid } from "@/components/calendar/week-grid";
import { getUpcomingDays, HOURS, formatHour } from "@/lib/calendar";
import { formatTime } from "@/lib/utils";
import { bookAppointment } from "@/lib/actions/appointments";
import { cellStyles, priorityBadge } from "@/lib/calendar-styles";

interface AvailSlot {
  id: string;
  workOrderId: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface AppointmentSlot {
  id: string;
  workOrderId: string;
  technicianId: string;
  date: string;
  startTime: string;
  endTime: string;
  technicianName: string;
}

interface Tech {
  id: string;
  name: string;
  specialty: string;
}

interface WorkOrder {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  tenantName: string;
  propertyAddress: string;
  unitNumber: string | null;
}

interface WorkOrderPanelProps {
  workOrder: WorkOrder;
  technicians: Tech[];
  availability: AvailSlot[];
  appointments: AppointmentSlot[];
  allAppointments: AppointmentSlot[];
}

export function WorkOrderPanel({
  workOrder,
  technicians,
  availability,
  appointments,
  allAppointments,
}: WorkOrderPanelProps) {
  const [selectedTechId, setSelectedTechId] = useState<string>("");
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  // Drag state (refs to match tenant availability-grid pattern)
  const dragging = useRef(false);
  const dragMode = useRef<"add" | "remove">("add");

  const days = useMemo(() => getUpcomingDays(7), []);

  // Tenant availability cells
  const availableCells = useMemo(() => {
    const set = new Set<string>();
    for (const slot of availability) {
      const startH = parseInt(slot.startTime.split(":")[0], 10);
      const endH = parseInt(slot.endTime.split(":")[0], 10);
      for (let h = startH; h < endH; h++) {
        set.add(`${slot.date}|${h}`);
      }
    }
    return set;
  }, [availability]);

  // Already-booked cells for this work order
  const bookedCells = useMemo(() => {
    const set = new Set<string>();
    for (const appt of appointments) {
      const startH = parseInt(appt.startTime.split(":")[0], 10);
      const endH = parseInt(appt.endTime.split(":")[0], 10);
      for (let h = startH; h < endH; h++) {
        set.add(`${appt.date}|${h}`);
      }
    }
    return set;
  }, [appointments]);

  // Selected tech's busy cells (from all their appointments)
  const techBusyCells = useMemo(() => {
    const set = new Set<string>();
    if (!selectedTechId) return set;
    for (const appt of allAppointments) {
      if (appt.technicianId !== selectedTechId) continue;
      const startH = parseInt(appt.startTime.split(":")[0], 10);
      const endH = parseInt(appt.endTime.split(":")[0], 10);
      for (let h = startH; h < endH; h++) {
        set.add(`${appt.date}|${h}`);
      }
    }
    return set;
  }, [selectedTechId, allAppointments]);

  // Drag handlers
  const onPointerDown = useCallback(
    (key: string) => {
      // Only allow drag on overlap cells (available + tech free)
      if (!availableCells.has(key)) return;
      if (bookedCells.has(key)) return;
      if (selectedTechId && techBusyCells.has(key)) return;
      if (!selectedTechId) return; // must pick a tech first

      dragging.current = true;
      const mode = selectedCells.has(key) ? "remove" : "add";
      dragMode.current = mode;
      setSelectedCells((prev) => {
        const next = new Set(prev);
        if (mode === "remove") next.delete(key);
        else next.add(key);
        return next;
      });
    },
    [availableCells, bookedCells, selectedTechId, techBusyCells, selectedCells],
  );

  const onPointerEnter = useCallback(
    (key: string) => {
      if (!dragging.current) return;
      if (!availableCells.has(key)) return;
      if (bookedCells.has(key)) return;
      if (selectedTechId && techBusyCells.has(key)) return;

      setSelectedCells((prev) => {
        const next = new Set(prev);
        if (dragMode.current === "remove") next.delete(key);
        else next.add(key);
        return next;
      });
    },
    [availableCells, bookedCells, selectedTechId, techBusyCells],
  );

  useEffect(() => {
    const onPointerUp = () => { dragging.current = false; };
    window.addEventListener("pointerup", onPointerUp);
    return () => window.removeEventListener("pointerup", onPointerUp);
  }, []);

  function handleBook() {
    if (!selectedTechId || selectedCells.size === 0) return;

    const byDate = new Map<string, number[]>();
    for (const key of selectedCells) {
      const [date, hourStr] = key.split("|");
      const hours = byDate.get(date) ?? [];
      hours.push(parseInt(hourStr, 10));
      byDate.set(date, hours);
    }

    startTransition(async () => {
      for (const [date, hours] of byDate) {
        hours.sort((a, b) => a - b);
        let rangeStart = hours[0];
        let rangeEnd = hours[0] + 1;

        for (let i = 1; i < hours.length; i++) {
          if (hours[i] === rangeEnd) {
            rangeEnd = hours[i] + 1;
          } else {
            await bookAppointment(
              workOrder.id,
              selectedTechId,
              date,
              `${String(rangeStart).padStart(2, "0")}:00`,
              `${String(rangeEnd).padStart(2, "0")}:00`,
            );
            rangeStart = hours[i];
            rangeEnd = hours[i] + 1;
          }
        }
        await bookAppointment(
          workOrder.id,
          selectedTechId,
          date,
          `${String(rangeStart).padStart(2, "0")}:00`,
          `${String(rangeEnd).padStart(2, "0")}:00`,
        );
      }
      setSelectedCells(new Set());
    });
  }

  const canBook = selectedTechId && selectedCells.size > 0 && !isPending;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-semibold">{workOrder.title}</h2>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              priorityBadge[workOrder.priority] ?? priorityBadge.normal
            }`}
          >
            {workOrder.priority}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {workOrder.tenantName} &middot; {workOrder.propertyAddress}
          {workOrder.unitNumber ? ` #${workOrder.unitNumber}` : ""}
        </p>
      </div>

      {/* Existing appointments */}
      {appointments.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 uppercase">Scheduled visits</p>
          {appointments.map((appt) => (
            <div key={appt.id} className="text-sm text-gray-700 bg-green-50 border border-green-200 rounded px-2 py-1">
              {appt.date} &middot; {formatTime(appt.startTime)}–{formatTime(appt.endTime)} &middot; {appt.technicianName}
            </div>
          ))}
        </div>
      )}

      {/* Tech picker dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assign Technician
        </label>
        <select
          value={selectedTechId}
          onChange={(e) => {
            setSelectedTechId(e.target.value);
            setSelectedCells(new Set());
          }}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select a technician...</option>
          {technicians.map((tech) => (
            <option key={tech.id} value={tech.id}>
              {tech.name} — {tech.specialty}
            </option>
          ))}
        </select>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-white border border-gray-200" /> Tenant available
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-green-100 border border-green-300" /> Booked
        </span>
        {selectedTechId && (
          <>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-emerald-100 border border-emerald-300" /> Bookable
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-blue-500 border border-blue-600" /> Selected
            </span>
            <span className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 border border-gray-200"
                style={{
                  background: "repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
                }}
              /> Tech busy
            </span>
          </>
        )}
      </div>

      {/* Week grid */}
      <WeekGrid
        days={days}
        cellHeight="h-9"
        labelWidth="3.5rem"
        textSize="text-xs"
        renderCell={(dateKey, hour, rowIdx) => {
          const cellKey = `${dateKey}|${hour}`;
          const isAvailable = availableCells.has(cellKey);
          const isBooked = bookedCells.has(cellKey);
          const isTechBusy = techBusyCells.has(cellKey);
          const isSelected = selectedCells.has(cellKey);
          const isLast = rowIdx === HOURS.length - 1;

          const borderBase = `border-x border-t ${isLast ? "border-b" : ""}`;

          // Booked for this WO
          if (isBooked) {
            return (
              <div className={`w-full h-9 ${borderBase} ${cellStyles.booked} flex items-center justify-center`}>
                <span className="text-[10px] text-green-700">Booked</span>
              </div>
            );
          }

          // Selected by dispatcher
          if (isSelected) {
            return (
              <button
                type="button"
                onPointerDown={(e) => { e.preventDefault(); onPointerDown(cellKey); }}
                onPointerEnter={() => onPointerEnter(cellKey)}
                className={`block w-full h-9 text-[10px] ${borderBase} ${cellStyles.selected} cursor-pointer select-none touch-none`}
              />
            );
          }

          // Tenant available + tech selected
          if (isAvailable && selectedTechId) {
            if (isTechBusy) {
              // Tenant free but tech busy — white with diagonal stripes
              return (
                <div
                  className={`w-full h-9 ${borderBase} border-gray-200`}
                  style={{
                    background: "repeating-linear-gradient(-45deg, white, white 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 6px)",
                  }}
                />
              );
            }
            // Both free — bookable
            return (
              <button
                type="button"
                onPointerDown={(e) => { e.preventDefault(); onPointerDown(cellKey); }}
                onPointerEnter={() => onPointerEnter(cellKey)}
                className={`block w-full h-9 text-[10px] transition-colors ${borderBase} ${cellStyles.available} cursor-crosshair ${cellStyles.availableHover} select-none touch-none`}
              />
            );
          }

          // Tenant available, no tech selected — white
          if (isAvailable) {
            return (
              <div className={`w-full h-9 ${borderBase} ${cellStyles.empty}`} />
            );
          }

          // Unavailable — gray
          return (
            <div className={`w-full h-9 ${borderBase} ${cellStyles.unavailable}`} />
          );
        }}
      />

      {/* Book button */}
      <button
        type="button"
        onClick={handleBook}
        disabled={!canBook}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Booking..." : `Book Appointment${selectedCells.size > 0 ? ` (${selectedCells.size} slots)` : ""}`}
      </button>
    </div>
  );
}
