import { KPICards } from "@/app/components/KPICards";
import { QuickInsights } from "@/app/components/QuickInsights";
import { SurveyBreakdown } from "@/app/components/SurveyBreakdown";
import { MerchandiseTracker } from "@/app/components/MerchandiseTracker";
import { DateRangePicker } from "@/app/components/DateRangePicker";
import { OutOfStockTicker } from "@/app/components/OutOfStockTicker";

export function Dashboard() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[900px]">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-[#333333]">Customer Survey Analytics</h1>
              <p className="text-sm text-[#009EDB] mt-1.5 font-medium">NHL Shop NYC Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <DateRangePicker />
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* KPI Cards */}
          <div>
            <h2 className="text-xl font-black text-[#333333] mb-4">Survey Results</h2>
            <KPICards />
          </div>

          {/* Out of Stock Ticker */}
          <OutOfStockTicker />

          {/* Quick Insights */}
          <QuickInsights />

          {/* Survey Breakdown */}
          <SurveyBreakdown />

          {/* Merchandise Tracker */}
          <MerchandiseTracker />
        </div>
      </div>
    </div>
  );
}