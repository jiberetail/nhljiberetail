// ROI constants — shared across all components that compute survey ROI
export const ROI_REDIRECT_RATE = 0.56;   // 56% of surveys → QR redirect
export const ROI_CONVERSION_RATE = 0.85; // 85% of redirects → purchase
export const ROI_AVG_ORDER_VALUE = 247;  // avg online order value in dollars

// Base data for 30 days (used as reference)
const BASE_DAYS = 30;
const BASE_TOTAL_SURVEYS = 2847;
const BASE_ITEMS_MISSING = 1609;
const DAILY_REVENUE_LOSS = 3470;

// Base breakdown data for 30 days
const BASE_BREAKDOWN = [
  { label: "Checkout process was difficult", percentage: 18, count: 512 },
  { label: "Checkout wait time was too long", percentage: 34, count: 968 },
  { label: "Needed assistance but didn't receive any", percentage: 15, count: 427 },
  { label: "Staff was unfriendly", percentage: 8, count: 228 },
  { label: "Could not find what they wanted", percentage: 42, count: 1196 },
  { label: "Abandoned Surveys", percentage: 11, count: 313 },
];

// Base merchandise data for 30 days
export const BASE_MERCHANDISE = [
  { team: "New York Rangers", item: "Jersey (Home)", gender: "Male", age: "25-34", size: "L", count: 87, revenue: 23140 },
  { team: "New York Rangers", item: "Cap (Fitted)", gender: "Male", age: "18-24", size: "7 1/4", count: 64, revenue: 5680 },
  { team: "New York Islanders", item: "Jersey (Away)", gender: "Male", age: "35-44", size: "XL", count: 52, revenue: 13840 },
  { team: "Boston Bruins", item: "Hoodie", gender: "Female", age: "25-34", size: "M", count: 43, revenue: 7630 },
  { team: "Los Angeles Kings", item: "Jersey (Home)", gender: "Male", age: "25-34", size: "L", count: 38, revenue: 10120 },
  { team: "New York Rangers", item: "Jacket (Bomber)", gender: "Male", age: "35-44", size: "XL", count: 35, revenue: 11650 },
  { team: "Chicago Blackhawks", item: "Jersey (Home)", gender: "Male", age: "45-54", size: "L", count: 29, revenue: 7720 },
  { team: "New York Islanders", item: "Cap (Adjustable)", gender: "Female", age: "18-24", size: "OS", count: 27, revenue: 1800 },
  { team: "New York Rangers", item: "T-Shirt (Vintage)", gender: "Male", age: "25-34", size: "M", count: 24, revenue: 2130 },
  { team: "Washington Capitals", item: "Jersey (Alternate)", gender: "Male", age: "25-34", size: "L", count: 22, revenue: 5860 },
  { team: "Philadelphia Flyers", item: "Hoodie", gender: "Male", age: "18-24", size: "L", count: 19, revenue: 3370 },
  { team: "San Jose Sharks", item: "Cap (Fitted)", gender: "Male", age: "35-44", size: "7 1/2", count: 18, revenue: 1600 },
  { team: "Toronto Maple Leafs", item: "Jersey (Home)", gender: "Male", age: "25-34", size: "XL", count: 16, revenue: 4260 },
  { team: "New York Rangers", item: "Polo Shirt", gender: "Male", age: "45-54", size: "L", count: 15, revenue: 2330 },
  { team: "Dallas Stars", item: "Jersey (Alternate)", gender: "Male", age: "35-44", size: "L", count: 14, revenue: 3730 },
];

export function calculateKPIData(days: number, isToday: boolean = false) {
  // Today shows partial day data (assume ~55% of a full day's data at this time)
  const partialDayFactor = 0.55;
  let scaleFactor = days / BASE_DAYS;

  // If viewing "Today", reduce the scale factor to show partial day
  if (isToday) {
    scaleFactor = partialDayFactor / BASE_DAYS;
  }

  const totalSurveys = Math.round(BASE_TOTAL_SURVEYS * scaleFactor);
  const itemsMissing = Math.round(BASE_ITEMS_MISSING * scaleFactor);

  // For "Today", show partial revenue loss. For other days, show full calculation
  const potentialRevenueLoss = isToday
    ? Math.round(DAILY_REVENUE_LOSS * partialDayFactor)
    : DAILY_REVENUE_LOSS * days;

  // Percentages vary based on range and whether it's today
  const staffContact = isToday ? 75 : days === 1 ? 72 : days <= 7 ? 70 : 68;
  const staffSatisfaction = isToday ? 88 : days === 1 ? 86 : days <= 7 ? 85 : 84;
  const friction = isToday ? 18 : days === 1 ? 20 : days <= 7 ? 21 : 23;

  return {
    totalSurveys,
    itemsMissing,
    potentialRevenueLoss,
    staffContact,
    staffSatisfaction,
    friction,
  };
}

export function calculateBreakdownData(days: number, isToday: boolean = false) {
  const partialDayFactor = 0.55;
  let scaleFactor = days / BASE_DAYS;

  if (isToday) {
    scaleFactor = partialDayFactor / BASE_DAYS;
  }

  const totalSurveys = Math.round(BASE_TOTAL_SURVEYS * scaleFactor);

  return BASE_BREAKDOWN.map(item => ({
    ...item,
    count: Math.round((item.percentage / 100) * totalSurveys),
  }));
}

export function calculateMerchandiseData(days: number, isToday: boolean = false, customPartialFactor?: number) {
  const partialDayFactor = customPartialFactor !== undefined ? customPartialFactor : 0.55;
  let scaleFactor = days / BASE_DAYS;

  if (isToday) {
    scaleFactor = partialDayFactor / BASE_DAYS;
  }

  // For shorter periods, show fewer items (top items)
  const itemsToShow = (isToday || days === 1) ? 5 : days <= 7 ? 10 : 15;

  return BASE_MERCHANDISE.slice(0, itemsToShow).map(item => ({
    ...item,
    count: Math.max(1, Math.round(item.count * scaleFactor)),
    revenue: `$${Math.round(item.revenue * scaleFactor).toLocaleString()}`,
  }));
}

export function calculateQuickInsights(days: number, isToday: boolean = false) {
  const partialDayFactor = 0.55;
  let scaleFactor = days / BASE_DAYS;

  if (isToday) {
    scaleFactor = partialDayFactor / BASE_DAYS;
  }

  // Most unfulfilled item count scales with days
  const rangersJerseyCount = Math.round(87 * scaleFactor);

  return {
    mostUnfulfilledItem: {
      value: "Rangers Jersey (Home)",
      subtitle: `Requested ${rangersJerseyCount} times`,
    },
    dailyRevenueLoss: {
      value: `$${DAILY_REVENUE_LOSS.toLocaleString()}`,
      subtitle: "Due to out-of-stock items",
    },
    mostActivePodium: {
      value: "O-Zone Kiosk",
      subtitle: "Most customer interactions",
    },
    estimatedDailyRevenueLoss: {
      value: `$${DAILY_REVENUE_LOSS.toLocaleString()}`,
      subtitle: "Due to out-of-stock items",
    },
    peakFrictionTime: {
      value: isToday ? "2-4 PM" : days === 1 ? "2-4 PM" : "2-4 PM Weekdays",
      subtitle: isToday ? "Highest complaint period" : days === 1 ? "Highest complaint period" : "Highest complaint period",
    },
  };
}
