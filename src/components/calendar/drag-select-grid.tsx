"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { WeekGrid } from "@/components/calendar/week-grid";
import { getUpcomingDays, HOURS } from "@/lib/calendar";
import { cellStyles } from "@/lib/calendar-styles";

export interface DragSelection {
  date: string;
  hours: number[];
}

export interface AssignedBlock {
  id: string;
  date: string;
  hours: number[];
  label: string;
}

interface DragSelectGridProps {
  /** Cell keys ("2026-05-14|10") that are available for selection */
  availableCells: Set<string>;
  /** Cell keys that are already booked (shown as "Booked", not interactive) */
  bookedCells?: Set<string>;
  /** Blocks that have been assigned (shown in blue with label) */
  assignedBlocks?: AssignedBlock[];
  /** ID of the block whose cells should show a focus ring */
  focusedBlockId?: string | null;
  /** Currently selected (unassigned) cells — parent controls this */
  selectedCells: Set<string>;
  /** Called when selected cells change (add/remove via drag) */
  onSelectedCellsChange: (cells: Set<string>) => void;
  /** Called when user clicks an assigned block */
  onBlockClick?: (blockId: string) => void;
  /** Called when user drags over assigned cells to remove them */
  onBlockCellsRemoved?: (blockId: string, removedHours: number[]) => void;
}

export function DragSelectGrid({
  availableCells,
  bookedCells = new Set(),
  assignedBlocks = [],
  focusedBlockId = null,
  selectedCells,
  onSelectedCellsChange,
  onBlockClick,
  onBlockCellsRemoved,
}: DragSelectGridProps) {
  const dragging = useRef(false);
  const dragMode = useRef<"add" | "remove">("add");
  const dragDateRef = useRef<string | null>(null);

  const days = useMemo(() => getUpcomingDays(7), []);

  // Build map of assigned cells → block id
  const assignedCellMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const block of assignedBlocks) {
      for (const h of block.hours) {
        map.set(`${block.date}|${h}`, block.id);
      }
    }
    return map;
  }, [assignedBlocks]);

  // Build map of assigned cells → label
  const assignedLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const block of assignedBlocks) {
      for (const h of block.hours) {
        map.set(`${block.date}|${h}`, block.label);
      }
    }
    return map;
  }, [assignedBlocks]);

  // End drag on pointer up
  useEffect(() => {
    const onPointerUp = () => { dragging.current = false; dragDateRef.current = null; };
    window.addEventListener("pointerup", onPointerUp);
    return () => window.removeEventListener("pointerup", onPointerUp);
  }, []);

  const onPointerDown = useCallback(
    (cellKey: string, dateKey: string) => {
      if (bookedCells.has(cellKey)) return;
      if (!availableCells.has(cellKey) && !assignedCellMap.has(cellKey) && !selectedCells.has(cellKey)) return;

      dragging.current = true;
      dragDateRef.current = dateKey;

      // Determine mode: if cell is already selected or assigned, we're removing
      if (selectedCells.has(cellKey)) {
        dragMode.current = "remove";
        const next = new Set(selectedCells);
        next.delete(cellKey);
        onSelectedCellsChange(next);
      } else if (assignedCellMap.has(cellKey)) {
        // Click on assigned cell — open sidebar for that block
        dragMode.current = "remove";
        const blockId = assignedCellMap.get(cellKey)!;
        onBlockClick?.(blockId);
        // Don't start dragging for assigned — just click
        dragging.current = false;
      } else {
        dragMode.current = "add";
        const next = new Set(selectedCells);
        next.add(cellKey);
        onSelectedCellsChange(next);
      }
    },
    [bookedCells, availableCells, assignedCellMap, selectedCells, onSelectedCellsChange, onBlockClick],
  );

  const onPointerEnter = useCallback(
    (cellKey: string, dateKey: string) => {
      if (!dragging.current) return;
      if (dateKey !== dragDateRef.current) return;
      if (bookedCells.has(cellKey)) return;

      if (dragMode.current === "add") {
        if (!availableCells.has(cellKey)) return;
        if (assignedCellMap.has(cellKey)) return;
        const next = new Set(selectedCells);
        next.add(cellKey);
        onSelectedCellsChange(next);
      } else {
        // remove mode
        if (selectedCells.has(cellKey)) {
          const next = new Set(selectedCells);
          next.delete(cellKey);
          onSelectedCellsChange(next);
        }
      }
    },
    [availableCells, bookedCells, assignedCellMap, selectedCells, onSelectedCellsChange],
  );

  return (
    <WeekGrid
      days={days}
      cellHeight="h-9"
      labelWidth="3.5rem"
      textSize="text-xs"
      renderCell={(dateKey, hour, rowIdx) => {
        const cellKey = `${dateKey}|${hour}`;
        const isAvailable = availableCells.has(cellKey);
        const isBooked = bookedCells.has(cellKey);
        const isSelected = selectedCells.has(cellKey);
        const assignedBlockId = assignedCellMap.get(cellKey);
        const isAssigned = !!assignedBlockId;
        const isFocused = isAssigned && focusedBlockId === assignedBlockId;
        const isLast = rowIdx === HOURS.length - 1;

        const borderBase = `border-x border-t ${isLast ? "border-b" : ""}`;

        if (isBooked) {
          return (
            <div className={`w-full h-9 ${borderBase} ${cellStyles.booked} flex items-center justify-center`}>
              <span className="text-[10px] text-green-700">Booked</span>
            </div>
          );
        }

        if (isAssigned) {
          const label = assignedLabelMap.get(cellKey) ?? "";
          return (
            <button
              type="button"
              onPointerDown={(e) => { e.preventDefault(); onPointerDown(cellKey, dateKey); }}
              className={`block w-full h-9 text-[10px] ${borderBase} ${cellStyles.assigned} font-medium cursor-pointer hover:bg-blue-500 transition-colors select-none touch-none ${
                isFocused ? "ring-2 ring-inset ring-blue-700" : ""
              }`}
            >
              {label}
            </button>
          );
        }

        if (isSelected) {
          return (
            <button
              type="button"
              onPointerDown={(e) => { e.preventDefault(); onPointerDown(cellKey, dateKey); }}
              onPointerEnter={() => onPointerEnter(cellKey, dateKey)}
              className={`block w-full h-9 text-[10px] ${borderBase} ${cellStyles.selected} cursor-pointer select-none touch-none`}
            />
          );
        }

        if (isAvailable) {
          return (
            <button
              type="button"
              onPointerDown={(e) => { e.preventDefault(); onPointerDown(cellKey, dateKey); }}
              onPointerEnter={() => onPointerEnter(cellKey, dateKey)}
              className={`block w-full h-9 text-[10px] transition-colors ${borderBase} ${cellStyles.available} cursor-crosshair ${cellStyles.availableHover} select-none touch-none`}
            />
          );
        }

        return (
          <div className={`w-full h-9 ${borderBase} ${cellStyles.unavailable}`} />
        );
      }}
    />
  );
}
