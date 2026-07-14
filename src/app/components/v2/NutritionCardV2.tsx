import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateKPIData } from "@/app/utils/dataCalculations";
import { Heart } from "lucide-react";

export function NutritionCardV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const calculatedData = calculateKPIData(daysInRange, isTodayView);

  // Generate dot pattern for visualization
  const dotPattern = [
    ['#3b82f6', '#3b82f6', '#60a5fa', '#93c5fd'],
    ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
    ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8'],
  ];

  return (
    <div className="bg-[#1a1a1a] rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#D8282B] rounded-sm"></div>
          <h2 className="text-base font-bold text-white">Revenue Impact</h2>
        </div>
      </div>

      {/* Main metric with heart */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-5xl font-black text-white mb-2">
            {calculatedData.potentialRevenueLoss.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Kcal</div>
        </div>

        <div className="bg-gradient-to-br from-[#D8282B] to-[#b01820] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart size={48} className="text-white/20" fill="currentColor" />
          </div>
          <div className="relative z-10 text-center">
            <div className="text-3xl font-black text-white mb-1">
              {calculatedData.friction}
            </div>
            <div className="text-xs text-white/80">BPM</div>
          </div>
        </div>
      </div>

      {/* Dot pattern visualization */}
      <div className="mb-6">
        <div className="flex justify-center gap-2">
          {dotPattern.map((row, i) => (
            <div key={i} className="flex flex-col gap-2">
              {row.map((color, j) => (
                <div
                  key={j}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom metrics */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
        <div>
          <div className="text-sm text-gray-400 mb-1">Total Surveys</div>
          <div className="text-2xl font-black text-white mb-1">
            {calculatedData.totalSurveys.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Daily average</div>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-1">Staff Rating</div>
          <div className="text-2xl font-black text-white mb-1">
            {calculatedData.staffSatisfaction}%
          </div>
          <div className="text-xs text-gray-500">Satisfaction</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 text-sm font-medium text-white transition-colors">
          View Details
        </button>
        <button className="bg-gradient-to-r from-[#D8282B] to-[#b01820] hover:from-[#c72028] hover:to-[#a01518] rounded-xl py-3 text-sm font-bold text-white transition-all">
          Generate Report
        </button>
      </div>
    </div>
  );
}
