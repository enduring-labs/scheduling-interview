export const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8..17

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getUpcomingDays(count: number, startDate?: Date): Date[] {
  const days: Date[] = [];
  const base = startDate ?? new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    days.push(d);
  }
  return days;
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatHour(h: number): string {
  if (h === 0 || h === 12) return `12 ${h === 0 ? "AM" : "PM"}`;
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}
