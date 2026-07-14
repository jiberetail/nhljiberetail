import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateKPIData } from "@/app/utils/dataCalculations";

export function RevenueCardV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const calculatedData = calculateKPIData(daysInRange, isTodayView);

  return (
    <div className="bg-gradient-to-br from-[#8b9b8e] to-[#a8b5ab] rounded-3xl p-6 h-full flex flex-col">
      <div className="mb-6">
        <div className="text-sm text-white/80 mb-1">Revenue Loss</div>
        <div className="text-4xl font-black text-white mb-2">
          ${calculatedData.potentialRevenueLoss.toLocaleString()}
        </div>
        <div className="text-xs text-white/60">Missing merchandise impact</div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="text-sm text-white/80 mb-1">Items Missing</div>
          <div className="text-2xl font-black text-white">{calculatedData.itemsMissing}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="text-sm text-white/80 mb-1">Friction Rate</div>
          <div className="text-2xl font-black text-white">{calculatedData.friction}%</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="text-sm text-white/80 mb-1">Staff Contact</div>
          <div className="text-2xl font-black text-white">{calculatedData.staffContact}%</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="text-sm text-white/80 mb-1">Satisfaction</div>
          <div className="text-2xl font-black text-white">{calculatedData.staffSatisfaction}%</div>
        </div>
      </div>

      {/* Bottom action */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <button className="w-full bg-white/90 hover:bg-white backdrop-blur-sm rounded-2xl py-3 text-sm font-bold text-[#333333] transition-all">
          View Detailed Report
        </button>
      </div>
    </div>
  );
}
