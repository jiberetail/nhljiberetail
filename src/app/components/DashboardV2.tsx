import { SurveyOverviewV2 } from "@/app/components/v2/SurveyOverviewV2";
import { KeyMetricsV2 } from "@/app/components/v2/KeyMetricsV2";
import { MissingMerchandiseV2 } from "@/app/components/v2/MissingMerchandiseV2";
import { SurveyInsightsV2 } from "@/app/components/v2/SurveyInsightsV2";
import { DateRangePicker } from "@/app/components/DateRangePicker";
import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateMerchandiseData } from "@/app/utils/dataCalculations";
import { getTeamLogo } from "@/app/utils/teamLogos";
import { useState } from "react";

export function DashboardV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const days = getDayCount();
  const isToday = isCurrentDay();
  const [viewMode, setViewMode] = useState<'roi' | 'survey' | 'satisfaction' | 'location'>('roi');

  const merchandiseData = calculateMerchandiseData(days, isToday);

  // Duplicate the data to create seamless loop for ticker
  const tickerItems = [...merchandiseData, ...merchandiseData];

  // Adjust speed based on date range
  const getAnimationDuration = () => {
    if (days === 1) return '35s';
    if (days <= 7) return '40s';
    if (days <= 30) return '70s';
    return '70s';
  };

  const animationDuration = getAnimationDuration();

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div>
        <div className="max-w-[1400px] px-6 py-4">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8 flex items-center gap-3">
              <div>
                <h1 className="font-bold text-[#111827] text-3xl">NHL Shop NYC Dashboard</h1>
                <p className="text-xs text-slate-600">Customer Survey Analytics</p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 flex items-center md:justify-end">
              <DateRangePicker />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-12 xl:col-span-8 space-y-3">
            <SurveyOverviewV2 viewMode={viewMode} setViewMode={setViewMode} />

            {/* Out of Stock Ticker - Glassmorphism */}
            <div className="backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl overflow-hidden shadow-2xl">
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
                            className="w-10 h-10 object-contain flex-shrink-0"
                          />
                        )}

                        {/* Item Details */}
                        <span className="text-sm font-black text-[#111827]">
                          {item.team}
                        </span>
                        <span className="text-sm text-gray-700 font-bold">
                          {item.item} - {item.gender} ({item.size})
                        </span>

                        {/* Count Badge */}
                        <span className="inline-flex items-center justify-center min-w-[28px] h-[28px] px-2 bg-gradient-to-r from-[#374151] to-[#6B7280] text-white rounded-full font-black text-xs shadow-lg">
                          {item.count}
                        </span>

                        {/* Separator Dot */}
                        <span className="w-2 h-2 bg-[#9CA3AF] rounded-full flex-shrink-0 ml-1 shadow-sm"></span>
                      </div>
                    ))}
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
            </div>

            <MissingMerchandiseV2 />
          </div>

          {/* Right Column */}
          <div className="col-span-12 xl:col-span-4 space-y-3">
            <KeyMetricsV2 />
            <SurveyInsightsV2 />
          </div>
        </div>
      </div>
    </div>
  );
}
