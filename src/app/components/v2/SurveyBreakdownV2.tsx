import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateBreakdownData } from "@/app/utils/dataCalculations";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function SurveyBreakdownV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const breakdownData = calculateBreakdownData(daysInRange, isTodayView);

  const chartData = breakdownData.map(item => ({
    name: item.label,
    value: item.percentage,
    count: item.count,
  }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="bg-[#252f3f] rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#333333]">Survey Response Breakdown</h2>
          <p className="text-sm text-gray-400 mt-1">Distribution of survey submission reasons</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            stroke="#4b5563"
          />
          <YAxis
            type="category"
            dataKey="name"
            width={160}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            stroke="#4b5563"
          />
          <Tooltip
            formatter={(value: number) => `${value}%`}
            contentStyle={{
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#fff'
            }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-5 gap-3 mt-6 pt-6 border-t border-gray-700/50">
        {breakdownData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <div className="min-w-0">
              <div className="text-xs text-gray-400 truncate">{item.label}</div>
              <div className="text-sm font-bold text-white">{item.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}