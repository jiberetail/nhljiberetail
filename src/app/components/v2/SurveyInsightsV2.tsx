import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateBreakdownData, calculateQuickInsights } from "@/app/utils/dataCalculations";
import { MessageSquare, Package, Clock, MapPin, HelpCircle } from "lucide-react";

export function SurveyInsightsV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const breakdownData = calculateBreakdownData(daysInRange, isTodayView);
  const insights = calculateQuickInsights(daysInRange, isTodayView);

  return (
    <div className="space-y-3">
      <div className="relative backdrop-blur-md bg-white/60 rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-[#0076CE]" />
            <span className="text-sm font-medium text-[#1e293b]">Most Requested</span>
            <div className="group relative">
              <HelpCircle size={14} className="text-slate-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                The out-of-stock item customers asked for most frequently during the selected period.
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
          </div>
          <div className="text-base font-black text-[#1e293b] mb-1">{insights.mostUnfulfilledItem.value}</div>
          <div className="text-xs text-[#0076CE]">{insights.mostUnfulfilledItem.subtitle}</div>
        </div>
      </div>

      <div className="relative backdrop-blur-md bg-white/60 rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-[#0076CE]" />
            <span className="text-sm font-medium text-[#1e293b]">Peak Traffic</span>
            <div className="group relative">
              <HelpCircle size={14} className="text-slate-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                The time of day when the store experienced the highest survey traffic.
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
          </div>
          <div className="text-base font-black text-[#1e293b] mb-1">{insights.peakFrictionTime.value}</div>
          <div className="text-xs text-[#0076CE]">{insights.peakFrictionTime.subtitle}</div>
        </div>
      </div>

      <div className="relative backdrop-blur-md bg-white/60 rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-[#0076CE]" />
            <span className="text-sm font-medium text-[#1e293b]">Most Active Podium</span>
            <div className="group relative">
              <HelpCircle size={14} className="text-slate-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                The service counter or podium that handled the highest number of customer interactions.
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
          </div>
          <div className="text-base font-black text-[#1e293b] mb-1">{insights.mostActivePodium.value}</div>
          <div className="text-xs text-[#0076CE]">{insights.mostActivePodium.subtitle}</div>
        </div>
      </div>

      <div className="backdrop-blur-md bg-white/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-4">
          <h3 className="text-base font-bold text-[#1e293b] mb-4">Survey Details</h3>
          <div className="space-y-4">
            {breakdownData.map((issue, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{issue.label}</span>
                  <span className="text-sm font-bold text-[#1e293b]">{issue.percentage}%</span>
                </div>
                <div className="w-full bg-white/40 backdrop-blur-sm rounded-full h-2 overflow-hidden border border-white/30">
                  <div
                    className="bg-gradient-to-r from-[#374151] to-[#9CA3AF] h-full rounded-full transition-all"
                    style={{ width: `${issue.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500">{issue.count} responses</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}