import { TrendingUp, FileText, DollarSign, Package, Users, Star, AlertTriangle } from "lucide-react";
import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateKPIData } from "@/app/utils/dataCalculations";

export function KPICardsV2() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const calculatedData = calculateKPIData(daysInRange, isTodayView);

  const metrics = [
    {
      label: "Staff Contact",
      value: `${calculatedData.staffContact}%`,
      icon: Users,
      change: "+3.4%",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Items Missing",
      value: calculatedData.itemsMissing.toLocaleString(),
      icon: Package,
      change: "-5.1%",
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Friction Points",
      value: `${calculatedData.friction}%`,
      icon: AlertTriangle,
      change: "-4.3%",
      color: "from-red-500 to-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className="bg-[#252f3f] rounded-xl p-5 border border-gray-700/50">
            <div className="flex items-start justify-between mb-4">
              <div className={`bg-gradient-to-br ${metric.color} p-3 rounded-lg`}>
                <Icon size={20} className="text-white" strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp size={12} className="text-green-400" />
                <span className="text-green-400 font-medium">{metric.change}</span>
              </div>
            </div>

            <div className="text-2xl font-black text-white mb-1">
              {metric.value}
            </div>

            <div className="text-sm text-gray-400">
              {metric.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
