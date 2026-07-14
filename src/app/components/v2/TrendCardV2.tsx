import { BookmarkIcon } from "lucide-react";

export function TrendCardV2() {
  // Mock line chart data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const dataPoints = [
    { x: 0, y: 60 },
    { x: 1, y: 40 },
    { x: 2, y: 70 },
    { x: 3, y: 45 },
    { x: 4, y: 80 },
    { x: 5, y: 55 },
  ];

  // Create SVG path
  const createPath = () => {
    const width = 100;
    const height = 100;
    const points = dataPoints.map((point, i) => {
      const x = (i / (dataPoints.length - 1)) * width;
      const y = height - (point.y / 100) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="bg-gradient-to-br from-[#d8d8ca] to-[#c8c8ba] rounded-3xl p-6 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-white/20 rounded-full"></div>
      <div className="absolute top-20 right-16 w-16 h-16 bg-white/20 rounded-full"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 bg-white/20 rounded-full"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-[#333333]">Wow, Great!</div>
          <div className="bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium text-[#333333] flex items-center gap-1">
            <BookmarkIcon size={12} />
            Saving
          </div>
        </div>

        <div className="text-xs text-gray-600 mb-6">Saved $990</div>

        {/* Line chart */}
        <div className="relative h-32 mb-4">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="#333333" strokeWidth="0.2" opacity="0.2" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#333333" strokeWidth="0.2" opacity="0.2" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#333333" strokeWidth="0.2" opacity="0.2" />

            {/* Line path */}
            <path
              d={createPath()}
              fill="none"
              stroke="#333333"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Points */}
            {dataPoints.map((point, i) => {
              const x = (i / (dataPoints.length - 1)) * 100;
              const y = 100 - (point.y / 100) * 100;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2"
                  fill={i === 4 ? "#f4f49a" : "#333333"}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            {/* Highlight point with label */}
            <circle cx="66.67" cy="20" r="3" fill="#f4f49a" vectorEffect="non-scaling-stroke" />
            <text x="66.67" y="12" textAnchor="middle" fontSize="4" fill="#333333" fontWeight="bold">
              $990
            </text>
          </svg>
        </div>

        {/* Month labels */}
        <div className="flex justify-between">
          {months.map((month, i) => (
            <div key={i} className="text-[10px] text-gray-600 font-medium">
              {month}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
