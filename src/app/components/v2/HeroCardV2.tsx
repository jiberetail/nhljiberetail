import { Play, TrendingUp } from "lucide-react";
import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateKPIData } from "@/app/utils/dataCalculations";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function HeroCardV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const calculatedData = calculateKPIData(daysInRange, isTodayView);

  return (
    <div className="bg-gradient-to-br from-[#8b9b8e] to-[#a8b5ab] rounded-3xl p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span className="text-sm font-medium text-white/80">Survey Analytics</span>
        </div>

        <div className="mb-6">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80"
            alt="Store"
            className="w-full h-40 object-cover rounded-2xl"
          />
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 inline-flex items-center gap-3">
          <div className="bg-[#333333] text-white rounded-full w-10 h-10 flex items-center justify-center">
            <Play size={16} fill="white" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Total Surveys</div>
            <div className="text-xl font-black text-[#333333]">{calculatedData.totalSurveys.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
