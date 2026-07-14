import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateKPIData } from "@/app/utils/dataCalculations";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { format, subDays } from "date-fns";

export function HealthImprovementChartV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const calculatedData = calculateKPIData(daysInRange, isTodayView);

  // Generate multi-day data
  const generateChartData = () => {
    const data = [];
    const daysToShow = 4; // Show 4 days like in the reference

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayName = format(date, 'EEEE');

      // Generate hourly data for each day
      for (let hour = 0; hour < 24; hour++) {
        data.push({
          day: dayName,
          hour,
          surveys: Math.floor(Math.random() * 50) + 30,
          missing: Math.floor(Math.random() * 30) + 10,
          friction: Math.floor(Math.random() * 20) + 5,
        });
      }
    }

    return data;
  };

  const chartData = generateChartData();

  return (
    <div className="bg-[#1a1a1a] rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#D8282B] rounded-sm"></div>
          <h2 className="text-base font-bold text-[#333333]">Survey Analytics</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[#D8282B] text-white text-xs font-bold px-3 py-1.5 rounded-full">
            -3.5%
          </span>
          <span className="bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full">
            Week
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorSurveys" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorMissing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorFriction" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D8282B" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#D8282B" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis
            dataKey="hour"
            stroke="#666"
            tick={{ fontSize: 11, fill: '#888' }}
            tickFormatter={(value) => value % 6 === 0 ? `${value}h` : ''}
          />
          <YAxis
            stroke="#666"
            tick={{ fontSize: 11, fill: '#888' }}
            tickFormatter={(value) => value}
          />
          <Tooltip
            contentStyle={{
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '12px',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Area
            type="monotone"
            dataKey="surveys"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorSurveys)"
          />
          <Area
            type="monotone"
            dataKey="missing"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#colorMissing)"
          />
          <Area
            type="monotone"
            dataKey="friction"
            stroke="#D8282B"
            strokeWidth={2}
            fill="url(#colorFriction)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Day labels */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        {['Saturday', 'Monday', 'Tuesday', 'Wednesday'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-400">
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}