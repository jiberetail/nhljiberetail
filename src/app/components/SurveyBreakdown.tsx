import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateBreakdownData } from "@/app/utils/dataCalculations";

export function SurveyBreakdown() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const breakdownData = calculateBreakdownData(daysInRange, isTodayView);

  return (
    <div>
      <h2 className="text-xl font-black text-[#333333] mb-4">Survey Breakdown</h2>
      <div className="bg-white shadow-lg border-2 border-gray-200 p-4 relative overflow-hidden" style={{ borderRadius: '8px' }}>

        <div className="space-y-4 relative z-10">
          {breakdownData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-black text-gray-700 tracking-wide">{item.label}</span>
                <span className="text-sm font-black text-[#333333]">
                  {item.percentage}% <span className="text-gray-500 font-bold">({item.count})</span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner border border-gray-300">
                <div
                  className="h-2.5 rounded-full transition-all duration-500 ease-out relative bg-[#333333]"
                  style={{
                    width: `${item.percentage}%`,
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}