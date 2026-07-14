import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateMerchandiseData, calculateKPIData, BASE_MERCHANDISE } from "@/app/utils/dataCalculations";
import { getTeamLogo } from "@/app/utils/teamLogos";
import { Package, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { format, subDays } from "date-fns";

export function MissingMerchandiseV2() {
  const { getDayCount, isCurrentDay, dateRange } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const calculatedData = calculateKPIData(daysInRange, isTodayView);
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate chart data to get actual missing items count (same logic as SurveyOverviewV2)
  const generateChartData = () => {
    const missingPercentage = calculatedData.itemsMissing / calculatedData.totalSurveys;

    // Single day view: Show hourly data
    if (daysInRange === 1) {
      const hours = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'];
      const hourlyPatterns = [5, 6, 7, 12, 14, 13, 10, 8, 11, 9, 6, 4];

      // If viewing "Today", assume it's currently 6 PM (index 9 in the array)
      const currentHourIndex = isTodayView ? 9 : hours.length - 1;

      return hours.map((hour, i) => {
        // For future hours (after current time), show 0 data
        if (isTodayView && i > currentHourIndex) {
          return {
            label: hour,
            surveys: 0,
            missingItems: 0,
          };
        }

        const surveys = hourlyPatterns[i];
        const missingItems = Math.round(surveys * missingPercentage);

        return {
          label: hour,
          surveys,
          missingItems,
        };
      });
    } else {
      const days = [];
      const dailyAverage = Math.round(calculatedData.totalSurveys / daysInRange);

      for (let i = daysInRange - 1; i >= 0; i--) {
        const date = subDays(dateRange.to, i);
        const variation = 0.7 + Math.random() * 0.6;
        const surveys = Math.round(dailyAverage * variation);
        const missingItems = Math.round(surveys * missingPercentage);

        days.push({
          label: format(date, 'M/d'),
          surveys,
          missingItems,
        });
      }

      return days;
    }
  };

  const chartData = generateChartData();
  const actualMissingItems = chartData.reduce((sum, item) => sum + item.missingItems, 0);

  // Calculate merchandise data to match actualMissingItems
  const itemsToShow = (isTodayView || daysInRange === 1) ? 6 : daysInRange <= 7 ? 10 : 15;
  const baseItems = BASE_MERCHANDISE.slice(0, itemsToShow);
  const baseTotal = baseItems.reduce((sum, item) => sum + item.count, 0);

  // Scale each item proportionally so the total equals actualMissingItems
  const merchandiseData = baseItems.map(item => {
    // Calculate the average price per unit from the base data
    const pricePerUnit = item.revenue / item.count;
    // Scale the count proportionally
    const scaledCount = Math.max(1, Math.round((item.count / baseTotal) * actualMissingItems));
    // Calculate potential revenue based on scaled count and price per unit
    const potentialRevenue = Math.round(scaledCount * pricePerUnit);

    return {
      ...item,
      count: scaledCount,
      revenue: `$${potentialRevenue.toLocaleString()}`,
    };
  });

  // Show top 5 or all items based on expanded state
  const displayItems = isExpanded ? merchandiseData : merchandiseData.slice(0, 6);

  return (
    <div className="backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl overflow-hidden shadow-2xl">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1e293b]">Top Missing Merchandise</h2>
            <p className="text-sm text-slate-600 mt-1">Most requested out-of-stock items</p>
          </div>
          <Link
            to="/reports?tab=out-of-stock"
            className="flex items-center gap-1 px-3 py-1.5 bg-[#111827] hover:bg-[#111827]/90 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            View Full Report
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          {displayItems.map((item, index) => {
            const logo = getTeamLogo(item.team);

            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm hover:bg-white/70 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-1 shadow-sm">
                  {logo ? (
                    <img src={logo} alt={item.team} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-[10px] font-bold text-gray-400">NHL</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-[#1e293b] truncate">{item.team}</div>
                  <div className="text-xs text-slate-600 truncate">{item.item}</div>
                </div>

                <div className="text-right">
                  <div className="font-black text-[#9CA3AF] text-lg">{item.count}</div>
                  <div className="text-xs text-[#0076CE]">requests</div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-[#333333] text-sm">{item.revenue}</div>
                  <div className="text-xs text-[#0076CE]">potential</div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full py-3 bg-gray-100 hover:bg-gray-200 text-[#111827] font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isExpanded ? (
            <>
              Collapse
              <ChevronUp size={16} />
            </>
          ) : (
            <>
              Expand
              <ChevronDown size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}