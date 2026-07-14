import { useState } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

export function CalendarCardV2() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday

  // Mock data for active days
  const activeDays = [
    { day: 1, value: 12 },
    { day: 3, value: 9 },
    { day: 4, value: 10 },
    { day: 6, value: 8 },
  ];

  // Crypto values at bottom
  const cryptoData = [
    { time: "00", value: "0.34 BNB" },
    { time: "01", value: "1.8 SOL" },
    { time: "02", value: "0.09 BTC" },
    { time: "1.0", value: "1.2" },
    { time: "1.2", value: "2" },
  ];

  return (
    <div className="bg-gradient-to-br from-[#e8f4a4] to-[#f4f49a] rounded-3xl p-6">
      {/* Days of week */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar dates */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {Array.from({ length: 21 }, (_, i) => {
          const date = addDays(startDate, i);
          const dayNum = date.getDate();
          const isActive = activeDays.some(d => d.day === (i % 7) + 1);
          const activeData = activeDays.find(d => d.day === (i % 7) + 1);
          const isDisabled = i > 14;

          if (isDisabled) {
            return (
              <div key={i} className="aspect-square flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-black/5"></div>
              </div>
            );
          }

          return (
            <div key={i} className="aspect-square flex items-center justify-center">
              {isActive ? (
                <div className="w-full h-full bg-white rounded-xl flex flex-col items-center justify-center shadow-sm">
                  <div className="text-xs font-bold text-[#333333]">{activeData?.value}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">•</div>
                </div>
              ) : (
                <div className="text-sm font-medium text-gray-600">{String(dayNum).padStart(2, '0')}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Timeline at bottom */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-8 left-0 right-0 h-px bg-gray-400"></div>

        {/* Timeline markers */}
        <div className="flex justify-between items-end relative pb-4">
          {cryptoData.map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-1 h-8 bg-gray-400 mb-2"></div>
              <div className="text-[10px] font-medium text-gray-600">{item.time}</div>
            </div>
          ))}
        </div>

        {/* Crypto values */}
        <div className="flex justify-between mt-2">
          {["0.34 BNB", "1.8 SOL", "0.09 BTC", "0.8 ETH"].map((value, i) => (
            <div key={i} className="text-[10px] font-bold text-[#333333]">
              {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
