"use client";

import { getUpcomingDays, HOURS } from "@/lib/calendar";
import { WeekGrid } from "@/components/calendar/week-grid";
import { cellStyles } from "@/lib/calendar-styles";

interface Slot {
  date: string;
  startTime: string;
}

export function AvailabilityMiniGrid({ slots }: { slots: Slot[] }) {
  const selected = new Set(
    slots.map((s) => {
      const hour = parseInt(s.startTime.split(":")[0], 10);
      return `${s.date}|${hour}`;
    }),
  );

  const days = getUpcomingDays(7);

  return (
    <WeekGrid
      days={days}
      cellHeight="h-5"
      labelWidth="2.5rem"
      textSize="text-[10px]"
      renderCell={(dateKey, hour, rowIdx) => {
        const key = `${dateKey}|${hour}`;
        const isSelected = selected.has(key);
        const isLast = rowIdx === HOURS.length - 1;
        return (
          <div
            className={`w-full h-5 border-x border-t ${
              isLast ? "border-b" : ""
            } ${
              isSelected
                ? cellStyles.selected
                : cellStyles.unavailable
            }`}
          />
        );
      }}
    />
  );
}
