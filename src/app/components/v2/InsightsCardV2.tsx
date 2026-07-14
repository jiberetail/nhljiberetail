import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateKPIData } from "@/app/utils/dataCalculations";

export function InsightsCardV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const calculatedData = calculateKPIData(daysInRange, isTodayView);

  // Generate mock data for bar chart
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const values = [0.4, 0.5, 0.45, 0.6, 0.7, 0.55, 0.65, 0.8, 1.0, 0.7, 0.6, 0.5];

  return (
    <div className="bg-gradient-to-b from-[#d4e4d8] to-[#c8dccf] rounded-3xl p-6">
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-1">Indicators</div>
        <div className="text-xs text-gray-500">Compared to Last Month</div>
        <div className="inline-block bg-[#f4f49a] text-[#5a7a1f] text-xs font-bold px-2 py-1 rounded-full mt-2">
          +25%
        </div>
      </div>

      {/* Bar chart */}
      <div className="relative h-48 mb-4">
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {values.map((value, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
              <div className="w-full relative flex flex-col items-center justify-end h-full">
                {/* Bar */}
                <div
                  className="w-full bg-gray-300 rounded-t-lg transition-all"
                  style={{ height: `${value * 100}%` }}
                ></div>
                {/* Special highlight for last bar */}
                {i === 8 && (
                  <>
                    <div
                      className="absolute bottom-0 w-full bg-[#333333] rounded-t-lg"
                      style={{ height: `${value * 100}%` }}
                    ></div>
                    <div className="absolute -top-8 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                      <span className="text-xs font-bold text-[#333333]">{calculatedData.itemsMissing}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Month labels */}
      <div className="flex justify-between mb-6">
        {months.map((month, i) => (
          <div key={i} className="text-[10px] text-gray-500 font-medium">
            {month}
          </div>
        ))}
      </div>

      {/* Bottom info */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
        <div className="text-sm text-gray-600 mb-1">Total Spend</div>
        <div className="flex items-end gap-2">
          <div className="text-3xl font-black text-[#333333]">$59,638</div>
          <div className="bg-[#f4f49a] text-[#5a7a1f] text-xs font-bold px-2 py-1 rounded-full mb-1">
            +10%
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">Compared to $8,496 last year</div>
      </div>
    </div>
  );
}
