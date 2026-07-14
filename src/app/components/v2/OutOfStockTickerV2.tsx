import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateMerchandiseData } from "@/app/utils/dataCalculations";
import { getTeamLogo } from "@/app/utils/teamLogos";
import { AlertTriangle } from "lucide-react";

export function OutOfStockTickerV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const merchandiseData = calculateMerchandiseData(daysInRange, isTodayView);

  // Duplicate the data to create seamless loop
  const tickerItems = [...merchandiseData, ...merchandiseData];

  // Adjust speed based on date range
  const getAnimationDuration = () => {
    if (daysInRange === 1) return '35s';
    if (daysInRange <= 7) return '40s';
    if (daysInRange <= 30) return '70s';
    return '70s';
  };

  const animationDuration = getAnimationDuration();

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
      <div className="bg-red-100 px-6 py-2 flex items-center gap-2 border-b border-red-200">
        <AlertTriangle size={16} className="text-red-600" />
        <span className="text-xs font-bold text-red-900 uppercase tracking-wide">
          Out of Stock Alert
        </span>
      </div>

      <div className="overflow-hidden bg-white">
        <div className="ticker-wrapper">
          <div className="ticker-content flex items-center gap-8 py-4">
            {tickerItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4 whitespace-nowrap px-4">
                {getTeamLogo(item.team) && (
                  <img
                    src={getTeamLogo(item.team)}
                    alt={item.team}
                    className="w-8 h-8 object-contain flex-shrink-0"
                  />
                )}

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#333333]">
                    {item.team}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.item}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.size}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .ticker-wrapper {
          display: flex;
          overflow: hidden;
        }

        .ticker-content {
          display: flex;
          animation: scroll ${animationDuration} linear infinite;
          padding-left: 100%;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
