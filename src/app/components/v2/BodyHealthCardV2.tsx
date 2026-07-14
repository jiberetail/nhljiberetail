import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateKPIData } from "@/app/utils/dataCalculations";
import { MoreHorizontal } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function BodyHealthCardV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const calculatedData = calculateKPIData(daysInRange, isTodayView);

  return (
    <div className="bg-white rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#D8282B] rounded-sm"></div>
          <h2 className="text-base font-bold text-[#333333]">Store Health Tracking</h2>
        </div>
        <button className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
          <MoreHorizontal size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Main metric */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-500">Breathing</span>
          <span className="bg-[#D8282B] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            +0.2%
          </span>
        </div>
        <div className="flex items-end gap-2 mb-1">
          <div className="text-5xl font-black text-[#333333]">
            {calculatedData.staffSatisfaction}
          </div>
          <div className="text-lg font-medium text-gray-400 mb-2">/60h</div>
        </div>
        <div className="text-xs text-gray-500">20min</div>
      </div>

      {/* Illustration */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-48 h-48">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&q=80"
            alt="Health tracking"
            className="w-full h-full object-contain opacity-80"
          />
          {/* Dot indicator on body */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-4 h-4 bg-[#D8282B] rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-4 h-4 bg-[#D8282B] rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Dot pattern */}
      <div className="flex justify-center gap-1 mb-6">
        {['#f97316', '#3b82f6', '#10b981'].map((color, i) => (
          <div key={i} className="flex gap-0.5">
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        ))}
      </div>

      {/* Check items */}
      <div className="space-y-3 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#10b981] rounded-sm"></div>
            </div>
            <span className="text-sm text-[#333333]">60% Mammograms, 50% Colonoscopies</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex-shrink-0"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#10b981] rounded-sm"></div>
            </div>
            <span className="text-sm text-[#333333]">Breath Level is Normal 139/60h (3hrs)</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex-shrink-0"></div>
        </div>

        <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium text-[#333333]">Checking</div>
            <div className="w-1 h-1 bg-[#D8282B] rounded-full"></div>
            <div className="text-xs text-gray-600">70% Annual, 20% Biannual, 10% None</div>
          </div>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Plus size={16} className="text-[#333333]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Plus({ size, className }: { size: number; className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
