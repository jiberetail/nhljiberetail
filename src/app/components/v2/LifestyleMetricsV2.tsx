import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateKPIData } from "@/app/utils/dataCalculations";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function LifestyleMetricsV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const calculatedData = calculateKPIData(daysInRange, isTodayView);

  // Generate random dot patterns for visualization
  const generateDotPattern = (count: number, colors: string[]) => {
    return Array.from({ length: count }, (_, i) => ({
      color: colors[i % colors.length],
      opacity: Math.random() * 0.5 + 0.5,
    }));
  };

  return (
    <div className="bg-white rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#D8282B] rounded-sm"></div>
          <h2 className="text-base font-bold text-[#333333]">Customer Behavior</h2>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-6 h-6 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
            <span className="text-xs text-gray-400">•</span>
          </button>
          <button className="w-6 h-6 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
            <span className="text-xs text-gray-400">•</span>
          </button>
        </div>
      </div>

      {/* Main metric */}
      <div className="mb-6">
        <div className="text-5xl font-black text-[#333333] mb-2">
          {calculatedData.totalSurveys.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500 mb-4">Total Today</div>

        <span className="bg-[#D8282B] text-white text-xs font-bold px-3 py-1.5 rounded-full">
          +12%
        </span>
      </div>

      {/* Dot patterns */}
      <div className="flex items-center gap-6 mb-6">
        {/* Pattern 1 - Orange */}
        <div className="flex gap-1">
          {generateDotPattern(5, ['#f97316']).map((dot, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: dot.color, opacity: dot.opacity }}
            ></div>
          ))}
        </div>

        {/* Pattern 2 - Purple */}
        <div className="flex gap-1">
          {generateDotPattern(5, ['#a855f7']).map((dot, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: dot.color, opacity: dot.opacity }}
            ></div>
          ))}
        </div>

        {/* Pattern 3 - Blue */}
        <div className="flex gap-1">
          {generateDotPattern(3, ['#3b82f6']).map((dot, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: dot.color, opacity: dot.opacity }}
            ></div>
          ))}
        </div>

        {/* Pattern 4 - Pink */}
        <div className="flex gap-1">
          {generateDotPattern(6, ['#ec4899']).map((dot, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: dot.color, opacity: dot.opacity }}
            ></div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 leading-relaxed">
          Perfect wellness metrics based on user flow{" "}
          <span className="text-[#D8282B] font-medium underline cursor-pointer">
            (DISCOVER)
          </span>
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mb-6">
        <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
          <ChevronLeft size={18} className="text-[#333333]" />
        </button>
        <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
          <ChevronRight size={18} className="text-[#333333]" />
        </button>
      </div>

      {/* Bottom metrics */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
        <div>
          <div className="text-3xl font-black text-[#333333] mb-1">{calculatedData.itemsMissing}</div>
          <div className="text-xs text-gray-500">Missing</div>
          <div className="text-xs text-gray-400 mt-1">+24%</div>
        </div>

        <div>
          <div className="text-3xl font-black text-[#333333] mb-1">8k</div>
          <div className="text-xs text-gray-500">Steps</div>
          <div className="text-xs text-gray-400 mt-1">2d</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex -space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 border-2 border-white"></div>
          </div>
          <div className="text-[10px] text-gray-500">Workouts</div>
          <button className="mt-1 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors">
            <span className="text-lg leading-none text-gray-600">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}
