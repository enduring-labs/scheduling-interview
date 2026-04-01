"use client";

import * as React from "react";
import type { InferSelectModel } from "drizzle-orm";
import { workOrders } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { CalendarRangeDateTimePicker } from "@/components/ui/calendar-range-date-time-picker";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { type DateRange } from "react-day-picker";

type WorkOrder = InferSelectModel<typeof workOrders>;

export interface AvailabilitySlot {
  id: string;
  from: Date;
  to: Date;
  startTime: string;
  endTime: string;
}

export function TenantWorkOrderCard({ workOrder: wo }: { workOrder: WorkOrder }) {
  const [showPicker, setShowPicker] = React.useState(false);
  const [availabilitySlots, setAvailabilitySlots] = React.useState<AvailabilitySlot[]>([]);
  const [tempDateRange, setTempDateRange] = React.useState<DateRange | undefined>();
  const [tempTimes, setTempTimes] = React.useState({
    startTime: "10:30:00",
    endTime: "12:30:00",
  });

  const handleAddAvailability = () => {
    setShowPicker(true);
    setTempDateRange(undefined);
    setTempTimes({ startTime: "10:30:00", endTime: "12:30:00" });
  };

  const handleSaveAvailability = () => {
    if (tempDateRange?.from && tempDateRange?.to) {
      const newSlot: AvailabilitySlot = {
        id: `slot-${Date.now()}`,
        from: tempDateRange.from,
        to: tempDateRange.to,
        startTime: tempTimes.startTime,
        endTime: tempTimes.endTime,
      };
      setAvailabilitySlots([...availabilitySlots, newSlot]);
      setShowPicker(false);
    }
  };

  const handleRemoveAvailability = (id: string) => {
    setAvailabilitySlots(availabilitySlots.filter((slot) => slot.id !== id));
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium">{wo.title}</p>
          <p className="mt-1 text-sm text-gray-500">
            {wo.propertyAddress}
            {wo.unitNumber ? ` #${wo.unitNumber}` : ""}
          </p>
          {wo.description && (
            <p className="mt-2 text-sm text-gray-600">{wo.description}</p>
          )}
        </div>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase">
          {wo.status}
        </span>
      </div>

      {/* Availability Section */}
      <div className="mt-6 border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <p className="font-medium">Your Availability</p>
          <Button size="sm" onClick={handleAddAvailability}>
            Add Availability
          </Button>
        </div>

        {/* Calendar Picker Modal */}
        {showPicker && (
          <Card className="mb-4 border-blue-200 bg-blue-50 p-4">
            <CardContent className="p-0 mb-4">
              <PickerContent
                tempDateRange={tempDateRange}
                setTempDateRange={setTempDateRange}
                tempTimes={tempTimes}
                setTempTimes={setTempTimes}
              />
            </CardContent>
            <CardFooter className="flex gap-2 justify-end p-0">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveAvailability}>
                Save Availability
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Availability List */}
        <div className="space-y-2">
          {availabilitySlots.length === 0 ? (
            <p className="text-sm text-gray-500">No availability added yet</p>
          ) : (
            availabilitySlots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <div className="text-sm">
                  <p className="font-medium">
                    {slot.from.toLocaleDateString()} - {slot.to.toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    {slot.startTime} - {slot.endTime}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAvailability(slot.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function PickerContent({
  tempDateRange,
  setTempDateRange,
  tempTimes,
  setTempTimes,
}: {
  tempDateRange: DateRange | undefined;
  setTempDateRange: (range: DateRange | undefined) => void;
  tempTimes: { startTime: string; endTime: string };
  setTempTimes: (times: { startTime: string; endTime: string }) => void;
}) {
  return (
    <div className="space-y-4">
      <CalendarRangeDateTimePickerContent
        dateRange={tempDateRange}
        onDateRangeChange={setTempDateRange}
        times={tempTimes}
        onTimesChange={setTempTimes}
      />
    </div>
  );
}

function CalendarRangeDateTimePickerContent({
  dateRange,
  onDateRangeChange,
  times,
  onTimesChange,
}: {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  times: { startTime: string; endTime: string };
  onTimesChange: (times: { startTime: string; endTime: string }) => void;
}) {
  const { CalendarRangeDateTimePicker } = require("@/components/ui/calendar-range-date-time-picker");
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        {/* Inline calendar picker logic */}
        <CalendarInlineContent
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          times={times}
          onTimesChange={onTimesChange}
        />
      </div>
    </div>
  );
}

function CalendarInlineContent({
  dateRange,
  onDateRangeChange,
  times,
  onTimesChange,
}: {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  times: { startTime: string; endTime: string };
  onTimesChange: (times: { startTime: string; endTime: string }) => void;
}) {
  const { Calendar } = require("@/components/ui/calendar");
  const { Clock2Icon } = require("lucide-react");
  const { InputGroup, InputGroupAddon, InputGroupInput } = require("@/components/ui/input-group");
  const { Field, FieldGroup, FieldLabel } = require("@/components/ui/field");

  return (
    <div className="flex flex-col gap-4 items-center">
      <Calendar
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={onDateRangeChange}
        numberOfMonths={2}
      />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="start-time-inline">Start Time</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="start-time-inline"
              type="time"
              step="1"
              value={times.startTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTimesChange({ ...times, startTime: e.target.value })}
              className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
            />
            <InputGroupAddon>
              <Clock2Icon className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="end-time-inline">End Time</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="end-time-inline"
              type="time"
              step="1"
              value={times.endTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTimesChange({ ...times, endTime: e.target.value })}
              className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
            />
            <InputGroupAddon>
              <Clock2Icon className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>
    </div>
  );
}
