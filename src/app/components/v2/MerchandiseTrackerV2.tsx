import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateMerchandiseData } from "@/app/utils/dataCalculations";
import { getTeamLogo } from "@/app/utils/teamLogos";

export function MerchandiseTrackerV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const merchandiseData = calculateMerchandiseData(daysInRange, isTodayView);

  return (
    <div className="bg-[#252f3f] rounded-xl border border-gray-700/50 overflow-hidden">
      <div className="p-6 border-b border-gray-700/50">
        <h2 className="text-lg font-bold text-white">Missing Merchandise Tracker</h2>
        <p className="text-sm text-gray-400 mt-1">Items customers couldn't find in store</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1a2332]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Count
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                Revenue Loss
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            {merchandiseData.map((item, index) => (
              <tr key={index} className="hover:bg-[#1a2332]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {getTeamLogo(item.team) && (
                      <div className="w-10 h-10 bg-white/5 rounded-lg p-1.5 flex items-center justify-center">
                        <img
                          src={getTeamLogo(item.team)}
                          alt={item.team}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{item.item}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-400">{item.gender} / {item.age}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {item.size}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-white">{item.count}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{item.revenue}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
