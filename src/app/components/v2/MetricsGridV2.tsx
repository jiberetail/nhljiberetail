import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateKPIData } from "@/app/utils/dataCalculations";

export function MetricsGridV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const calculatedData = calculateKPIData(daysInRange, isTodayView);

  return (
    <div className="bg-white rounded-3xl p-6">
      <div className="mb-2">
        <div className="text-sm text-gray-500 mb-1">Earnings</div>
        <div className="flex items-end gap-2">
          <div className="text-4xl font-black text-[#333333]">
            ${calculatedData.potentialRevenueLoss.toLocaleString()}
          </div>
          <div className="bg-[#d4f4a4] text-[#5a7a1f] text-xs font-bold px-2 py-1 rounded-full mb-2">
            +16%
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-1">Compared to Last Month, 28 Sep</div>
      </div>

      <div className="mt-6 flex gap-4">
        <div className="flex-1">
          <div className="text-2xl font-black text-[#333333]">${(calculatedData.potentialRevenueLoss / 3).toFixed(0)}</div>
          <div className="text-xs text-gray-500 mt-1">Today</div>
        </div>
        <div className="flex-1">
          <div className="text-2xl font-black text-[#333333]">-$260</div>
          <div className="text-xs text-gray-500 mt-1">Offset</div>
        </div>
        <div className="flex-1">
          <div className="text-2xl font-black text-[#333333]">+$99</div>
          <div className="text-xs text-gray-500 mt-1">Gain</div>
        </div>
      </div>

      {/* Mini bar chart */}
      <div className="mt-6 flex items-end justify-between h-24 gap-1">
        {[0.3, 0.4, 0.35, 0.45, 0.5, 0.6, 0.85, 1.0, 0.7, 0.8, 0.65, 0.9, 0.75, 0.85].map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-[#333333] rounded-t"
            style={{ height: `${height * 100}%` }}
          ></div>
        ))}
      </div>

      <div className="mt-4 flex justify-between text-xs text-gray-400">
        <span>12 Aug</span>
        <span>19 Sep</span>
        <span>26 Oct</span>
      </div>

      {/* Bottom metrics */}
      <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="text-lg font-black text-[#333333]">23°</div>
            <div className="text-gray-400">🌍</div>
          </div>
          <div className="text-xs text-gray-500">Success Rate</div>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="text-lg font-black text-[#333333]">19 m/s</div>
            <div className="text-gray-400">⏱️</div>
          </div>
          <div className="text-xs text-gray-500">Dwell Time Percent</div>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="text-lg font-black text-[#333333]">64%</div>
            <div className="text-gray-400">😊</div>
          </div>
          <div className="text-xs text-gray-500">Positive</div>
        </div>
      </div>
    </div>
  );
}
