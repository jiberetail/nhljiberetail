import { useDateRange } from "@/app/contexts/DateRangeContext";
import { FanLocationsMap } from "@/app/components/v2/FanLocationsMap";
import { calculateKPIData, calculateMerchandiseData, BASE_MERCHANDISE, ROI_REDIRECT_RATE, ROI_CONVERSION_RATE, ROI_AVG_ORDER_VALUE } from "@/app/utils/dataCalculations";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingBag, X, HelpCircle, ThumbsUp, AlertCircle, QrCode, BarChart2, Percent, ArrowUpRight } from "lucide-react";
import { getTeamLogo } from "@/app/utils/teamLogos";
import { useState } from "react";
import { format, subDays } from "date-fns";
import { createPortal } from "react-dom";

interface SurveyOverviewV2Props {
  viewMode: 'roi' | 'survey' | 'satisfaction' | 'location';
  setViewMode: (mode: 'roi' | 'survey' | 'satisfaction' | 'location') => void;
}

export function SurveyOverviewV2({ viewMode, setViewMode }: SurveyOverviewV2Props) {
  const { getDayCount, isCurrentDay, dateRange } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const calculatedData = calculateKPIData(daysInRange, isTodayView);
  const [showModal, setShowModal] = useState(false);

  // ROI derived values
  const totalRedirects = Math.round(calculatedData.totalSurveys * ROI_REDIRECT_RATE);
  const totalConversions = Math.round(totalRedirects * ROI_CONVERSION_RATE);
  const avgOrderValue = ROI_AVG_ORDER_VALUE;
  const totalROI = totalConversions * avgOrderValue;
  const conversionRate = Math.round((totalConversions / Math.max(1, totalRedirects)) * 100);

  // Generate chart data based on date range
  const generateChartData = () => {
    const missingPercentage = calculatedData.itemsMissing / calculatedData.totalSurveys;

    // ROI mode
    if (viewMode === 'roi') {
      if (daysInRange === 1) {
        const hours = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'];
        const currentHourIndex = isTodayView ? 9 : hours.length - 1;
        const hourlyPatterns = [5, 6, 7, 12, 14, 13, 10, 8, 11, 9, 6, 4];
        return hours.map((hour, i) => {
          if (isTodayView && i > currentHourIndex) return { id: `roi-h-${i}`, label: hour, surveys: 0, conversions: 0 };
          const surveys = hourlyPatterns[i];
          const redirects = Math.round(surveys * ROI_REDIRECT_RATE);
          const conversions = Math.round(redirects * ROI_CONVERSION_RATE);
          return { id: `roi-h-${i}`, label: hour, surveys, conversions };
        });
      } else {
        const days = [];
        const dailyAverage = Math.round(calculatedData.totalSurveys / daysInRange);
        for (let i = daysInRange - 1; i >= 0; i--) {
          const date = subDays(dateRange.to, i);
          const variation = 0.7 + Math.random() * 0.6;
          const surveys = Math.round(dailyAverage * variation);
          const conversions = Math.round(surveys * ROI_REDIRECT_RATE * ROI_CONVERSION_RATE);
          days.push({ id: `roi-d-${i}`, label: format(date, 'M/d'), surveys, conversions });
        }
        return days;
      }
    }

    // Satisfaction mode: Show percentage data
    if (viewMode === 'satisfaction') {
      // Single day view: Show hourly data
      if (daysInRange === 1) {
        const hours = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'];
        const currentHourIndex = isTodayView ? 9 : hours.length - 1;

        return hours.map((hour, i) => {
          if (isTodayView && i > currentHourIndex) {
            return {
              id: `sat-hour-${i}`,
              label: hour,
              engagement: 0,
              satisfaction: 0,
            };
          }

          // Generate realistic percentages with DIFFERENT variations for each metric
          const baseEngagement = calculatedData.staffContact;
          const baseSatisfaction = calculatedData.staffSatisfaction;
          const engagementVariation = 0.85 + Math.random() * 0.3; // Wider variation for engagement
          const satisfactionVariation = 0.95 + Math.random() * 0.1; // Tighter variation for satisfaction

          return {
            id: `sat-hour-${i}`,
            label: hour,
            engagement: Math.round(baseEngagement * engagementVariation),
            satisfaction: Math.round(baseSatisfaction * satisfactionVariation),
          };
        });
      }

      // Multiple days view: Show daily data
      else {
        const days = [];

        for (let i = daysInRange - 1; i >= 0; i--) {
          const date = subDays(dateRange.to, i);
          const dateLabel = format(date, 'M/d');

          // Add DIFFERENT variations for each metric to make them distinct
          const baseEngagement = calculatedData.staffContact;
          const baseSatisfaction = calculatedData.staffSatisfaction;
          const engagementVariation = 0.85 + Math.random() * 0.3; // Wider variation for engagement
          const satisfactionVariation = 0.95 + Math.random() * 0.1; // Tighter variation for satisfaction

          days.push({
            id: `sat-day-${daysInRange - 1 - i}`,
            label: dateLabel,
            engagement: Math.round(baseEngagement * engagementVariation),
            satisfaction: Math.round(baseSatisfaction * satisfactionVariation),
          });
        }

        return days;
      }
    }

    // Survey mode: Show count data (original logic)
    // Single day view: Show hourly data
    if (daysInRange === 1) {
      const hours = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'];
      const hourlyPatterns = [5, 6, 7, 12, 14, 13, 10, 8, 11, 9, 6, 4];

      // If viewing "Today", assume it's currently 6 PM (index 9 in the array)
      // Only show data up to the current hour
      const currentHourIndex = isTodayView ? 9 : hours.length - 1; // 6PM is at index 9

      return hours.map((hour, i) => {
        // For future hours (after current time), show 0 data
        if (isTodayView && i > currentHourIndex) {
          return {
            id: `survey-hour-${i}`,
            label: hour,
            surveys: 0,
            missingItems: 0,
          };
        }

        const surveys = hourlyPatterns[i];
        const missingItems = Math.round(surveys * missingPercentage);

        return {
          id: `survey-hour-${i}`,
          label: hour,
          surveys,
          missingItems,
        };
      });
    }

    // Multiple days view: Show daily data
    else {
      const days = [];
      const dailyAverage = Math.round(calculatedData.totalSurveys / daysInRange);

      for (let i = daysInRange - 1; i >= 0; i--) {
        const date = subDays(dateRange.to, i);
        const dateLabel = format(date, 'M/d'); // Show date for all multi-day ranges (2/10, 2/11, etc)

        // Add some variation to make it realistic (+/- 30%)
        const variation = 0.7 + Math.random() * 0.6;
        const surveys = Math.round(dailyAverage * variation);
        const missingItems = Math.round(surveys * missingPercentage);

        days.push({
          id: `survey-day-${daysInRange - 1 - i}`,
          label: dateLabel,
          surveys,
          missingItems,
        });
      }

      return days;
    }
  };

  const chartData = generateChartData();

  // Always calculate total surveys from survey data (not satisfaction data)
  // This ensures the count is consistent regardless of view mode
  const surveyData = (() => {
    const missingPercentage = calculatedData.itemsMissing / calculatedData.totalSurveys;

    if (daysInRange === 1) {
      const hours = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'];
      const hourlyPatterns = [5, 6, 7, 12, 14, 13, 10, 8, 11, 9, 6, 4];
      const currentHourIndex = isTodayView ? 9 : hours.length - 1;

      return hours.map((hour, i) => {
        if (isTodayView && i > currentHourIndex) {
          return { label: hour, surveys: 0, missingItems: 0 };
        }
        const surveys = hourlyPatterns[i];
        const missingItems = Math.round(surveys * missingPercentage);
        return { label: hour, surveys, missingItems };
      });
    } else {
      const days = [];
      const dailyAverage = Math.round(calculatedData.totalSurveys / daysInRange);

      for (let i = daysInRange - 1; i >= 0; i--) {
        const date = subDays(dateRange.to, i);
        const dateLabel = format(date, 'M/d');
        // Add some variation to make it realistic (+/- 30%)
        const variation = 0.7 + Math.random() * 0.6;
        const surveys = Math.round(dailyAverage * variation);
        const missingItems = Math.round(surveys * missingPercentage);
        days.push({ label: dateLabel, surveys, missingItems });
      }
      return days;
    }
  })();

  const actualTotalSurveys = surveyData.reduce((sum, item) => sum + item.surveys, 0);
  const actualMissingItems = surveyData.reduce((sum, item) => sum + item.missingItems, 0);

  // Calculate merchandise data to match actualMissingItems
  const itemsToShow = (isTodayView || daysInRange === 1) ? 5 : daysInRange <= 7 ? 10 : 15;
  const baseItems = BASE_MERCHANDISE.slice(0, itemsToShow);
  const baseTotal = baseItems.reduce((sum, item) => sum + item.count, 0);

  // Scale each item proportionally so the total equals actualMissingItems
  const merchandiseData = baseItems.map(item => ({
    ...item,
    count: Math.max(1, Math.round((item.count / baseTotal) * actualMissingItems)),
    revenue: `$${Math.round((item.revenue / baseTotal) * actualMissingItems * 50).toLocaleString()}`, // Assume ~$50 avg per item
  }));

  return (
    <>
      <div className="backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-3 border-b border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1e293b]">
                {viewMode === 'roi' ? 'Total Survey ROI' : viewMode === 'survey' ? 'Survey Response Overview' : viewMode === 'satisfaction' ? 'Associate Performance Overview' : 'Fan Locations'}
              </h2>
              {viewMode === 'roi' && (
                <p className="text-xs text-slate-500 mt-0.5">Online Sales Conversions from Survey Redirects</p>
              )}
              {viewMode === 'location' && (
                <p className="text-xs text-slate-500 mt-0.5">Survey response origins</p>
              )}
              <p className="text-sm text-slate-600 mt-1">
                {format(dateRange.from, 'MMM d, yyyy')} - {format(dateRange.to, 'MMM d, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Toggle Button */}
              <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-1 shadow-sm">
                <div className="flex items-center rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('roi')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      viewMode === 'roi'
                        ? 'bg-[#16a34a] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ROI
                  </button>
                  <button
                    onClick={() => setViewMode('survey')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      viewMode === 'survey'
                        ? 'bg-[#111827] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Missing
                  </button>
                  <button
                    onClick={() => setViewMode('satisfaction')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      viewMode === 'satisfaction'
                        ? 'bg-[#111827] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Satisfaction
                  </button>
                  <button
                    onClick={() => setViewMode('location')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      viewMode === 'location'
                        ? 'bg-[#111827] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Location
                  </button>
                </div>
              </div>

              {/* Survey Count */}
              <Users size={20} className="text-[#0076CE]" />
              <span className="text-2xl font-black text-[#333333]">
                {actualTotalSurveys.toLocaleString()}
              </span>
              <span className="text-sm text-gray-600">Surveys</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {viewMode === 'roi' ? (
            <div>
              {/* ROI Stat Cards */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <DollarSign size={14} className="text-[#16a34a]" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Converted Sales</span>
                  </div>
                  <div className="text-2xl font-black text-[#16a34a]">${totalROI.toLocaleString()}</div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1"><ArrowUpRight size={11} className="text-[#16a34a]" />Online revenue attributed</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <QrCode size={14} className="text-[#111827]" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Redirects</span>
                  </div>
                  <div className="text-2xl font-black text-[#111827]">{totalRedirects.toLocaleString()}</div>
                  <div className="text-xs text-slate-500 mt-1">QR scans from survey</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Percent size={14} className="text-[#1e3a5f]" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Avg Conversion</span>
                  </div>
                  <div className="text-2xl font-black text-[#1e3a5f]">{conversionRate}%</div>
                  <div className="text-xs text-slate-500 mt-1">Redirects → purchases</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BarChart2 size={14} className="text-[#9CA3AF]" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Avg Order Value</span>
                  </div>
                  <div className="text-2xl font-black text-[#333333]">${avgOrderValue}</div>
                  <div className="text-xs text-slate-500 mt-1">Per converted sale</div>
                </div>
              </div>

              {/* ROI Performance Chart */}
              <div className="mb-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#111111]" /><span className="text-xs text-slate-600">Surveys</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#16a34a]" /><span className="text-xs text-slate-600">Conversions</span></div>
                </div>
                <ResponsiveContainer width="100%" height={175}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#666' }} axisLine={{ stroke: '#e0e0e0' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={{ stroke: '#e0e0e0' }} />
                    <Tooltip
                      contentStyle={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="surveys" fill="#111111" radius={[4, 4, 0, 0]} name="Total Surveys" />
                    <Bar dataKey="conversions" fill="#16a34a" radius={[4, 4, 0, 0]} name="Conversions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : viewMode === 'location' ? (
            <FanLocationsMap totalSurveys={actualTotalSurveys} />
          ) : (
            // Bar Chart View
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                  domain={viewMode === 'satisfaction' ? [0, 100] : undefined}
                />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: any, name: string) => {
                    if (viewMode === 'satisfaction') {
                      return [`${value}%`, name];
                    }
                    return [value, name];
                  }}
                />
                {viewMode === 'survey' ? (
                  <>
                    <Bar dataKey="surveys" fill="#111111" radius={[4, 4, 0, 0]} name="Total Surveys" />
                    <Bar dataKey="missingItems" fill="#A8A9AD" radius={[4, 4, 0, 0]} name="Missing Items" />
                  </>
                ) : (
                  <>
                    <Bar dataKey="engagement" fill="#111111" radius={[4, 4, 0, 0]} name="Associate Engagement" />
                    <Bar dataKey="satisfaction" fill="#1e3a5f" radius={[4, 4, 0, 0]} name="Associate Satisfaction" />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          )}

          <div className={`grid grid-cols-2 gap-4 ${viewMode === 'roi' ? 'hidden' : 'mt-6'}`}>
            {viewMode === 'survey' ? (
              <>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm">
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign size={16} className="text-[#0076CE]" />
                      <span className="text-sm font-medium text-[#333333]">Revenue Loss</span>
                      <div className="group relative">
                        <HelpCircle size={14} className="text-slate-400 cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                          Estimated revenue lost from unfulfilled customer requests for out-of-stock merchandise.
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-[#9CA3AF] mb-1">
                      ${calculatedData.potentialRevenueLoss.toLocaleString()}
                    </div>
                    <div className="text-xs text-[#0076CE]">Missing merchandise</div>
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm cursor-pointer hover:bg-white/70 transition-colors" onClick={() => setShowModal(true)}>
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ShoppingBag size={16} className="text-[#0076CE]" />
                      <span className="text-sm font-medium text-[#333333]">Items Missing</span>
                      <div className="group relative" onClick={(e) => e.stopPropagation()}>
                        <HelpCircle size={14} className="text-slate-400 cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                          Total number of customer requests for items that were out of stock.
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-[#9CA3AF] mb-1">
                      {actualMissingItems.toLocaleString()}
                    </div>
                    <div className="text-xs text-[#0076CE]">Unfulfilled requests</div>
                  </div>
                </div>
              </>
            ) : viewMode === 'satisfaction' ? (
              <>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm">
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ThumbsUp size={16} className="text-[#0076CE]" />
                      <span className="text-sm font-medium text-[#333333]">Associate Satisfaction</span>
                      <div className="group relative">
                        <HelpCircle size={14} className="text-slate-400 cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                          Percentage of customers who rated their associate interaction as positive.
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-[#22c55e] mb-1">
                      {calculatedData.staffSatisfaction}%
                    </div>
                    <div className="text-xs text-[#0076CE]">+2% vs yesterday</div>
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm">
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={16} className="text-[#0076CE]" />
                      <span className="text-sm font-medium text-[#333333]">Associate Engagement</span>
                      <div className="group relative">
                        <HelpCircle size={14} className="text-slate-400 cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                          Percentage of customers who were greeted or assisted by a store associate.
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-[#22c55e] mb-1">
                      {calculatedData.staffContact}%
                    </div>
                    <div className="text-xs text-[#0076CE]">+5% vs yesterday</div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Modal - using Portal to render outside component tree */}
      {showModal && createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6" onClick={() => setShowModal(false)}>
          <div className="bg-gradient-to-r from-[#111827]/40 to-[#6B7280]/40 rounded-xl p-[1px] max-w-5xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden h-full">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#333333]">Missing Merchandise - Full Report</h2>
                  <p className="text-sm text-gray-500 mt-1">Complete list of out-of-stock items for selected date range</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-3">
                  {merchandiseData.map((item, index) => {
                    const logo = getTeamLogo(item.team);

                    return (
                      <div key={index} className="bg-gradient-to-r from-[#111827]/40 to-[#6B7280]/40 rounded-lg p-[1px]">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                          <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-1">
                            {logo ? (
                              <img src={logo} alt={item.team} className="w-full h-full object-contain" />
                            ) : (
                              <div className="text-[10px] font-bold text-gray-400">NHL</div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-[#333333] truncate">{item.team}</div>
                            <div className="text-xs text-gray-600 truncate">{item.item} - {item.gender} ({item.size})</div>
                            <div className="text-xs text-gray-500">Age: {item.age}</div>
                          </div>

                          <div className="text-right">
                            <div className="font-black text-[#9CA3AF] text-lg">{item.count}</div>
                            <div className="text-xs text-gray-500">requests</div>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-[#333333] text-sm">{item.revenue}</div>
                            <div className="text-xs text-gray-500">potential</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
