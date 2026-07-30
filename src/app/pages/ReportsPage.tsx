import { Calendar as CalendarComponent } from "@/app/components/ui/calendar";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ExecutiveReport } from "@/app/components/ExecutiveReport";
import { OutOfStockReport } from "@/app/components/OutOfStockReport";
import { AbandonedSurveyReport } from "@/app/components/AbandonedSurveyReport";
import { PodiumActivityReport } from "@/app/components/PodiumActivityReport";
import { StaffSatisfactionReport } from "@/app/components/StaffSatisfactionReport";
import { ROIReport } from "@/app/components/ROIReport";
import { NhlPageShell } from "@/app/components/NhlPageShell";
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
  },
  {
    id: "roi",
    title: "ROI Report",
    description: "Full survey QR code conversion analysis — by category, team, time, and customer segment",
    icon: TrendingUp,
  },
  {
    id: "outofstock",
    title: "Missing Merchandise Report",
    description: "Detailed analysis of missing merchandise and revenue impact",
    icon: Package,
  },
  {
    id: "abandoned",
    title: "Abandoned Survey Report",
    description: "Track incomplete surveys and identify potential friction points",
    icon: UserX,
  },
  {
    id: "podium",
    title: "Kiosk Activity Report",
    description: "Customer interactions and engagement at each store kiosk",
    icon: Monitor,
  },
  {
    id: "satisfaction",
    title: "Staff Satisfaction Report",
    description: "Customer ratings and feedback on staff performance",
    icon: Star,
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
    <NhlPageShell>
      <div className="max-w-[1600px] px-6 py-6">
        {/* Header */}
        <div className="nhl-panel nhl-primary-panel mb-5 flex items-center justify-between gap-6 px-5 py-4">
          <div>
            <h1 className="nhl-panel-title text-2xl font-black">Reports</h1>
            <p className="nhl-panel-copy mt-1 text-sm font-semibold">
              Generate and download detailed reports for the NHL Shop NYC store
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Date Range Picker */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg border border-[#e2c36b]/70 bg-[#07111b]/90 hover:bg-[#102b40] transition-colors shadow-xl"
              >
                <Calendar size={16} className="text-[#e2c36b]" />
                <span className="text-white font-bold">{displayText}</span>
                <ChevronDown size={16} className="text-[#e2c36b]" />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border-2 border-[#e2c36b] z-50 min-w-[280px]">
                  <div className="p-2">
                    {/* Preset Options */}
                    <div className="space-y-1 mb-2">
                      {presetOptions.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => handlePresetClick(option.label)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors font-semibold ${
                            selectedPreset === option.label && !isCustomMode
                              ? "bg-[#167cb4] text-white"
                              : "hover:bg-sky-50 text-gray-700"
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
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                className="nhl-card nhl-secondary-panel relative overflow-hidden rounded-lg shadow-2xl transition-all duration-300 group hover:-translate-y-0.5"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#738997] via-[#c7d2d9] to-[#42769a]" />
                <div className="p-5 min-h-[184px] flex flex-col justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Icon */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-md border border-[#e2c36b]/70 bg-black/35 group-hover:bg-[#167cb4]/25 transition-colors flex-shrink-0">
                        <Icon size={24} className="text-[#e2c36b]" strokeWidth={2.5} />
                      </div>

                      {/* Report Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-white mb-1">{report.title}</h3>
                        <p className="nhl-panel-copy text-sm leading-relaxed">{report.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 mt-5">
                    <button
                      onClick={() => handleViewReport(report.id)}
                      className="flex items-center gap-2 px-4 py-2.5 border border-[#e2c36b]/80 bg-black/30 text-[#f4dc91] rounded-lg hover:bg-[#e2c36b] hover:text-[#07111b] transition-all font-bold text-sm"
                    >
                      <Eye size={16} strokeWidth={2.5} />
                      <span>View</span>
                    </button>
                    <button
                        onClick={() => handleDownload(report.id)}
                      className="nhl-action flex items-center gap-2 px-4 py-2.5 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-bold text-sm"
                    >
                      <Download size={16} strokeWidth={2.5} />
                      <span>Download</span>
                    </button>
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
    </NhlPageShell>
  );
}
