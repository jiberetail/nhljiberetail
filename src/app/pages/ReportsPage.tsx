import { Calendar as CalendarComponent } from "@/app/components/ui/calendar";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ExecutiveReport } from "@/app/components/ExecutiveReport";
import { OutOfStockReport } from "@/app/components/OutOfStockReport";
import { AbandonedSurveyReport } from "@/app/components/AbandonedSurveyReport";
import { PodiumActivityReport } from "@/app/components/PodiumActivityReport";
import { StaffSatisfactionReport } from "@/app/components/StaffSatisfactionReport";
import { ROIReport } from "@/app/components/ROIReport";
import { Calendar, ChevronDown, Download, Eye, FileText, Package, UserX, Monitor, Star, TrendingUp } from "lucide-react";
import { format, startOfDay, endOfDay, subDays } from "date-fns";

type DateRange = {
  from: Date;
  to: Date;
};

type PresetOption = {
  label: string;
  getValue: () => DateRange;
};

const presetOptions: PresetOption[] = [
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

const reports = [
  {
    id: "executive",
    title: "Executive Report",
    description: "Comprehensive overview of store performance, KPIs, and key insights",
    icon: FileText,
    color: "from-[#041e42] to-[#0a2f5f]",
  },
  {
    id: "roi",
    title: "ROI Report",
    description: "Full survey QR code conversion analysis — by category, team, time, and customer segment",
    icon: TrendingUp,
    color: "from-green-700 to-green-800",
  },
  {
    id: "outofstock",
    title: "Missing Merchandise Report",
    description: "Detailed analysis of missing merchandise and revenue impact",
    icon: Package,
    color: "from-[#BC0022] to-[#d4002a]",
  },
  {
    id: "abandoned",
    title: "Abandoned Survey Report",
    description: "Track incomplete surveys and identify potential friction points",
    icon: UserX,
    color: "from-orange-600 to-orange-700",
  },
  {
    id: "podium",
    title: "Podium Activity Report",
    description: "Customer interactions and engagement at each store podium",
    icon: Monitor,
    color: "from-purple-600 to-purple-700",
  },
  {
    id: "satisfaction",
    title: "Staff Satisfaction Report",
    description: "Customer ratings and feedback on staff performance",
    icon: Star,
    color: "from-green-600 to-green-700",
  },
];

export function ReportsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("Last 30 Days");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>(presetOptions[3].getValue());
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const handleDownload = (reportId: string) => {
    // For implemented reports, show the report briefly in the background and trigger download
    if (reportId === 'executive' || reportId === 'outofstock' || reportId === 'abandoned' || reportId === 'podium' || reportId === 'satisfaction' || reportId === 'roi') {
      // Set downloading state to render report in background
      setDownloadingReport(reportId);

      // Wait for it to render, then trigger download
      setTimeout(() => {
        const downloadButton = document.querySelector('[data-report-download]') as HTMLButtonElement;
        if (downloadButton) {
          downloadButton.click();
        }
        // Clear downloading state after download completes
        setTimeout(() => {
          setDownloadingReport(null);
        }, 1000);
      }, 100);
    } else {
      // Placeholder for other reports
      alert(`${reportId} report download will be implemented soon.`);
    }
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`);
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-[900px]">
        {/* Header */}
        <div className="pt-2 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#333333]">Reports</h1>
            <p className="text-sm text-[#333333] mt-1.5 font-medium">
              Generate and download detailed reports for the NHL Shop NYC store
            </p>
          </div>

          {/* Date Range Picker */}
          <div className="relative" ref={dropdownRef}>
            <div className="bg-gradient-to-r from-[#111827]/30 to-[#6B7280]/30 rounded-lg p-[1px] shadow-sm">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg transition-colors bg-white hover:bg-gray-50"
              >
                <Calendar size={16} className="text-gray-600" />
                <span className="text-gray-700 font-bold">{displayText}</span>
                <ChevronDown size={16} className="text-gray-600" />
              </button>
            </div>

            {isOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-50 min-w-[280px]">
                <div className="p-2">
                  {/* Preset Options */}
                  <div className="space-y-1 mb-2">
                    {presetOptions.map((option) => (
                      <button
                        key={option.label}
                        onClick={() => handlePresetClick(option.label)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors font-semibold ${
                          selectedPreset === option.label && !isCustomMode
                            ? "bg-[#009EDB] text-white"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Date Range Separator */}
                  <div className="border-t border-gray-200 my-2"></div>

                  {/* Custom Date Range Label */}
                  <div className="px-3 py-2 text-xs font-black text-gray-500 uppercase tracking-wide">
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
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 gap-4">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                className="bg-gradient-to-r from-[#111827]/30 to-[#6B7280]/30 rounded-xl p-[1px] shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Icon */}
                      <div className="group-hover:scale-110 transition-transform">
                        <Icon size={24} className="text-[#333333]" strokeWidth={2.5} />
                      </div>

                      {/* Report Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-[#333333] mb-1">{report.title}</h3>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-[#111827]/30 to-[#6B7280]/30 rounded-lg p-[1px] shadow-sm">
                        <button
                          onClick={() => handleViewReport(report.id)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#333333] rounded-lg hover:bg-gray-50 transition-all font-bold text-sm"
                        >
                          <Eye size={16} strokeWidth={2.5} />
                          <span>View</span>
                        </button>
                      </div>
                      <button
                        onClick={() => handleDownload(report.id)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#333333] text-white rounded-lg hover:bg-[#1a1a1a] transition-all shadow-md hover:shadow-lg font-bold text-sm"
                      >
                        <Download size={16} strokeWidth={2.5} />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hidden Reports for Direct Download */}
        {downloadingReport && (
          <div style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: -1
          }}>
            {downloadingReport === "executive" && (
              <ExecutiveReport dateRange={dateRange} onClose={() => {}} isModal={true} />
            )}
            {downloadingReport === "outofstock" && (
              <OutOfStockReport dateRange={dateRange} onClose={() => {}} isModal={true} />
            )}
            {downloadingReport === "abandoned" && (
              <AbandonedSurveyReport dateRange={dateRange} onClose={() => {}} isModal={true} />
            )}
            {downloadingReport === "podium" && (
              <PodiumActivityReport dateRange={dateRange} onClose={() => {}} isModal={true} />
            )}
            {downloadingReport === "satisfaction" && (
              <StaffSatisfactionReport dateRange={dateRange} onClose={() => {}} isModal={true} />
            )}
            {downloadingReport === "roi" && (
              <ROIReport dateRange={dateRange} onClose={() => {}} isModal={true} />
            )}
          </div>
        )}
      </div>
    </main>
  );
}