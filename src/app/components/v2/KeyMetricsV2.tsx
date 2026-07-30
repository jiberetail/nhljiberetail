import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateKPIData, ROI_REDIRECT_RATE, ROI_CONVERSION_RATE, ROI_AVG_ORDER_VALUE } from "@/app/utils/dataCalculations";
import { DollarSign, ClipboardList, HelpCircle } from "lucide-react";

export function KeyMetricsV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const calculatedData = calculateKPIData(daysInRange, isTodayView);

  const totalRedirects = Math.round(calculatedData.totalSurveys * ROI_REDIRECT_RATE);
  const totalConversions = Math.round(totalRedirects * ROI_CONVERSION_RATE);
  const totalROI = totalConversions * ROI_AVG_ORDER_VALUE;

  return (
    <div className="space-y-3">
      {/* Total ROI */}
      <section className="nhl-card nhl-secondary-panel relative overflow-hidden">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={16} className="text-[#e2c36b]" />
            <span className="nhl-panel-title text-sm font-medium">Total ROI</span>
            <div className="group relative">
              <HelpCircle size={14} className="text-slate-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                Total online revenue attributed to survey QR code redirects for the selected period.
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
          </div>
          <div className="nhl-gold-value text-base font-black mb-1">${totalROI.toLocaleString()}</div>
          <div className="nhl-blue-copy text-xs">Online conversions from survey redirects</div>
        </div>
      </section>

      {/* Survey Details */}
      <section className="nhl-card nhl-secondary-panel relative overflow-hidden">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList size={16} className="text-[#e2c36b]" />
            <span className="nhl-panel-title text-sm font-medium">Survey Outcomes</span>
            <div className="group relative">
              <HelpCircle size={14} className="text-slate-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                Completion rate and average time spent on the customer survey.
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
          </div>
          <div className="nhl-gold-value text-base font-black mb-1">58% Completion</div>
          <div className="nhl-blue-copy text-xs">Avg time 2m 14s · 3 drop-off screens</div>
        </div>
      </section>
    </div>
  );
}
