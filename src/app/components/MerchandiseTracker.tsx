import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateMerchandiseData } from "@/app/utils/dataCalculations";
import { getTeamLogo } from "@/app/utils/teamLogos";

export function MerchandiseTracker() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const merchandiseData = calculateMerchandiseData(daysInRange, isTodayView);

  return (
    <div>
      <h2 className="text-xl font-black text-[#333333] mb-4">Missing Merchandise Tracker</h2>
      <div className="bg-white shadow-lg border-2 border-gray-200 overflow-hidden relative" style={{ borderRadius: '8px' }}>
        {/* Top accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#333333]"></div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#333333] text-white">
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide">Team</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide">Item</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide">Gender/Age</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide">Size</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide">Count</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wide">Revenue Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {merchandiseData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      {getTeamLogo(item.team) && (
                        <img
                          src={getTeamLogo(item.team)}
                          alt={item.team}
                          className="w-8 h-8 object-contain"
                          title={item.team}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-[#333333]">{item.item}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-medium">
                    {item.gender} / {item.age}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-700">{item.size}</td>
                  <td className="px-4 py-3 text-sm font-black text-[#333333]">
                    {item.count}
                  </td>
                  <td className="px-4 py-3 text-sm font-black text-[#333333]">{item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}