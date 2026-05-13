"use client";

import { formatHour } from "@/lib/calendar";

export interface TechOption {
  id: string;
  name: string;
  specialty: string;
}

export interface TechConflict {
  free: boolean;
  conflictHours: number[];
}

interface TechSidebarProps {
  /** Header text, e.g. "Wed 5/14 · 10 AM – 1 PM" */
  header: string;
  /** List of technicians to display */
  technicians: TechOption[];
  /** Returns conflict info for a given tech in the current time block */
  getTechStatus: (techId: string) => TechConflict;
  /** Called when a free tech is clicked */
  onSelect: (techId: string, techName: string) => void;
  /** Called when "Cancel" is clicked */
  onCancel: () => void;
  /** If provided, shows a "Remove" button that calls this handler */
  onRemove?: () => void;
}

export function TechSidebar({
  header,
  technicians,
  getTechStatus,
  onSelect,
  onCancel,
  onRemove,
}: TechSidebarProps) {
  return (
    <div className="w-64 border-l bg-gray-50 p-4 space-y-3 shrink-0">
      <p className="text-sm font-semibold text-gray-800">{header}</p>

      <div className="space-y-1">
        {technicians.map((tech) => {
          const { free, conflictHours } = getTechStatus(tech.id);
          return (
            <button
              key={tech.id}
              type="button"
              disabled={!free}
              onClick={() => free && onSelect(tech.id, tech.name)}
              className={`w-full text-left rounded-md px-3 py-2 text-sm transition-colors ${
                free
                  ? "hover:bg-blue-100 cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-2">
                {free ? (
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />
                ) : (
                  <span className="inline-block w-2 h-2 rounded-full bg-red-400 shrink-0" />
                )}
                <span className="font-medium">{tech.name}</span>
              </div>
              <div className="ml-4 text-xs text-gray-500">{tech.specialty}</div>
              {!free && (
                <div className="ml-4 text-xs text-red-500">
                  busy {conflictHours.map((h) => formatHour(h)).join(", ")}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 pt-2 border-t">
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex-1 rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Remove
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
