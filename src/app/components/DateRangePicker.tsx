import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, addMonths, subMonths, isAfter, isBefore } from "date-fns";
import { useDateRange } from "@/app/contexts/DateRangeContext";

type DateRange = { from: Date; to: Date };

const PRESETS = [
  { label: "Today", getValue: (): DateRange => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
  { label: "Yesterday", getValue: (): DateRange => ({ from: startOfDay(subDays(new Date(), 1)), to: endOfDay(subDays(new Date(), 1)) }) },
  { label: "Last 7 Days", getValue: (): DateRange => ({ from: startOfDay(subDays(new Date(), 6)), to: endOfDay(new Date()) }) },
  { label: "Last 30 Days", getValue: (): DateRange => ({ from: startOfDay(subDays(new Date(), 29)), to: endOfDay(new Date()) }) },
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function MiniCalendar({
  month,
  onMonthChange,
  selecting,
  onDateClick,
  hoverDate,
  onDateHover,
  confirmedRange,
}: {
  month: Date;
  onMonthChange: (d: Date) => void;
  selecting: { from: Date | null; to: Date | null };
  onDateClick: (d: Date) => void;
  hoverDate: Date | null;
  onDateHover: (d: Date | null) => void;
  confirmedRange: DateRange;
}) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  const startPad = start.getDay();

  const getPreviewRange = (): { from: Date; to: Date } | null => {
    if (selecting.from && !selecting.to && hoverDate) {
      const a = selecting.from;
      const b = hoverDate;
      return isAfter(b, a) ? { from: a, to: b } : { from: b, to: a };
    }
    if (selecting.from && selecting.to) {
      return { from: selecting.from, to: selecting.to };
    }
    return null;
  };

  const preview = getPreviewRange();

  const isRangeStart = (d: Date) => {
    if (preview) return isSameDay(d, preview.from);
    return isSameDay(d, confirmedRange.from);
  };
  const isRangeEnd = (d: Date) => {
    if (preview) return isSameDay(d, preview.to);
    return isSameDay(d, confirmedRange.to);
  };
  const isInRange = (d: Date) => {
    const range = preview ?? confirmedRange;
    return isWithinInterval(d, { start: range.from, end: range.to });
  };
  const isToday = (d: Date) => isSameDay(d, new Date());

  return (
    <div className="select-none">
      {/* Month Nav */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={() => onMonthChange(subMonths(month, 1))}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        <span className="text-sm font-bold text-gray-800">{format(month, "MMMM yyyy")}</span>
        <button
          onClick={() => onMonthChange(addMonths(month, 1))}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7">
        {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
        {days.map((day) => {
          const start_ = isRangeStart(day);
          const end_ = isRangeEnd(day);
          const inRange = isInRange(day);
          const today = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`relative flex items-center justify-center h-8 cursor-pointer
                ${inRange && !start_ && !end_ ? "bg-gray-100" : ""}
                ${start_ ? "bg-gray-100 rounded-l-full" : ""}
                ${end_ ? "bg-gray-100 rounded-r-full" : ""}
                ${start_ && end_ ? "rounded-full" : ""}
              `}
              onClick={() => onDateClick(day)}
              onMouseEnter={() => onDateHover(day)}
              onMouseLeave={() => onDateHover(null)}
            >
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors z-10
                  ${start_ || end_ ? "bg-[#111827] text-white font-bold" : ""}
                  ${!start_ && !end_ && inRange ? "text-gray-800" : ""}
                  ${!start_ && !end_ && !inRange ? "text-gray-700 hover:bg-gray-200" : ""}
                  ${today && !start_ && !end_ ? "ring-1 ring-[#111827]" : ""}
                `}
              >
                {format(day, "d")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePicker() {
  const { dateRange, setDateRange } = useDateRange();
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState("Last 30 Days");
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [selecting, setSelecting] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSelecting({ from: null, to: null });
      }
    }
    if (isOpen) document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setSelecting({ from: null, to: null });
    setMonth(startOfMonth(dateRange.from));
  };

  const handlePreset = (preset: typeof PRESETS[0]) => {
    const range = preset.getValue();
    setDateRange(range);
    setActivePreset(preset.label);
    setSelecting({ from: null, to: null });
    setIsOpen(false);
  };

  const handleDateClick = (day: Date) => {
    if (!selecting.from || (selecting.from && selecting.to)) {
      // Start new selection
      setSelecting({ from: startOfDay(day), to: null });
      setActivePreset("Custom Range");
    } else {
      // Second click — set end
      const from = selecting.from;
      const to = startOfDay(day);
      if (isBefore(to, from)) {
        setSelecting({ from: to, to: from });
      } else {
        setSelecting({ from, to });
      }
    }
  };

  const handleConfirm = () => {
    if (selecting.from && selecting.to) {
      setDateRange({ from: selecting.from, to: endOfDay(selecting.to) });
    } else if (selecting.from) {
      // Single day selected
      setDateRange({ from: selecting.from, to: endOfDay(selecting.from) });
    }
    setIsOpen(false);
    setSelecting({ from: null, to: null });
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSelecting({ from: null, to: null });
    setActivePreset(
      PRESETS.find(p => {
        const r = p.getValue();
        return isSameDay(r.from, dateRange.from) && isSameDay(r.to, dateRange.to);
      })?.label ?? "Custom Range"
    );
  };

  const displayLabel = (() => {
    const matched = PRESETS.find(p => {
      const r = p.getValue();
      return isSameDay(r.from, dateRange.from) && isSameDay(r.to, dateRange.to);
    });
    if (matched) return matched.label;
    if (isSameDay(dateRange.from, dateRange.to)) {
      return format(dateRange.from, "MMM d, yyyy");
    }
    return `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d, yyyy")}`;
  })();

  const pendingRange: DateRange = selecting.from && selecting.to
    ? { from: selecting.from, to: selecting.to }
    : dateRange;

  const canConfirm = !!selecting.from;
  const selectionPhase = !selecting.from ? "idle" : !selecting.to ? "picking-end" : "complete";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <div className="bg-gradient-to-r from-[#111827]/30 to-[#6B7280]/30 rounded-lg p-[1px]">
        <button
          onClick={handleOpen}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Calendar size={16} className="text-gray-700" />
          <span className="text-gray-700 font-medium whitespace-nowrap">{displayLabel}</span>
          <ChevronDown size={16} className={`text-gray-700 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex overflow-hidden" style={{ minWidth: 340 }}>
          {/* Presets sidebar */}
          <div className="w-36 border-r border-gray-100 py-3 flex flex-col gap-0.5 px-2 bg-gray-50/60">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">Quick Select</p>
            {PRESETS.map((preset) => {
              const isActive = activePreset === preset.label && !selecting.from;
              return (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset)}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? "bg-[#111827] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Calendar + footer */}
          <div className="flex flex-col">
            {/* Hint */}
            <div className="px-4 pt-3 pb-1">
              <p className="text-[10px] text-gray-400 font-medium">
                {selectionPhase === "idle" && "Click a start date"}
                {selectionPhase === "picking-end" && (
                  <span className="text-[#111827] font-bold">
                    Start: {format(selecting.from!, "MMM d")} — now click an end date
                  </span>
                )}
                {selectionPhase === "complete" && (
                  <span className="text-[#111827] font-bold">
                    {format(selecting.from!, "MMM d")} – {format(selecting.to!, "MMM d, yyyy")}
                  </span>
                )}
              </p>
            </div>

            {/* Calendar */}
            <div className="px-4 py-2">
              <MiniCalendar
                month={month}
                onMonthChange={setMonth}
                selecting={selecting}
                onDateClick={handleDateClick}
                hoverDate={hoverDate}
                onDateHover={setHoverDate}
                confirmedRange={pendingRange}
              />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-1.5 text-xs font-semibold text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  canConfirm
                    ? "bg-[#111827] text-white hover:bg-[#1f2937] shadow-sm"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Check size={12} />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
