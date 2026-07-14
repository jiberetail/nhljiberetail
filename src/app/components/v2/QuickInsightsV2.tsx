import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateQuickInsights } from "@/app/utils/dataCalculations";
import { AlertCircle, DollarSign, Users, TrendingUp, Clock, ShoppingBag, Star } from "lucide-react";

export function QuickInsightsV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const insights = calculateQuickInsights(daysInRange, isTodayView);

  const insightCards = [
    {
      icon: ShoppingBag,
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      title: "Top Missing Item",
      value: insights.mostUnfulfilledItem.value,
      subtitle: insights.mostUnfulfilledItem.subtitle,
    },
    {
      icon: DollarSign,
      iconBg: "bg-gradient-to-br from-red-500 to-red-600",
      title: "Daily Revenue Loss",
      value: insights.estimatedDailyRevenueLoss.value,
      subtitle: "Estimated impact",
    },
    {
      icon: Star,
      iconBg: "bg-gradient-to-br from-yellow-500 to-orange-500",
      title: "Staff Performance",
      value: insights.mostActivePodium.value,
      subtitle: "Satisfaction rating",
    },
    {
      icon: Clock,
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      title: "Peak Friction Time",
      value: insights.peakFrictionTime.value,
      subtitle: insights.peakFrictionTime.subtitle,
    },
  ];

  // Weekly activity chart data (mock)
  const weeklyData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 45 },
    { day: 'Wed', value: 80 },
    { day: 'Thu', value: 55 },
    { day: 'Fri', value: 90 },
    { day: 'Sat', value: 75 },
    { day: 'Sun', value: 85 },
  ];

  const maxValue = Math.max(...weeklyData.map(d => d.value));

  return (
    <div className="space-y-6">
      {/* Quick Insights Header */}
      <div className="bg-[#252f3f] rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Quick Insights</h2>
            <p className="text-sm text-gray-400 mt-1">Key metrics at a glance</p>
          </div>
        </div>

        <div className="space-y-4">
          {insightCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-[#1a2332] rounded-lg p-4 border border-gray-700/30">
                <div className="flex items-start gap-3">
                  <div className={`${card.iconBg} p-2.5 rounded-lg flex-shrink-0`}>
                    <Icon size={18} className="text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-400 mb-1">
                      {card.title}
                    </div>
                    <div className="text-base font-bold text-white mb-1">
                      {card.value}
                    </div>
                    <div className="text-xs text-gray-500">
                      {card.subtitle}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-[#252f3f] rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-sm font-bold text-white mb-4">Weekly Activity</h3>

        <div className="space-y-3">
          {weeklyData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="text-xs font-medium text-gray-400 w-8">
                {item.day}
              </div>
              <div className="flex-1 bg-[#1a2332] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs font-bold text-white w-8 text-right">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hot Alert */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 border border-red-400/20">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <AlertCircle size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">🔥 Hot Alert</h3>
            <p className="text-sm text-red-50">
              Rangers jerseys size L missing 23 times this week
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
