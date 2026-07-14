import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateQuickInsights } from "@/app/utils/dataCalculations";
import { X, Plus, Star } from "lucide-react";

export function TrackingCardsV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const insights = calculateQuickInsights(daysInRange, isTodayView);

  const trackingItems = [
    {
      title: "Medication",
      subtitle: "100 mg / AID",
      date: "Sun 29",
      color: "from-gray-100 to-gray-200",
      dotColors: ['#f97316', '#fb923c', '#fdba74'],
      hasHeart: true,
    },
    {
      title: "Stress Levels",
      subtitle: "10% Fri AID",
      date: "Mon 30",
      color: "from-gray-100 to-gray-200",
      dotColors: ['#f97316', '#fb923c', '#fdba74'],
      hasPlus: true,
    },
    {
      title: "Fitness Goals",
      subtitle: insights.mostActivePodium.value,
      date: "Tue 31",
      color: "from-gray-100 to-gray-200",
      dotColors: ['#f97316', '#fb923c', '#fdba74', '#fbbf24'],
      hasPlus: true,
    },
    {
      title: "Vaccination",
      subtitle: "Not Finished",
      date: "Wed 01",
      color: "from-gray-100 to-gray-200",
      dotColors: ['#f97316', '#fb923c', '#fdba74'],
      hasPlus: true,
    },
  ];

  return (
    <div className="bg-[#1a1a1a] rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#D8282B] rounded-sm"></div>
          <h2 className="text-base font-bold text-white">Survey Metrics</h2>
        </div>
        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
          <X size={16} className="text-[#333333]" />
        </button>
      </div>

      <div className="space-y-3">
        {trackingItems.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${item.color} rounded-2xl p-4 flex items-center justify-between`}
          >
            <div className="flex-1">
              <div className="text-sm font-bold text-[#333333] mb-0.5">{item.title}</div>
              <div className="text-xs text-gray-600">{item.subtitle}</div>
            </div>

            <div className="flex items-center gap-4">
              {/* Dot pattern visualization */}
              <div className="flex gap-1">
                {item.dotColors.map((color, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>

              {/* Mini line chart placeholder */}
              <div className="w-16 h-8 relative">
                <svg viewBox="0 0 60 30" className="w-full h-full">
                  <path
                    d="M 0,20 Q 15,10 30,15 T 60,10"
                    fill="none"
                    stroke="#666"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              {/* Slider */}
              <div className="w-24 relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue={Math.random() * 100}
                  className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: 'linear-gradient(to right, #333 0%, #333 50%, #ddd 50%, #ddd 100%)',
                  }}
                />
              </div>

              {/* Date */}
              <div className="text-xs font-medium text-gray-600 w-12 text-right">
                {item.date}
              </div>

              {/* Action icon */}
              {item.hasHeart && (
                <button className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Star size={14} className="text-white" />
                </button>
              )}
              {item.hasPlus && (
                <button className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Plus size={14} className="text-white" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
