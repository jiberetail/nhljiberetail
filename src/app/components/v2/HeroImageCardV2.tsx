import { useDateRange } from "@/app/contexts/DateRangeContext";
import { format } from "date-fns";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function HeroImageCardV2() {
  const { dateRange } = useDateRange();

  // Generate small calendar
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const activeDays = [3, 5, 12, 18, 25]; // Sample active days

  return (
    <div className="bg-gradient-to-br from-[#D8282B] via-[#c72028] to-[#b01820] rounded-3xl p-6 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 opacity-40">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80"
          alt="Store"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10">
        {/* Month and indicator */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-white mb-1">
              {format(dateRange.from, 'MMMM')} <span className="text-white/60">Work</span>
            </h2>
            <div className="text-xs text-white/60">Survey Period Analytics</div>
          </div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>

        {/* Mini calendar */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4">
          <div className="grid grid-cols-7 gap-2 mb-3">
            {daysOfWeek.map((day, i) => (
              <div key={i} className="text-center text-[10px] font-medium text-white/60">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className="aspect-square flex items-center justify-center text-[10px] font-medium text-white/80"
              >
                {day <= 28 ? day : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 inline-flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <span className="text-sm font-medium text-white">Fitness Goals</span>
          </div>
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 inline-flex items-center gap-2 ml-3">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <span className="text-sm font-medium text-white">My Check-ups</span>
          </div>
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 inline-flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <span className="text-sm font-medium text-white">Body Mass (BM)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
