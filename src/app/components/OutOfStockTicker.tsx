import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateMerchandiseData } from "@/app/utils/dataCalculations";
import { getTeamLogo } from "@/app/utils/teamLogos";

export function OutOfStockTicker() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const merchandiseData = calculateMerchandiseData(daysInRange, isTodayView);

  // Duplicate the data to create seamless loop
  const tickerItems = [...merchandiseData, ...merchandiseData];

  // Adjust speed based on date range
  // Shorter periods = faster, longer periods = slower
  const getAnimationDuration = () => {
    if (daysInRange === 1) return '35s'; // Today - fastest
    if (daysInRange <= 7) return '40s'; // Last 7 days - fast
    if (daysInRange <= 30) return '70s'; // 30 days - slower
    return '70s'; // Default for custom ranges
  };

  const animationDuration = getAnimationDuration();

  return (
    <div className="bg-white border-2 border-gray-200 border-l-4 border-l-[#0076CE] overflow-hidden relative shadow-md" style={{ borderRadius: '8px' }}>
      <div className="overflow-hidden">
        <div className="ticker-wrapper">
          <div className="ticker-content flex items-center gap-4 py-3">
            {tickerItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 whitespace-nowrap">
                {/* Team Logo */}
                {getTeamLogo(item.team) && (
                  <img
                    src={getTeamLogo(item.team)}
                    alt={item.team}
                    className="w-6 h-6 object-contain flex-shrink-0"
                  />
                )}

                {/* Item Details */}
                <span className="text-sm font-black text-gray-800">
                  {item.team}
                </span>
                <span className="text-sm text-gray-600 font-medium">
                  {item.item} - {item.gender} ({item.size})
                </span>

                {/* Count Badge */}
                <span className="inline-flex items-center justify-center min-w-[28px] h-[28px] px-2 bg-gradient-to-r from-[#FDB913] to-[#f4c430] text-[#333333] rounded-full font-black text-xs shadow-sm border border-yellow-600/20">
                  {item.count}
                </span>

                {/* Separator Dot */}
                <span className="w-2 h-2 bg-[#BC0022] rounded-full flex-shrink-0 ml-1 shadow-sm"></span>
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