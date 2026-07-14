import { FileText, DollarSign, Package, Users, Star, AlertTriangle, HelpCircle } from "lucide-react";
import { useDateRange } from "@/app/contexts/DateRangeContext";
import { calculateKPIData } from "@/app/utils/dataCalculations";

const kpiConfig = [
  {
    key: "totalSurveys",
    title: "Total Surveys",
    change: "+12.5%",
    changePositive: true,
    subtitle: "Surveys This Period",
    icon: FileText,
    iconColor: "text-[#009EDB]",
    iconBg: "bg-gray-100",
    tooltip: "Total number of customer surveys completed during this period",
    valueColor: "text-[#008000]",
  },
  {
    key: "potentialRevenueLoss",
    title: "Revenue Loss",
    change: "-8.2%",
    changePositive: true,
    subtitle: "Loss This Period",
    icon: DollarSign,
    iconColor: "text-[#009EDB]",
    iconBg: "bg-gray-100",
    tooltip: "Estimated revenue loss from out-of-stock items and customer dissatisfaction",
    valueColor: "text-[#D8282B]",
  },
  {
    key: "itemsMissing",
    title: "Items Missing",
    change: "+18",
    changePositive: false,
    subtitle: "Items Reported",
    icon: Package,
    iconColor: "text-[#009EDB]",
    iconBg: "bg-gray-100",
    tooltip: "Number of items customers reported as out of stock or unavailable",
    valueColor: "text-[#D8282B]",
  },
  {
    key: "staffContact",
    title: "Associate Engagement",
    change: "+5.3%",
    changePositive: true,
    subtitle: "Of All Customers",
    icon: Users,
    iconColor: "text-[#009EDB]",
    iconBg: "bg-gray-100",
    tooltip: "Percentage of customers who interacted with store staff during their visit",
    valueColor: "text-[#008000]",
  },
  {
    key: "staffSatisfaction",
    title: "Associate Satisfaction",
    change: "+2.1%",
    changePositive: true,
    subtitle: "Average Rating",
    icon: Star,
    iconColor: "text-[#009EDB]",
    iconBg: "bg-gray-100",
    tooltip: "Average customer satisfaction rating for staff interactions and service quality",
    valueColor: "text-[#008000]",
  },
  {
    key: "friction",
    title: "Friction",
    change: "-3.4%",
    changePositive: true,
    subtitle: "Difficult Experiences",
    icon: AlertTriangle,
    iconColor: "text-[#009EDB]",
    iconBg: "bg-gray-100",
    tooltip: "Percentage of customers reporting difficulties or frustrations during their store visit",
    valueColor: "text-[#D8282B]",
  },
];

export function KPICards() {
  const { getDayCount, isCurrentDay } = useDateRange();
  const daysInRange = getDayCount();
  const isTodayView = isCurrentDay();
  const calculatedData = calculateKPIData(daysInRange, isTodayView);

  return (
    <div className="grid grid-cols-3 gap-4">
      {kpiConfig.map((kpi, index) => {
        const Icon = kpi.icon;
        const value = calculatedData[kpi.key as keyof typeof calculatedData];

        // Format display value
        let displayValue: string;
        if (kpi.key === "potentialRevenueLoss") {
          displayValue = `$${value.toLocaleString()}`;
        } else if (kpi.key === "staffContact" || kpi.key === "staffSatisfaction" || kpi.key === "friction") {
          displayValue = `${value}%`;
        } else {
          displayValue = value.toLocaleString();
        }

        return (
          <div
            key={index}
            className="bg-white border-2 border-gray-200 border-l-4 border-l-[#0076CE] transition-all duration-200 group relative overflow-hidden shadow-sm hover:shadow-xl"
            style={{ borderRadius: '8px' }}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 group-hover:scale-110 transition-transform">
                    <Icon size={16} className={kpi.iconColor} strokeWidth={2.5} />
                  </div>
                  <p className="text-xs font-black text-[#0076CE] uppercase tracking-wider">{kpi.title}</p>
                </div>
                <div className="group/tooltip relative">
                  <HelpCircle size={14} className="text-gray-400 cursor-help hover:text-[#BC0022] transition-colors" />
                  <div className="invisible group-hover/tooltip:visible absolute right-0 top-6 w-56 bg-gray-900 text-white text-xs p-3 z-10 shadow-xl" style={{ borderRadius: '6px' }}>
                    {kpi.tooltip}
                    <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              </div>

              <div>
                <p className={`text-xl font-black ${kpi.valueColor} mb-0.5`}>{displayValue}</p>
                <p className="text-xs text-[#333333]">{kpi.subtitle}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}