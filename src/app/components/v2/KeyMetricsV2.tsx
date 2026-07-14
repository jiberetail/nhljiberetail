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
      <div className="relative backdrop-blur-md bg-white/60 rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={16} className="text-[#0076CE]" />
            <span className="text-sm font-medium text-[#1e293b]">Total ROI</span>
            <div className="group relative">
              <HelpCircle size={14} className="text-slate-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                Total online revenue attributed to survey QR code redirects for the selected period.
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
          </div>
          <div className="text-base font-black text-[#16a34a] mb-1">${totalROI.toLocaleString()}</div>
          <div className="text-xs text-[#0076CE]">Online conversions from survey redirects</div>
        </div>
      </div>

      {/* Survey Details */}
      <div className="relative backdrop-blur-md bg-white/60 rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList size={16} className="text-[#0076CE]" />
            <span className="text-sm font-medium text-[#1e293b]">Survey Outcomes</span>
            <div className="group relative">
              <HelpCircle size={14} className="text-slate-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                Completion rate and average time spent on the customer survey.
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
          </div>
          <div className="text-base font-black text-[#1e293b] mb-1">58% Completion</div>
          <div className="text-xs text-[#0076CE]">Avg time 2m 14s · 3 drop-off screens</div>
        </div>
      </div>
    </div>
  );
}
