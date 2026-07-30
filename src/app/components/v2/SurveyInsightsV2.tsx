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
      <section className="nhl-card nhl-secondary-panel relative overflow-hidden">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-[#e2c36b]" />
            <span className="nhl-panel-title text-sm font-medium">Most Requested</span>
            <div className="group relative">
              <HelpCircle size={14} className="text-slate-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                The out-of-stock item customers asked for most frequently during the selected period.
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
          </div>
          <div className="nhl-gold-value text-base font-black mb-1">{insights.mostUnfulfilledItem.value}</div>
          <div className="nhl-blue-copy text-xs">{insights.mostUnfulfilledItem.subtitle}</div>
        </div>
      </section>

      <section className="nhl-card nhl-secondary-panel relative overflow-hidden">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-[#e2c36b]" />
            <span className="nhl-panel-title text-sm font-medium">Peak Traffic</span>
            <div className="group relative">
              <HelpCircle size={14} className="text-slate-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                The time of day when the store experienced the highest survey traffic.
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
          </div>
          <div className="nhl-gold-value text-base font-black mb-1">{insights.peakFrictionTime.value}</div>
          <div className="nhl-blue-copy text-xs">{insights.peakFrictionTime.subtitle}</div>
        </div>
      </section>

      <section className="nhl-card nhl-secondary-panel relative overflow-hidden">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-[#e2c36b]" />
            <span className="nhl-panel-title text-sm font-medium">Most Active Kiosk</span>
            <div className="group relative">
              <HelpCircle size={14} className="text-slate-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                The kiosk that handled the highest number of customer interactions.
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
          </div>
          <div className="nhl-gold-value text-base font-black mb-1">{insights.mostActivePodium.value}</div>
          <div className="nhl-blue-copy text-xs">{insights.mostActivePodium.subtitle}</div>
        </div>
      </section>

      <section className="nhl-card nhl-secondary-panel overflow-hidden">
        <div className="px-5 py-4">
          <h3 className="nhl-panel-title text-base font-bold mb-4">Survey Details</h3>
          <div className="space-y-4">
            {breakdownData.map((issue, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="nhl-panel-copy text-sm">{issue.label}</span>
                  <span className="nhl-gold-value text-sm font-bold">{issue.percentage}%</span>
                </div>
                <div className="w-full bg-black/50 backdrop-blur-sm rounded-full h-2 overflow-hidden border border-[#4c8bb4]/45">
                  <div
                    className="bg-gradient-to-r from-[#e2c36b] to-[#2385bd] h-full rounded-full transition-all"
                    style={{ width: `${issue.percentage}%` }}
                  ></div>
                </div>
                <div className="nhl-blue-copy text-xs">{issue.count} responses</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
