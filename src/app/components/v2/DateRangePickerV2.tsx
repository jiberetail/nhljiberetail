import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Calendar as CalendarComponent } from "@/app/components/ui/calendar";
import { useDateRange } from "@/app/contexts/DateRangeContext";

type DateRange = {
  from: Date;
  to: Date;
};

type PresetOption = {
  label: string;
  getValue: () => DateRange;
};

const presetOptions = [
  {
    label: "Today",
    getValue: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Yesterday",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 1)),
      to: endOfDay(subDays(new Date(), 1)),
    }),
  },
  {
    label: "Last 7 Days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 30 Days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    }),
  },
];

export function DateRangePickerV2() {
  const { setDateRange } = useDateRange();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("Last 30 Days");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [isCustomMode, setIsCustomMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handlePresetClick = (label: string) => {
    setSelectedPreset(label);
    setIsCustomMode(false);
    const preset = presetOptions.find(opt => opt.label === label);
    if (preset) {
      setDateRange(preset.getValue());
    }
    setIsOpen(false);
  };

  const handleCustomDateSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setCustomRange(range);
      setIsCustomMode(true);
      setSelectedPreset("Custom Range");
      setDateRange(range);
      setIsOpen(false);
    } else {
      setCustomRange(range);
    }
  };

  const displayText = isCustomMode && customRange?.from && customRange?.to
    ? `${format(customRange.from, "MMM d")} - ${format(customRange.to, "MMM d, yyyy")}`
    : selectedPreset;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#1a2332] border border-gray-700/50 rounded-lg text-sm font-medium text-white hover:bg-[#252f3f] transition-colors"
      >
        <Calendar size={16} />
        <span>{displayText}</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-[#252f3f] rounded-lg shadow-xl border border-gray-700/50 z-50 min-w-[280px]">
          <div className="p-2">
            {/* Preset Options */}
            <div className="space-y-1 mb-2">
              {presetOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handlePresetClick(option.label)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    selectedPreset === option.label && !isCustomMode
                      ? "bg-blue-500 text-white font-medium"
                      : "hover:bg-[#1a2332] text-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Custom Date Range Separator */}
            <div className="border-t border-gray-700/50 my-2"></div>

            {/* Custom Date Range Label */}
            <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase">
              Custom Range
            </div>

            {/* Calendar */}
            <div className="px-2">
              <CalendarComponent
                mode="range"
                selected={customRange}
                onSelect={handleCustomDateSelect}
                numberOfMonths={1}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
