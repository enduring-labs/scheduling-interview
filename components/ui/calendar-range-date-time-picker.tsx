"use client";

import * as React from "react";
import { Clock2Icon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export interface DateTimeRange {
  from?: Date;
  to?: Date;
  startTime?: string;
  endTime?: string;
}

export function CalendarRangeDateTimePicker() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const [times, setTimes] = React.useState({
    startTime: "10:30:00",
    endTime: "12:30:00",
  });

  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange);
  };

  const handleTimeChange = (field: "startTime" | "endTime", value: string) => {
    setTimes((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card size="sm" className="mx-auto w-fit">
      <CardContent>
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleDateRangeChange}
          numberOfMonths={2}
          className="p-0"
        />
      </CardContent>
      <CardFooter className="border-t bg-card">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="start-time">Start Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="start-time"
                type="time"
                step="1"
                value={times.startTime}
                onChange={(e) => handleTimeChange("startTime", e.target.value)}
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="end-time">End Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="end-time"
                type="time"
                step="1"
                value={times.endTime}
                onChange={(e) => handleTimeChange("endTime", e.target.value)}
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  );
}
