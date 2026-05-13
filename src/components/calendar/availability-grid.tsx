"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getUpcomingDays, formatDateKey, HOURS } from "@/lib/calendar";
import { WeekGrid } from "@/components/calendar/week-grid";
import { cellStyles } from "@/lib/calendar-styles";

interface AvailabilityGridProps {
  initialSlots?: { date: string; startTime: string }[];
}

export function AvailabilityGrid({ initialSlots }: AvailabilityGridProps = {}) {
  const [selected, setSelected] = useState<Set<string>>(() => {
    if (!initialSlots || initialSlots.length === 0) return new Set();
    return new Set(
      initialSlots.map((s) => {
        const hour = parseInt(s.startTime.split(":")[0], 10);
        return `${s.date}|${hour}`;
      }),
    );
  });
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    setDays(getUpcomingDays(7));
  }, []);

  // Drag-to-select state
  const dragging = useRef(false);
  const dragMode = useRef<"add" | "remove">("add");

  const onPointerDown = useCallback((key: string) => {
    dragging.current = true;
    setSelected((prev) => {
      const mode = prev.has(key) ? "remove" : "add";
      dragMode.current = mode;
      const next = new Set(prev);
      if (mode === "remove") next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const onPointerEnter = useCallback((key: string) => {
    if (!dragging.current) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (dragMode.current === "remove") next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  useEffect(() => {
    const onPointerUp = () => { dragging.current = false; };
    window.addEventListener("pointerup", onPointerUp);
    return () => window.removeEventListener("pointerup", onPointerUp);
  }, []);

  if (days.length === 0) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Availability
        </label>
        <p className="text-xs text-gray-500 mb-3">Loading availability grid...</p>
        <input type="hidden" name="slots" value="[]" />
      </div>
    );
  }

  // Serialize selected slots as JSON array of {date, startTime, endTime}
  const slotsValue = JSON.stringify(
    Array.from(selected).map((key) => {
      const [date, hour] = key.split("|");
      const h = parseInt(hour, 10);
      return {
        date,
        startTime: `${String(h).padStart(2, "0")}:00`,
        endTime: `${String(h + 1).padStart(2, "0")}:00`,
      };
    })
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Your Availability
      </label>
      <p className="text-xs text-gray-500 mb-3">
        Select the time slots when you are available for a technician visit.
      </p>
      <WeekGrid
        days={days}
        cellHeight="h-9"
        labelWidth="3.5rem"
        textSize="text-xs"
        renderCell={(dateKey, hour, rowIdx) => {
          const key = `${dateKey}|${hour}`;
          const isSelected = selected.has(key);
          const isLast = rowIdx === HOURS.length - 1;
          return (
            <button
              type="button"
              onPointerDown={(e) => { e.preventDefault(); onPointerDown(key); }}
              onPointerEnter={() => onPointerEnter(key)}
              className={`block w-full h-9 text-[10px] transition-colors border-x border-t select-none touch-none ${
                isLast ? "border-b" : ""
              } ${
                isSelected
                  ? cellStyles.selected
                  : `${cellStyles.unavailable} text-gray-400 ${cellStyles.unselectedHover}`
              }`}
            />
          );
        }}
      />
      <input type="hidden" name="slots" value={slotsValue} />
    </div>
  );
}
