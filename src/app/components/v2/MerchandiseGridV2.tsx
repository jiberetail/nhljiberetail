import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateMerchandiseData } from "@/app/utils/dataCalculations";
import { getTeamLogo } from "@/app/utils/teamLogos";
import { Heart } from "lucide-react";

export function MerchandiseGridV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const merchandiseData = calculateMerchandiseData(daysInRange, isTodayView);

  // Take top 4 items
  const topItems = merchandiseData.slice(0, 4);

  return (
    <div className="bg-white rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-lg font-bold text-[#333333]">New Products</div>
          <div className="text-xs text-gray-500 mt-1">9,258 Items</div>
        </div>
        <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
          <Heart size={18} className="text-[#333333]" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {topItems.map((item, index) => {
          const logo = getTeamLogo(item.team);

          return (
            <div key={index} className="group cursor-pointer">
              <div className="bg-gradient-to-br from-[#e8e8d8] to-[#d8d8c8] rounded-2xl aspect-square p-6 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                {logo ? (
                  <img
                    src={logo}
                    alt={item.team}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-xs font-bold text-[#333333] mb-1">{item.team}</div>
                    <div className="text-[10px] text-gray-500">{item.item}</div>
                  </div>
                )}
              </div>
              <div className="text-xs font-medium text-[#333333] text-center truncate">
                {item.item}
              </div>
            </div>
          );
        })}
      </div>

      {/* "All" button placeholder */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <button className="w-full bg-gradient-to-br from-[#e8f4a4] to-[#f4f49a] hover:from-[#dce898] hover:to-[#e8e88e] rounded-2xl py-3 text-sm font-bold text-[#333333] transition-all">
          View All Products
        </button>
      </div>
    </div>
  );
}
