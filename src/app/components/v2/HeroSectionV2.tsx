import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateKPIData } from "@/app/utils/dataCalculations";
import { TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

export function HeroSectionV2() {
  const { getDayCount, isCurrentDay, dateRange } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const calculatedData = calculateKPIData(daysInRange, isTodayView);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003087] via-[#0051ba] to-[#D50032] p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        {/* Left Side - Main Stats */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-blue-200" />
            <span className="text-sm font-medium text-blue-100">
              {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
            </span>
          </div>

          <h2 className="text-4xl font-black text-white mb-2">
            Customer Survey Analytics
          </h2>

          <p className="text-lg text-blue-100 mb-6">
            Real-time insights from in-store customer feedback
          </p>

          <div className="grid grid-cols-3 gap-6 max-w-2xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-sm text-blue-100 mb-1">Total Surveys</div>
              <div className="text-3xl font-black text-white">{calculatedData.totalSurveys.toLocaleString()}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-sm text-blue-100 mb-1">Revenue Loss</div>
              <div className="text-3xl font-black text-white">${calculatedData.potentialRevenueLoss.toLocaleString()}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-sm text-blue-100 mb-1">Satisfaction</div>
              <div className="text-3xl font-black text-white">{calculatedData.staffSatisfaction}%</div>
            </div>
          </div>
        </div>

        {/* Right Side - Decorative Element */}
        <div className="hidden lg:block">
          <div className="w-64 h-64 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 flex items-center justify-center">
            <TrendingUp size={80} className="text-white/20" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
