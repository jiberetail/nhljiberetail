import { TrendingUp, DollarSign, Monitor, Clock } from "lucide-react";
import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateQuickInsights } from "@/app/utils/dataCalculations";

export function QuickInsights() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const insights = calculateQuickInsights(daysInRange, isTodayView);

  const insightConfig = [
    {
      title: "Most Unfulfilled Item",
      value: insights.mostUnfulfilledItem.value,
      subtitle: insights.mostUnfulfilledItem.subtitle,
      icon: TrendingUp,
      color: "text-[#009EDB]",
      valueColor: "text-[#333333]",
    },
    {
      title: "Daily Revenue Loss",
      value: insights.estimatedDailyRevenueLoss.value,
      subtitle: insights.estimatedDailyRevenueLoss.subtitle,
      icon: DollarSign,
      color: "text-[#009EDB]",
      valueColor: "text-[#333333]",
    },
    {
      title: "Most Active Podium",
      value: insights.mostActivePodium.value,
      subtitle: insights.mostActivePodium.subtitle,
      icon: Monitor,
      color: "text-[#009EDB]",
      valueColor: "text-[#333333]",
    },
    {
      title: "Peak Friction Time",
      value: insights.peakFrictionTime.value,
      subtitle: insights.peakFrictionTime.subtitle,
      icon: Clock,
      color: "text-[#009EDB]",
      valueColor: "text-[#333333]",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-black text-[#333333] mb-4">Quick Insights</h2>
      <div className="grid grid-cols-2 gap-4">
        {insightConfig.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 border-l-4 border-l-[#0076CE] shadow-md hover:shadow-xl transition-all p-3 relative overflow-hidden group"
              style={{ borderRadius: '8px' }}
            >
              <div className="flex items-start gap-2.5 relative z-10">
                <div className="p-2 group-hover:scale-110 transition-transform">
                  <Icon size={18} className={insight.color} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-[#0076CE] mb-0.5 uppercase tracking-wider">{insight.title}</p>
                  <p className="text-base font-black text-[#333333] truncate mb-0.5">{insight.value}</p>
                  <p className="text-xs text-[#333333]">{insight.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}