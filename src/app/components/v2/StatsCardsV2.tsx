export function StatsCardsV2() {
  const stats = [
    {
      label: "Business Costs",
      items: [
        { name: "Travel Costs", value: "4.9k", detail: "28.3%", bars: [0.3, 0.5, 0.4, 0.6] },
        { name: "Saving Monthly", value: "2.5k", detail: "42.2%", bars: [0.5, 0.7, 0.6, 0.8] },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6">
      <div className="mb-6">
        <div className="text-lg font-bold text-[#333333] mb-4">Business Costs</div>

        <div className="space-y-6">
          {/* Travel Costs */}
          <div>
            <div className="flex items-end justify-between mb-2">
              <div className="text-sm text-gray-500">Travel Costs</div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 items-end h-6">
                  {[0.4, 0.5, 0.6, 0.7, 0.5, 0.6].map((height, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gray-300 rounded-t"
                      style={{ height: `${height * 100}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-2xl font-black text-[#333333]">4.9k</div>
            <div className="text-xs text-gray-400">28.3%</div>
          </div>

          {/* Saving Monthly */}
          <div>
            <div className="flex items-end justify-between mb-2">
              <div className="text-sm text-gray-500">Saving Monthly</div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 items-end h-6">
                  {[0.5, 0.6, 0.7, 0.8, 0.6, 0.7].map((height, i) => (
                    <div
                      key={i}
                      className="w-1 bg-[#333333] rounded-t"
                      style={{ height: `${height * 100}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-2xl font-black text-[#333333]">2.5k</div>
            <div className="text-xs text-gray-400">42.2%</div>
          </div>
        </div>
      </div>

      {/* Bottom section with pill badges */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-black text-[#333333]">$0.8</div>
          <div className="text-xs text-gray-400">29k</div>
        </div>

        <div className="flex gap-2">
          {['29', '30', '31'].map((day, i) => (
            <div
              key={i}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                i === 0
                  ? 'bg-[#333333] text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2 text-[10px] text-gray-400">
          <span>M</span>
          <span>T</span>
          <span>W</span>
        </div>
      </div>
    </div>
  );
}
