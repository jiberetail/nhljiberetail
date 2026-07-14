import { createContext, useContext, useState, ReactNode } from "react";
import { subDays, startOfDay, endOfDay, differenceInDays, isToday } from "date-fns";

type DateRange = {
  from: Date;
  to: Date;
};

type DateRangeContextType = {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  getDayCount: () => number;
  isCurrentDay: () => boolean;
};

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfDay(subDays(new Date(), 29)),
    to: endOfDay(new Date()),
  });

  const getDayCount = () => {
    return differenceInDays(dateRange.to, dateRange.from) + 1;
  };

  const isCurrentDay = () => {
    // Check if we're viewing today (current day) - meaning from and to are both today
    return isToday(dateRange.from) && isToday(dateRange.to);
  };

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange, getDayCount, isCurrentDay }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
}