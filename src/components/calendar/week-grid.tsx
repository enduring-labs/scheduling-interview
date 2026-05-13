import { HOURS, DAY_LABELS, formatDateKey, formatHour } from "@/lib/calendar";

interface WeekGridProps {
  days: Date[];
  cellHeight: string;
  labelWidth: string;
  textSize?: string;
  renderCell: (dateKey: string, hour: number, rowIdx: number) => React.ReactNode;
}

export function WeekGrid({
  days,
  cellHeight,
  labelWidth,
  textSize = "text-xs",
  renderCell,
}: WeekGridProps) {
  return (
    <div className="overflow-x-auto">
      <div
        className={`grid ${textSize}`}
        style={{
          gridTemplateColumns: `${labelWidth} repeat(${days.length}, 1fr)`,
        }}
      >
        {/* Header row */}
        <div />
        {days.map((d) => (
          <div
            key={formatDateKey(d)}
            className="px-1 pb-1 text-center font-medium text-gray-600"
          >
            <div>{DAY_LABELS[d.getDay()]}</div>
            <div className="text-[10px] text-gray-400">
              {d.getMonth() + 1}/{d.getDate()}
            </div>
          </div>
        ))}

        {/* Hour rows */}
        {HOURS.map((h, rowIdx) => (
          <div key={`row-${h}`} className="contents">
            <div
              className={`flex items-center justify-end pr-2 text-gray-400 whitespace-nowrap ${cellHeight}`}
            >
              {formatHour(h)}
            </div>
            {days.map((d) => {
              const dateKey = formatDateKey(d);
              return (
                <div key={`${dateKey}|${h}`} className="px-0.5">
                  {renderCell(dateKey, h, rowIdx)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
