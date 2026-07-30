import { SurveyOverviewV2 } from "@/app/components/v2/SurveyOverviewV2";
import { KeyMetricsV2 } from "@/app/components/v2/KeyMetricsV2";
import { MissingMerchandiseV2 } from "@/app/components/v2/MissingMerchandiseV2";
import { SurveyInsightsV2 } from "@/app/components/v2/SurveyInsightsV2";
import { DateRangePicker } from "@/app/components/DateRangePicker";
import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateMerchandiseData } from "@/app/utils/dataCalculations";
import { getTeamLogo } from "@/app/utils/teamLogos";
import { useState } from "react";
import dashboardBackground from "../../imports/nhl-shop-hudson-yards-dashboard.png";
import nhlShopLogo from "../../imports/nhl-shop-fanatics-dashboard-logo.png";

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
    <div className="nhl-dashboard-theme nhl-home-dashboard flex-1 overflow-auto min-h-screen">
      {/* Branded Masthead */}
      <header
        className="nhl-home-masthead"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(3, 7, 11, 0.76), rgba(3, 7, 11, 0.38) 56%, rgba(3, 7, 11, 0.56)),
            url(${dashboardBackground})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center 38%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-[1600px] min-h-[164px] px-6 py-5 flex items-center">
          <div className="grid grid-cols-12 gap-6 w-full">
            <div className="col-span-12 md:col-span-8 flex items-center gap-3">
              <div>
                <h1 className="sr-only">NHL Shop Customer Survey Dashboard</h1>
                <img
                  src={nhlShopLogo}
                  alt="NHL Shop - A Fanatics Experience"
                  className="w-full max-w-[430px] h-auto"
                  style={{ filter: 'drop-shadow(0 5px 14px rgba(0, 0, 0, 0.62))' }}
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 flex items-center md:justify-end">
              <DateRangePicker />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="nhl-home-main max-w-[1600px] px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-12 xl:col-span-8 space-y-4">
            <SurveyOverviewV2 viewMode={viewMode} setViewMode={setViewMode} />

            {/* Out of Stock Ticker - Glassmorphism */}
            <div className="nhl-panel nhl-secondary-panel backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
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
                        <span className="text-sm font-black text-white">
                          {item.team}
                        </span>
                        <span className="text-sm text-[#b8c4cc] font-bold">
                          {item.item} - {item.gender} ({item.size})
                        </span>

                        {/* Count Badge */}
                        <span className="inline-flex items-center justify-center min-w-[28px] h-[28px] px-2 bg-gradient-to-r from-[#9a7120] to-[#f4dc91] text-[#07111b] rounded-full font-black text-xs shadow-lg">
                          {item.count}
                        </span>

                        {/* Separator Dot */}
                        <span className="w-2 h-2 bg-[#e2c36b] rounded-full flex-shrink-0 ml-1 shadow-sm"></span>
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
