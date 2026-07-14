import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateKPIData, calculateMerchandiseData, calculateQuickInsights } from "@/app/utils/dataCalculations";
import { DateRangePicker } from "@/app/components/DateRangePicker";
import { TrendingUp, Users, DollarSign, MessageSquare, Star, ShoppingBag, AlertCircle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { teamLogos, getTeamLogo } from "@/app/utils/teamLogos";

export function DashboardV3() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const days = getDayCount();
  const isToday = isCurrentDay();

  const kpiData = calculateKPIData(days, isToday);
  const merchandiseData = calculateMerchandiseData(days, isToday);
  const insights = calculateQuickInsights(days, isToday);

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
    <div style={{ flex: 1, overflow: 'auto', minHeight: '100vh', width: '100%' }}>
      <div style={{ maxWidth: '1400px', minHeight: '100%' }}>
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Gradient Box containing Header and KPI Cards */}
          <div className="bg-gradient-to-br from-[#111827] via-slate-900 to-[#6B7280] rounded-3xl p-8 shadow-2xl">
            {/* Header Content */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                  Customer Survey Analytics
                </h1>
                <p className="text-sm text-white/80 mt-1 font-medium">NHL Shop NYC Dashboard</p>
              </div>
              <DateRangePicker />
            </div>

            {/* KPI Cards - Top Row */}
            <div className="grid grid-cols-6 gap-4">
              {/* Survey Count */}
              <div className="col-span-1 group bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#111827] hover:border-[#6B7280] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#111827]/10 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <Users className="w-5 h-5 text-[#111827]" />
                    <div className="text-xs font-bold text-white bg-[#111827] px-2.5 py-1 rounded-full shadow-md">
                      {days}d
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#111827] mb-1">
                    {kpiData.totalSurveys.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-slate-700">Survey Count</div>
                  <div className="text-xs text-slate-600 mt-2">Total surveys submitted</div>
                </div>
              </div>

              {/* Revenue Loss */}
              <div className="col-span-1 group bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6B7280] hover:border-[#111827] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#6B7280]/10 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign className="w-5 h-5 text-[#6B7280]" />
                    <TrendingUp className="w-4 h-4 text-[#6B7280]" />
                  </div>
                  <div className="text-2xl font-black text-[#6B7280] mb-1">
                    ${kpiData.potentialRevenueLoss.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-slate-700">Revenue Loss</div>
                  <div className="text-xs text-slate-600 mt-2">Estimated sales missed</div>
                </div>
              </div>

              {/* Item Found */}
              <div className="col-span-1 group bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#111827] hover:border-[#6B7280] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <ShoppingBag className="w-5 h-5 text-[#111827]" />
                    <XCircle className="w-4 h-4 text-[#6B7280]" />
                  </div>
                  <div className="text-2xl font-black text-[#111827] mb-1">
                    16%
                  </div>
                  <div className="text-xs font-bold text-slate-700">Item Found</div>
                  <div className="text-xs text-slate-600 mt-2">Couldn't find merchandise</div>
                </div>
              </div>

              {/* Associate Engagement */}
              <div className="col-span-1 group bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6B7280] hover:border-[#111827] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <MessageSquare className="w-5 h-5 text-[#6B7280]" />
                    <CheckCircle2 className="w-4 h-4 text-[#111827]" />
                  </div>
                  <div className="text-2xl font-black text-[#6B7280] mb-1">
                    {kpiData.staffContact}%
                  </div>
                  <div className="text-xs font-bold text-slate-700">Associate Engagement</div>
                  <div className="text-xs text-slate-600 mt-2">Reported speaking with staff</div>
                </div>
              </div>

              {/* Associate Satisfaction */}
              <div className="col-span-1 group bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#111827] hover:border-[#6B7280] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <Star className="w-5 h-5 text-[#111827] fill-[#111827]" />
                    <TrendingUp className="w-4 h-4 text-[#111827]" />
                  </div>
                  <div className="text-2xl font-black text-[#111827] mb-1">
                    {kpiData.staffSatisfaction}%
                  </div>
                  <div className="text-xs font-bold text-slate-700">Associate Satisfaction</div>
                  <div className="text-xs text-slate-600 mt-2">Satisfaction with associates</div>
                </div>
              </div>

              {/* Ease Friction */}
              <div className="col-span-1 group bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#6B7280] hover:border-[#111827] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <AlertCircle className="w-5 h-5 text-[#6B7280]" />
                    <Clock className="w-4 h-4 text-[#111827]" />
                  </div>
                  <div className="text-2xl font-black text-[#6B7280] mb-1">
                    {kpiData.friction}%
                  </div>
                  <div className="text-xs font-bold text-slate-700">Ease Friction</div>
                  <div className="text-xs text-slate-600 mt-2">Customers reporting a shopping obstacle</div>
                </div>
              </div>
            </div>
          </div>

          {/* Out of Stock Ticker */}
          <div className="bg-white border border-[#111827] overflow-hidden relative shadow-lg rounded-xl">
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
                      <span className="text-sm font-black text-[#111827]">
                        {item.team}
                      </span>
                      <span className="text-sm text-gray-700 font-bold">
                        {item.item} - {item.gender} ({item.size})
                      </span>

                      {/* Count Badge */}
                      <span className="inline-flex items-center justify-center min-w-[28px] h-[28px] px-2 bg-gradient-to-r from-[#6B7280] to-red-600 text-white rounded-full font-black text-xs shadow-lg">
                        {item.count}
                      </span>

                      {/* Separator Dot */}
                      <span className="w-2 h-2 bg-[#111827] rounded-full flex-shrink-0 ml-1 shadow-sm"></span>
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

          {/* Quick Insights - Direct Grid */}
          <div className="grid grid-cols-4 gap-6">
            {/* Most Unfulfilled Item */}
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="bg-white p-5 rounded-xl border border-[#111827] shadow-lg hover:shadow-xl transition-all hover:border-[#6B7280]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#111827] to-[#111827]/80 flex items-center justify-center shadow-md">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-[#6B7280]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-[#111827] uppercase tracking-wide">Most Unfulfilled Item</h3>
                  <p className="text-lg font-black text-[#111827]">{insights.mostUnfulfilledItem.value}</p>
                  <p className="text-xs text-slate-600 font-semibold">{insights.mostUnfulfilledItem.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Daily Revenue Loss */}
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="bg-white p-5 rounded-xl border border-[#6B7280] shadow-lg hover:shadow-xl transition-all hover:border-[#111827]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6B7280] to-red-600 flex items-center justify-center shadow-md">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <AlertCircle className="w-4 h-4 text-[#6B7280]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-[#6B7280] uppercase tracking-wide">Daily Revenue Loss</h3>
                  <p className="text-lg font-black text-[#6B7280]">{insights.dailyRevenueLoss.value}</p>
                  <p className="text-xs text-slate-600 font-semibold">{insights.dailyRevenueLoss.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Most Active Podium */}
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="bg-white p-5 rounded-xl border border-[#111827] shadow-lg hover:shadow-xl transition-all hover:border-[#6B7280]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#111827] to-[#111827]/80 flex items-center justify-center shadow-md">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#111827]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-[#111827] uppercase tracking-wide">Most Active Podium</h3>
                  <p className="text-lg font-black text-[#111827]">{insights.mostActivePodium.value}</p>
                  <p className="text-xs text-slate-600 font-semibold">{insights.mostActivePodium.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Peak Friction Time */}
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="bg-white p-5 rounded-xl border border-[#6B7280] shadow-lg hover:shadow-xl transition-all hover:border-[#111827]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6B7280] to-red-600 flex items-center justify-center shadow-md">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <MessageSquare className="w-4 h-4 text-[#6B7280]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-[#6B7280] uppercase tracking-wide">Peak Friction Time</h3>
                  <p className="text-lg font-black text-[#6B7280]">{insights.peakFrictionTime.value}</p>
                  <p className="text-xs text-slate-600 font-semibold">{insights.peakFrictionTime.subtitle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Merchandise Tracker - Modern Grid */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#111827]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#111827]">Missing Merchandise Tracker</h2>
              <div className="flex items-center gap-3 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#6B7280] shadow-md" />
                  <span className="text-slate-700">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-500 shadow-md" />
                  <span className="text-slate-700">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 shadow-md" />
                  <span className="text-slate-700">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-300 shadow-md" />
                  <span className="text-slate-700">None</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-[#111827]">
                    <th className="text-left font-black text-[#111827] pb-3 pr-4">Team</th>
                    <th className="text-left font-black text-[#111827] pb-3 pr-4">Item</th>
                    <th className="text-left font-black text-[#111827] pb-3 pr-4">Gender</th>
                    <th className="text-left font-black text-[#111827] pb-3 pr-4">Age</th>
                    <th className="text-left font-black text-[#111827] pb-3 pr-4">Size</th>
                    <th className="text-right font-black text-[#111827] pb-3 pr-4">Count</th>
                    <th className="text-right font-black text-[#111827] pb-3">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {merchandiseData.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          {getTeamLogo(item.team) && (
                            <img
                              src={getTeamLogo(item.team)}
                              alt={item.team}
                              className="w-5 h-5 object-contain"
                            />
                          )}
                          <span className="text-[#111827] font-bold">{item.team}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-slate-700 font-semibold">{item.item}</td>
                      <td className="py-3 pr-4 text-slate-600 font-medium">{item.gender}</td>
                      <td className="py-3 pr-4 text-slate-600 font-medium">{item.age}</td>
                      <td className="py-3 pr-4">
                        <span className="px-2.5 py-1 bg-[#111827] text-white rounded-lg font-bold shadow-sm">{item.size}</span>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black shadow-md ${
                          item.count >= 50 ? 'bg-[#6B7280] text-white' :
                          item.count >= 25 ? 'bg-amber-500 text-white' :
                          item.count >= 10 ? 'bg-green-500 text-white' :
                          'bg-slate-300 text-slate-700'
                        }`}>
                          {item.count}
                        </span>
                      </td>
                      <td className="py-3 text-right font-black text-[#6B7280]">{item.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
