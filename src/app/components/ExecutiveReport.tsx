import { X, Download, TrendingUp, AlertTriangle, DollarSign, Users, CheckCircle, XCircle, QrCode, ShoppingBag, Percent } from "lucide-react";
import { ROI_REDIRECT_RATE, ROI_CONVERSION_RATE, ROI_AVG_ORDER_VALUE, calculateKPIData } from "@/app/utils/dataCalculations";
import { exportReportPdf } from "@/app/utils/exportReportPdf";
import { format } from "date-fns";
import { useRef } from "react";
import nhlLogo from "../../imports/NHL-league-logo.png";
import jibeRetailLogo from "../../imports/jibe-retail-official-logo.png";
import worldMap from "figma:asset/63ce3284c798e57a28c3e1a993ddad3ef10f97ba.png";

type DateRange = {
  from: Date;
  to: Date;
};

type ExecutiveReportProps = {
  dateRange: DateRange;
  onClose: () => void;
  isModal?: boolean;
};

const generateReportData = (dateRange: DateRange) => {
  const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const kpi = calculateKPIData(days, false);
  const totalSurveys = kpi.totalSurveys;
  const abandonedSurveys = Math.round(totalSurveys * 0.04);
  const completedSurveys = totalSurveys - abandonedSurveys;

  const interactedWithAssociate = Math.floor(totalSurveys * 0.78);
  const satisfiedWithAssociate = Math.floor(interactedWithAssociate * 0.89);

  // Base location data with percentages
  const BASE_LOCATIONS = [
    { country: "United States", city: "New York", baseCount: 892, basePercentage: 66.2, coordinates: { x: 30, y: 42 } },
    { country: "United States", city: "New Jersey", baseCount: 187, basePercentage: 13.9, coordinates: { x: 30.5, y: 42.5 } },
    { country: "Canada", city: "Toronto", baseCount: 94, basePercentage: 7.0, coordinates: { x: 28, y: 38 } },
    { country: "United Kingdom", city: "London", baseCount: 52, basePercentage: 3.9, coordinates: { x: 50, y: 33 } },
    { country: "Japan", city: "Tokyo", baseCount: 38, basePercentage: 2.8, coordinates: { x: 88, y: 40 } },
    { country: "Mexico", city: "Mexico City", baseCount: 29, basePercentage: 2.2, coordinates: { x: 22, y: 50 } },
    { country: "Australia", city: "Sydney", baseCount: 21, basePercentage: 1.6, coordinates: { x: 87, y: 75 } },
    { country: "Germany", city: "Berlin", baseCount: 18, basePercentage: 1.3, coordinates: { x: 53, y: 32 } },
    { country: "France", city: "Paris", baseCount: 15, basePercentage: 1.1, coordinates: { x: 51, y: 35 } },
  ];

  // Scale location counts based on totalSurveys
  const baseTotalVisitors = BASE_LOCATIONS.reduce((sum, loc) => sum + loc.baseCount, 0);
  const customerLocations = BASE_LOCATIONS.map(location => {
    const scaledCount = Math.round((location.baseCount / baseTotalVisitors) * totalSurveys);
    return {
      country: location.country,
      city: location.city,
      count: scaledCount,
      percentage: location.basePercentage,
      coordinates: location.coordinates
    };
  });

  // ROI calculations — consistent with dashboard
  const totalRedirects = Math.round(totalSurveys * ROI_REDIRECT_RATE);
  const totalConversions = Math.round(totalRedirects * ROI_CONVERSION_RATE);
  const totalROI = totalConversions * ROI_AVG_ORDER_VALUE;
  const overallConversionRate = Math.round((totalConversions / Math.max(1, totalRedirects)) * 100);

  // Merchandise category ROI breakdown
  const merchCategories = [
    { category: "Jerseys — Home", redirectShare: 0.28, convRate: 0.91, aov: 265, icon: "🏒" },
    { category: "Jerseys — Away / Alt.", redirectShare: 0.19, convRate: 0.87, aov: 225, icon: "🏒" },
    { category: "Hoodies & Sweatshirts", redirectShare: 0.16, convRate: 0.83, aov: 138, icon: "👕" },
    { category: "Fitted & Snapback Caps", redirectShare: 0.17, convRate: 0.80, aov: 48, icon: "🧢" },
    { category: "Jackets & Outerwear", redirectShare: 0.09, convRate: 0.91, aov: 312, icon: "🧥" },
    { category: "T-Shirts & Polos", redirectShare: 0.07, convRate: 0.77, aov: 42, icon: "👕" },
    { category: "Accessories & Other", redirectShare: 0.04, convRate: 0.72, aov: 35, icon: "🎽" },
  ].map(m => {
    const redirects = Math.round(totalRedirects * m.redirectShare);
    const conversions = Math.round(redirects * m.convRate);
    const revenue = conversions * m.aov;
    return { ...m, redirects, conversions, revenue, pct: Math.round((revenue / Math.max(1, totalROI)) * 100) };
  });

  // Team ROI breakdown — top 8 teams
  const teamROI = [
    { team: "NY Rangers", item: "Panarin #10 Home Jersey", redirects: Math.round(totalRedirects * 0.22), convRate: 0.92, aov: 265 },
    { team: "NY Islanders", item: "Barzal #13 Away Jersey", redirects: Math.round(totalRedirects * 0.14), convRate: 0.88, aov: 225 },
    { team: "Boston Bruins", item: "Pastrnak #88 Home Jersey", redirects: Math.round(totalRedirects * 0.11), convRate: 0.86, aov: 225 },
    { team: "Washington Capitals", item: "Ovechkin #8 Alt. Jersey", redirects: Math.round(totalRedirects * 0.09), convRate: 0.85, aov: 250 },
    { team: "NY Rangers", item: "Track Jacket", redirects: Math.round(totalRedirects * 0.08), convRate: 0.90, aov: 312 },
    { team: "Chicago Blackhawks", item: "Toews #19 Retro Jersey", redirects: Math.round(totalRedirects * 0.07), convRate: 0.84, aov: 220 },
    { team: "Tampa Bay Lightning", item: "Kucherov #86 Home Jersey", redirects: Math.round(totalRedirects * 0.06), convRate: 0.83, aov: 215 },
    { team: "NJ Devils", item: "Hughes #86 Home Jersey", redirects: Math.round(totalRedirects * 0.05), convRate: 0.82, aov: 210 },
  ].map(t => {
    const conversions = Math.round(t.redirects * t.convRate);
    const revenue = conversions * t.aov;
    return { ...t, conversions, revenue };
  });

  return {
    totalSurveys,
    completedSurveys,
    roiData: { totalRedirects, totalConversions, totalROI, overallConversionRate, merchCategories, teamROI },
    abandonedSurveys,
    interactedWithAssociate,
    satisfiedWithAssociate,
    customerFeedback: {
      couldNotFindMerchandise: Math.floor(totalSurveys * 0.33),
      checkoutProcessDifficult: Math.floor(totalSurveys * 0.09),
      waitTimeTooLong: Math.floor(totalSurveys * 0.18),
      didNotReceiveAssistance: Math.floor(totalSurveys * 0.12),
      associateUnfriendly: Math.floor(totalSurveys * 0.08),
    },
    outOfStock: {
      totalReported: 242,
      totalRevenueLoss: 28250.00,
      topItems: [
        { item: "Rangers Home Jersey (Panarin #10)", size: "L", reports: 17, unitPrice: 250.00, loss: 4250.00 },
        { item: "Islanders Away Jersey (Barzal #13)", size: "XL", reports: 19, unitPrice: 200.00, loss: 3800.00 },
        { item: "Bruins Home Jersey (Pastrnak #88)", size: "M", reports: 18, unitPrice: 200.00, loss: 3600.00 },
        { item: "Rangers Track Jacket", size: "XL", reports: 12, unitPrice: 275.00, loss: 3300.00 },
        { item: "Blackhawks Retro Jersey (Toews #19)", size: "L", reports: 14, unitPrice: 220.00, loss: 3080.00 },
      ]
    },
    abandonedSurveyBreakdown: [
      { screen: "Welcome Screen", count: 8, avgTime: "0:12" },
      { screen: "Initial Questions", count: 12, avgTime: "0:38" },
      { screen: "Team Selection", count: 5, avgTime: "0:45" },
      { screen: "Merchandise Search", count: 15, avgTime: "1:22" },
      { screen: "Associate Rating", count: 9, avgTime: "1:05" },
      { screen: "Email Submission", count: 8, avgTime: "1:48" },
    ],
    customerLocations,
    referralSources: [
      { name: "Source 1", description: "Walk-ins", count: 412, percentage: 30.6 },
      { name: "Source 2", description: "Social", count: 356, percentage: 26.4 },
      { name: "Source 3", description: "Subway Ads", count: 198, percentage: 14.7 },
      { name: "Source 4", description: "Time Square Billboard Ads", count: 167, percentage: 12.4 },
      { name: "Source 5", description: "Email", count: 89, percentage: 6.6 },
      { name: "Source 6", description: "Penn Station", count: 67, percentage: 5.0 },
      { name: "Source 7", description: "Airport Ads", count: 45, percentage: 3.3 },
      { name: "Source 8", description: "Wfan", count: 34, percentage: 2.5 },
      { name: "Source 9", description: "Playbill", count: 28, percentage: 2.1 },
      { name: "Source 10", description: "City Guide", count: 22, percentage: 1.6 },
      { name: "Source 11", description: "LIRR", count: 18, percentage: 1.3 },
      { name: "Source 12", description: "Taxi Toppers", count: 15, percentage: 1.1 },
      { name: "Source 13", description: "Commercial", count: 12, percentage: 0.9 },
      { name: "Source 14", description: "Other", count: 24, percentage: 1.8 },
    ]
  };
};

export function ExecutiveReport({ dateRange, onClose, isModal }: ExecutiveReportProps) {
  const data = generateReportData(dateRange);
  const reportRef = useRef<HTMLDivElement>(null);

  const associateEngagementRate = ((data.interactedWithAssociate / data.totalSurveys) * 100);
  const associateSatisfactionRate = ((data.satisfiedWithAssociate / data.interactedWithAssociate) * 100);
  const completionRate = ((data.completedSurveys / data.totalSurveys) * 100);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      await exportReportPdf({
        element: reportRef.current,
        title: "Executive Report",
        fileName: `NHL_Executive_Report_${format(dateRange.from, "yyyy-MM-dd")}_to_${format(dateRange.to, "yyyy-MM-dd")}.pdf`,
      });
    } catch (error) {
      console.error('PDF Error:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleEmail = () => {
    const subject = `NHL Shop NYC Flagship - Executive Report (${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")})`;
    const body = `Please find the Executive Report for the period ${format(dateRange.from, "MMMM d, yyyy")} to ${format(dateRange.to, "MMMM d, yyyy")}.`;

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (isModal === false) {
    return (
      <div className="w-full">
        <button onClick={handleDownloadPDF} data-report-download style={{ display: 'none' }} />
        <button onClick={handleEmail} data-report-email style={{ display: 'none' }} />

        <div className="px-6 py-6">
          <div ref={reportRef} className="nhl-report-document" style={{
            backgroundColor: '#ffffff',
            padding: '48px',
            fontFamily: "'Roboto Condensed', 'Arial Narrow', Arial, sans-serif",
            color: '#1f2937',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <img src={nhlLogo} alt="NHL" style={{ height: '64px' }} />
                <img src={jibeRetailLogo} alt="Jibe Retail" style={{ height: '90px' }} />
              </div>
              <div style={{
                borderLeft: '6px solid #c7a447',
                paddingLeft: '24px',
                marginBottom: '24px'
              }}>
                <h1 style={{
                  fontSize: '42px',
                  fontWeight: '900',
                  color: '#111827',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.5px'
                }}>
                  Executive Report
                </h1>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', margin: 0 }}>
                  NHL Shop NYC Flagship Store Customer Survey Analysis
                </p>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Report Period
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '900', color: '#111827', margin: 0 }}>
                    {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Generated
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#475569', margin: 0 }}>
                    {format(new Date(), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>

            {/* ── ROI SECTION ── */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #07111b 0%, #0a4f7c 50%, #0a4f7c 100%)',
                padding: '20px 24px',
                borderRadius: '12px 12px 0 0',
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', margin: 0, letterSpacing: '0.5px' }}>
                  💰 Survey ROI Analysis — Online Sales Conversions
                </h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', margin: '4px 0 0 0', fontWeight: '600' }}>
                  Revenue generated when customers follow survey QR codes to purchase out-of-stock items online
                </p>
              </div>
              <div style={{ border: '2px solid #bfdbfe', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '32px', background: '#ffffff' }}>

                {/* Hero Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '28px' }}>
                  {[
                    { label: 'Total ROI', value: `$${data.roiData.totalROI.toLocaleString()}`, sub: 'Online revenue attributed', bg: 'linear-gradient(135deg, #07111b 0%, #0a4f7c 100%)', light: false },
                    { label: 'QR Redirects', value: data.roiData.totalRedirects.toLocaleString(), sub: 'Customers sent online', bg: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)', light: false },
                    { label: 'Conversion Rate', value: `${data.roiData.overallConversionRate}%`, sub: 'Redirects → purchases', bg: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', light: true },
                    { label: 'Avg Order Value', value: `$${ROI_AVG_ORDER_VALUE}`, sub: 'Per converted sale', bg: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', light: true },
                  ].map((s, i) => (
                    <div key={i} style={{ background: s.bg, borderRadius: '10px', padding: '16px', textAlign: 'center', border: s.light ? '2px solid #e2e8f0' : 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <p style={{ fontSize: '10px', fontWeight: '800', color: s.light ? '#64748b' : 'rgba(255,255,255,0.8)', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{s.label}</p>
                      <p style={{ fontSize: '28px', fontWeight: '900', color: s.light ? '#111827' : '#ffffff', margin: '0', lineHeight: '1' }}>{s.value}</p>
                      <p style={{ fontSize: '11px', fontWeight: '600', color: s.light ? '#94a3b8' : 'rgba(255,255,255,0.7)', margin: '6px 0 0 0' }}>{s.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Conversion Funnel */}
                <div style={{ marginBottom: '28px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '2px solid #bfdbfe', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#07111b', margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Conversion Funnel</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {[
                      { label: 'Total Surveys', value: data.totalSurveys.toLocaleString(), pct: '100%', w: '100%', color: '#1e3a5f' },
                      { label: 'QR Redirects', value: data.roiData.totalRedirects.toLocaleString(), pct: `${Math.round((data.roiData.totalRedirects / data.totalSurveys) * 100)}%`, w: `${(data.roiData.totalRedirects / data.totalSurveys) * 100}%`, color: '#2563eb' },
                      { label: 'Conversions', value: data.roiData.totalConversions.toLocaleString(), pct: `${Math.round((data.roiData.totalConversions / data.totalSurveys) * 100)}%`, w: `${(data.roiData.totalConversions / data.totalSurveys) * 100}%`, color: '#0a4f7c' },
                    ].map((step, i) => (
                      <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ position: 'relative', height: '40px', background: '#e2e8f0', borderRadius: i === 0 ? '6px 0 0 6px' : i === 2 ? '0 6px 6px 0' : '0', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: step.w, background: step.color, borderRadius: 'inherit' }} />
                          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <span style={{ fontSize: '15px', fontWeight: '900', color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{step.value}</span>
                          </div>
                        </div>
                        <p style={{ fontSize: '11px', fontWeight: '700', color: '#374151', margin: '6px 0 1px 0' }}>{step.label}</p>
                        <p style={{ fontSize: '10px', fontWeight: '600', color: '#6b7280', margin: 0 }}>{step.pct} of surveys</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ROI by Merchandise Category */}
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ROI by Merchandise Category
                  </h3>
                  <div style={{ border: '2px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                      <colgroup>
                        <col style={{ width: '26%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '11%' }} />
                        <col style={{ width: '11%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '14%' }} />
                        <col style={{ width: '18%' }} />
                      </colgroup>
                      <thead>
                        <tr style={{ background: 'linear-gradient(to right, #07111b, #0a4f7c)' }}>
                          {['Category', 'Redirects', 'Conversions', 'Conv. Rate', 'Avg Order', 'Revenue', '% of ROI'].map(h => (
                            <th key={h} style={{ padding: '10px 10px', textAlign: h === 'Category' ? 'left' : 'right', fontSize: '10px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.roiData.merchCategories.map((m, idx) => (
                          <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: idx < data.roiData.merchCategories.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                            <td style={{ padding: '10px', fontSize: '12px', fontWeight: '700', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {m.icon} {m.category}
                            </td>
                            <td style={{ padding: '10px', fontSize: '12px', fontWeight: '600', color: '#475569', textAlign: 'right' }}>{m.redirects}</td>
                            <td style={{ padding: '10px', fontSize: '12px', fontWeight: '700', color: '#1e293b', textAlign: 'right' }}>{m.conversions}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                              <span style={{ background: '#dbeafe', color: '#0a4f7c', padding: '2px 7px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>
                                {Math.round(m.convRate * 100)}%
                              </span>
                            </td>
                            <td style={{ padding: '10px', fontSize: '12px', fontWeight: '600', color: '#475569', textAlign: 'right' }}>${m.aov}</td>
                            <td style={{ padding: '10px', fontSize: '13px', fontWeight: '900', color: '#0a4f7c', textAlign: 'right' }}>${m.revenue.toLocaleString()}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                                <div style={{ width: '40px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${m.pct}%`, background: 'linear-gradient(to right, #07111b, #167cb4)', borderRadius: '3px' }} />
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#374151' }}>{m.pct}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr style={{ background: 'linear-gradient(to right, #1e293b, #334155)' }}>
                          <td style={{ padding: '10px', fontSize: '12px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Total</td>
                          <td style={{ padding: '10px', fontSize: '12px', fontWeight: '900', color: '#ffffff', textAlign: 'right' }}>{data.roiData.totalRedirects}</td>
                          <td style={{ padding: '10px', fontSize: '12px', fontWeight: '900', color: '#ffffff', textAlign: 'right' }}>{data.roiData.totalConversions}</td>
                          <td style={{ padding: '10px', fontSize: '12px', fontWeight: '900', color: '#e2c36b', textAlign: 'right' }}>{data.roiData.overallConversionRate}%</td>
                          <td style={{ padding: '10px', fontSize: '12px', fontWeight: '900', color: '#ffffff', textAlign: 'right' }}>${ROI_AVG_ORDER_VALUE}</td>
                          <td style={{ padding: '10px', fontSize: '13px', fontWeight: '900', color: '#e2c36b', textAlign: 'right' }}>${data.roiData.totalROI.toLocaleString()}</td>
                          <td style={{ padding: '10px', fontSize: '12px', fontWeight: '900', color: '#ffffff', textAlign: 'right' }}>100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ROI by Team */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Top Teams by Online Conversion Revenue
                  </h3>
                  <div style={{ border: '2px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                      <colgroup>
                        <col style={{ width: '4%' }} />
                        <col style={{ width: '18%' }} />
                        <col style={{ width: '30%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '11%' }} />
                        <col style={{ width: '11%' }} />
                        <col style={{ width: '16%' }} />
                      </colgroup>
                      <thead>
                        <tr style={{ background: 'linear-gradient(to right, #07111b, #0a4f7c)' }}>
                          {['#', 'Team', 'Top Item', 'Redirects', 'Conversions', 'Rate', 'Revenue'].map(h => (
                            <th key={h} style={{ padding: '10px 10px', textAlign: h === 'Team' || h === 'Top Item' || h === '#' ? 'left' : 'right', fontSize: '10px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.roiData.teamROI.sort((a, b) => b.revenue - a.revenue).map((t, idx) => (
                          <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: idx < data.roiData.teamROI.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                            <td style={{ padding: '10px', fontSize: '12px', fontWeight: '900', color: idx < 3 ? '#0a4f7c' : '#94a3b8' }}>#{idx + 1}</td>
                            <td style={{ padding: '10px', fontSize: '12px', fontWeight: '800', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.team}</td>
                            <td style={{ padding: '10px', fontSize: '11px', fontWeight: '600', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.item}</td>
                            <td style={{ padding: '10px', fontSize: '12px', fontWeight: '600', color: '#475569', textAlign: 'right' }}>{t.redirects}</td>
                            <td style={{ padding: '10px', fontSize: '12px', fontWeight: '700', color: '#1e293b', textAlign: 'right' }}>{t.conversions}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                              <span style={{ background: '#dbeafe', color: '#0a4f7c', padding: '2px 7px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>
                                {Math.round(t.convRate * 100)}%
                              </span>
                            </td>
                            <td style={{ padding: '10px', fontSize: '13px', fontWeight: '900', color: '#0a4f7c', textAlign: 'right' }}>${t.revenue.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ROI Narrative */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '2px solid #93c5fd', borderRadius: '12px', padding: '24px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '800', color: '#0a4f7c', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>💡 Key Insight</p>
                    <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#0a4f7c', margin: 0 }}>
                      Jerseys (Home + Away) account for the majority of redirected items and generate the highest per-conversion revenue.
                      Ensuring NHL.com deep-links remain accurate and fast-loading for jersey SKUs will directly protect conversion rates.
                    </p>
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '2px solid #93c5fd', borderRadius: '12px', padding: '24px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '800', color: '#1e3a5f', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📈 Opportunity</p>
                    <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#1e3a5f', margin: 0 }}>
                      Caps & Hats have a high redirect volume but the lowest average order value ($48).
                      Bundling hat redirects with suggested jersey or hoodie pairings could significantly lift revenue per QR scan.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Survey Findings */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #111827 0%, #0a4f7c 100%)',
                padding: '20px 24px',
                borderRadius: '12px 12px 0 0',
                marginBottom: '0'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '0.5px'
                }}>
                  📊 Survey Findings
                </h2>
              </div>
              <div style={{
                border: '2px solid #e2e8f0',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                padding: '32px',
                background: '#ffffff'
              }}>
                {/* Overview */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Overview
                  </h3>
                  <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#475569', margin: 0 }}>
                    The survey data reveals strong customer engagement with a {completionRate.toFixed(1)}% completion rate.
                    However, {((data.customerFeedback.couldNotFindMerchandise / data.totalSurveys) * 100).toFixed(1)}% of customers
                    reported being unable to find desired merchandise, presenting a significant revenue recovery opportunity.
                  </p>
                </div>

                {/* Critical Findings */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Critical Findings
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '16px',
                      background: '#fef2f2',
                      borderLeft: '4px solid #6B7280',
                      borderRadius: '6px'
                    }}>
                      <span style={{ fontSize: '20px', flexShrink: 0 }}>⚠️</span>
                      <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', margin: 0 }}>
                        <strong style={{ color: '#1e293b' }}>Out-of-Stock Crisis:</strong> {data.outOfStock.totalReported} items reported unavailable,
                        resulting in ${data.outOfStock.totalRevenueLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })} in lost revenue
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '16px',
                      background: '#fef2f2',
                      borderLeft: '4px solid #6B7280',
                      borderRadius: '6px'
                    }}>
                      <span style={{ fontSize: '20px', flexShrink: 0 }}>🛒</span>
                      <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', margin: 0 }}>
                        <strong style={{ color: '#1e293b' }}>Customer Service Gaps:</strong> {data.customerFeedback.didNotReceiveAssistance} customers
                        ({((data.customerFeedback.didNotReceiveAssistance / data.totalSurveys) * 100).toFixed(1)}%) needed assistance but didn't receive it
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '16px',
                      background: '#fff7ed',
                      borderLeft: '4px solid #f97316',
                      borderRadius: '6px'
                    }}>
                      <span style={{ fontSize: '20px', flexShrink: 0 }}>⏱️</span>
                      <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', margin: 0 }}>
                        <strong style={{ color: '#1e293b' }}>Wait Time Issues:</strong> {data.customerFeedback.waitTimeTooLong} customers
                        ({((data.customerFeedback.waitTimeTooLong / data.totalSurveys) * 100).toFixed(1)}%) reported excessive wait times
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommended Actions */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Recommended Actions
                  </h3>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '14px',
                      background: '#eff6ff',
                      borderRadius: '6px'
                    }}>
                      <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>✓</span>
                      <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#475569', margin: 0 }}>
                        <strong style={{ color: '#0a4f7c' }}>Inventory Priority:</strong> Immediately restock top 5 missing items (Rangers jerseys, Islanders jerseys, team caps)
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '14px',
                      background: '#eff6ff',
                      borderRadius: '6px'
                    }}>
                      <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>✓</span>
                      <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#475569', margin: 0 }}>
                        <strong style={{ color: '#0a4f7c' }}>Staffing Optimization:</strong> Increase floor coverage during peak hours to reduce wait times and improve assistance availability
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '14px',
                      background: '#eff6ff',
                      borderRadius: '6px'
                    }}>
                      <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>✓</span>
                      <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#475569', margin: 0 }}>
                        <strong style={{ color: '#0a4f7c' }}>Process Improvement:</strong> Streamline checkout process to address the {data.customerFeedback.checkoutProcessDifficult} customer complaints
                      </p>
                    </div>
                  </div>
                </div>

                {/* Revenue Recovery Potential */}
                <div style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  border: '2px solid #2385bd',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '13px', fontWeight: '800', color: '#167cb4', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Estimated Revenue Recovery Potential
                  </p>
                  <p style={{ fontSize: '48px', fontWeight: '900', color: '#047857', margin: '0', lineHeight: '1' }}>
                    ${data.outOfStock.totalRevenueLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p style={{ fontSize: '13px', color: '#167cb4', margin: '8px 0 0 0', fontWeight: '600' }}>
                    Available through inventory optimization and restocking
                  </p>
                </div>
              </div>
            </div>

            {/* Survey Overview */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #111827 0%, #0a4f7c 100%)',
                padding: '20px 24px',
                borderRadius: '12px 12px 0 0'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '0.5px'
                }}>
                  📈 Survey Overview
                </h2>
              </div>
              <div style={{
                border: '2px solid #e2e8f0',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                padding: '32px',
                background: '#ffffff'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    padding: '28px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Total Surveys
                    </p>
                    <p style={{ fontSize: '56px', fontWeight: '900', color: '#ffffff', margin: '0', lineHeight: '1' }}>
                      {data.totalSurveys}
                    </p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #2385bd 0%, #167cb4 100%)',
                    padding: '28px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Completed Surveys
                    </p>
                    <p style={{ fontSize: '56px', fontWeight: '900', color: '#ffffff', margin: '0 0 8px 0', lineHeight: '1' }}>
                      {data.completedSurveys}
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                      {completionRate.toFixed(1)}% completion rate
                    </p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    padding: '28px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Abandoned Surveys
                    </p>
                    <p style={{ fontSize: '56px', fontWeight: '900', color: '#ffffff', margin: '0 0 8px 0', lineHeight: '1' }}>
                      {data.abandonedSurveys}
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                      {((data.abandonedSurveys / data.totalSurveys) * 100).toFixed(1)}% abandonment rate
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Associate Engagement */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #111827 0%, #0a4f7c 100%)',
                padding: '20px 24px',
                borderRadius: '12px 12px 0 0'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '0.5px'
                }}>
                  👥 Associate Engagement
                </h2>
              </div>
              <div style={{
                border: '2px solid #e2e8f0',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                padding: '32px',
                background: '#ffffff'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '28px',
                    background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)'
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: '800', color: '#64748b', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Customer Engagement Rate
                    </p>
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ fontSize: '52px', fontWeight: '900', color: '#111827', margin: '0', lineHeight: '1' }}>
                        {associateEngagementRate.toFixed(1)}%
                      </p>
                      <p style={{ fontSize: '14px', color: '#64748b', margin: '8px 0 0 0', fontWeight: '600' }}>
                        {data.interactedWithAssociate} of {data.totalSurveys} customers engaged with an associate
                      </p>
                    </div>
                    <div style={{ height: '12px', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${associateEngagementRate}%`,
                        background: 'linear-gradient(to right, #111827, #0a4f7c)',
                        borderRadius: '6px'
                      }} />
                    </div>
                  </div>

                  <div style={{
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '28px',
                    background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)'
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: '800', color: '#64748b', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Associate Satisfaction Rate
                    </p>
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ fontSize: '52px', fontWeight: '900', color: '#2385bd', margin: '0', lineHeight: '1' }}>
                        {associateSatisfactionRate.toFixed(1)}%
                      </p>
                      <p style={{ fontSize: '14px', color: '#64748b', margin: '8px 0 0 0', fontWeight: '600' }}>
                        {data.satisfiedWithAssociate} of {data.interactedWithAssociate} satisfied with service
                      </p>
                    </div>
                    <div style={{ height: '12px', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${associateSatisfactionRate}%`,
                        background: 'linear-gradient(to right, #2385bd, #167cb4)',
                        borderRadius: '6px'
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Feedback Breakdown */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #111827 0%, #0a4f7c 100%)',
                padding: '20px 24px',
                borderRadius: '12px 12px 0 0'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '0.5px'
                }}>
                  💬 Customer Feedback Breakdown
                </h2>
              </div>
              <div style={{
                border: '2px solid #e2e8f0',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                padding: '32px',
                background: '#ffffff'
              }}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    { label: 'Could not find the merchandise they wanted', count: data.customerFeedback.couldNotFindMerchandise, color: '#6B7280' },
                    { label: 'Checkout process was difficult', count: data.customerFeedback.checkoutProcessDifficult, color: '#dc2626' },
                    { label: 'Wait time was too long', count: data.customerFeedback.waitTimeTooLong, color: '#ea580c' },
                    { label: 'Did not receive needed assistance', count: data.customerFeedback.didNotReceiveAssistance, color: '#f59e0b' },
                    { label: 'Associate was unfriendly', count: data.customerFeedback.associateUnfriendly, color: '#facc15' },
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px 24px',
                      border: '2px solid #f1f5f9',
                      borderRadius: '10px',
                      background: '#fafafa',
                      transition: 'all 0.2s'
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
                          {item.label}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ flex: 1, maxWidth: '400px' }}>
                            <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%',
                                width: `${(item.count / data.totalSurveys) * 100}%`,
                                backgroundColor: item.color,
                                borderRadius: '5px'
                              }} />
                            </div>
                          </div>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', margin: 0, minWidth: '80px' }}>
                            {((item.count / data.totalSurveys) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div style={{
                        minWidth: '80px',
                        textAlign: 'right',
                        paddingLeft: '24px'
                      }}>
                        <p style={{ fontSize: '32px', fontWeight: '900', color: item.color, margin: '0', lineHeight: '1' }}>
                          {item.count}
                        </p>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', margin: '4px 0 0 0', textTransform: 'uppercase' }}>
                          Reports
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Out of Stock */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #6B7280 0%, #c7a447 100%)',
                padding: '20px 24px',
                borderRadius: '12px 12px 0 0'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '0.5px'
                }}>
                  📦 Out of Stock Analysis
                </h2>
              </div>
              <div style={{
                border: '2px solid #e2e8f0',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                padding: '32px',
                background: '#ffffff'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)',
                    border: '2px solid #fecaca',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: '800', color: '#991b1b', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Total Out of Stock Items Reported
                    </p>
                    <p style={{ fontSize: '52px', fontWeight: '900', color: '#6B7280', margin: '0', lineHeight: '1' }}>
                      {data.outOfStock.totalReported}
                    </p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)',
                    border: '2px solid #fecaca',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: '800', color: '#991b1b', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Total Revenue Loss
                    </p>
                    <p style={{ fontSize: '52px', fontWeight: '900', color: '#6B7280', margin: '0', lineHeight: '1' }}>
                      ${data.outOfStock.totalRevenueLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Top 5 Reported Missing Items
                </h3>
                <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'linear-gradient(to right, #1e293b, #334155)' }}>
                        <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item</th>
                        <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '12px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Size</th>
                        <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '12px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reports</th>
                        <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '12px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unit Price</th>
                        <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '12px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Revenue Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.outOfStock.topItems.map((item, idx) => (
                        <tr key={idx} style={{
                          backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          borderBottom: idx === data.outOfStock.topItems.length - 1 ? 'none' : '1px solid #e2e8f0'
                        }}>
                          <td style={{ padding: '18px 20px', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{item.item}</td>
                          <td style={{ padding: '18px 20px', fontSize: '14px', fontWeight: '600', color: '#475569', textAlign: 'center' }}>{item.size}</td>
                          <td style={{ padding: '18px 20px', fontSize: '16px', fontWeight: '900', color: '#6B7280', textAlign: 'center' }}>{item.reports}</td>
                          <td style={{ padding: '18px 20px', fontSize: '14px', fontWeight: '700', color: '#475569', textAlign: 'right' }}>${item.unitPrice.toFixed(2)}</td>
                          <td style={{ padding: '18px 20px', fontSize: '16px', fontWeight: '900', color: '#6B7280', textAlign: 'right' }}>${item.loss.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Abandoned Surveys */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                padding: '20px 24px',
                borderRadius: '12px 12px 0 0'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '0.5px'
                }}>
                  ⚡ Abandoned Surveys
                </h2>
              </div>
              <div style={{
                border: '2px solid #e2e8f0',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                padding: '32px',
                background: '#ffffff'
              }}>
                <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'linear-gradient(to right, #1e293b, #334155)' }}>
                        <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Screen</th>
                        <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '12px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Abandonment Count</th>
                        <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '12px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Time on Screen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.abandonedSurveyBreakdown.map((item, idx) => (
                        <tr key={idx} style={{
                          backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          borderBottom: idx === data.abandonedSurveyBreakdown.length - 1 ? 'none' : '1px solid #e2e8f0'
                        }}>
                          <td style={{ padding: '18px 20px', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{item.screen}</td>
                          <td style={{ padding: '18px 20px', fontSize: '16px', fontWeight: '900', color: '#f97316', textAlign: 'center' }}>{item.count}</td>
                          <td style={{ padding: '18px 20px', fontSize: '14px', fontWeight: '600', color: '#475569', textAlign: 'center' }}>{item.avgTime}</td>
                        </tr>
                      ))}
                      <tr style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
                        <td style={{ padding: '16px 20px', fontSize: '15px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Total Abandoned</td>
                        <td style={{ padding: '16px 20px', fontSize: '18px', fontWeight: '900', color: '#ffffff', textAlign: 'center' }}>
                          {data.abandonedSurveyBreakdown.reduce((sum, item) => sum + item.count, 0)}
                        </td>
                        <td style={{ padding: '16px 20px' }}></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Customer Locations */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                padding: '20px 24px',
                borderRadius: '12px 12px 0 0'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '0.5px'
                }}>
                  🌍 Customer Locations
                </h2>
              </div>
              <div style={{
                border: '2px solid #e2e8f0',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                padding: '32px',
                background: '#ffffff'
              }}>
                {/* World Map Visualization */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Global Customer Distribution
                  </h3>
                  <div style={{
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid #e2e8f0',
                    background: '#ffffff',
                    padding: '40px'
                  }}>
                    {/* World Map Image */}
                    <div style={{ position: 'relative', width: '100%' }}>
                      <img
                        src={worldMap}
                        alt="World Map"
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block'
                        }}
                      />
                    </div>

                    {/* Legend */}
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      background: 'rgba(255,255,255,0.95)',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6B7280' }}></div>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>Customer Locations</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Data Breakdown */}
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Top Customer Origins
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  {data.customerLocations.map((location, idx) => (
                    <div key={idx} style={{
                      background: idx === 0 ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' : '#f8fafc',
                      border: idx === 0 ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '16px',
                    }}>
                      <div style={{ marginBottom: '8px' }}>
                        <p style={{ fontSize: '13px', fontWeight: '800', color: '#64748b', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          #{idx + 1}
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: '900', color: '#1e293b', margin: '0 0 2px 0' }}>
                          {location.city}
                        </p>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', margin: 0 }}>
                          {location.country}
                        </p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '12px' }}>
                        <p style={{ fontSize: '24px', fontWeight: '900', color: idx === 0 ? '#3b82f6' : '#6366f1', margin: 0, lineHeight: '1' }}>
                          {location.count}
                        </p>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', margin: 0 }}>
                          {location.percentage}%
                        </p>
                      </div>
                      <div style={{ marginTop: '8px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${location.percentage}%`,
                          background: idx === 0 ? 'linear-gradient(to right, #3b82f6, #2563eb)' : 'linear-gradient(to right, #6366f1, #4f46e5)',
                          borderRadius: '3px'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* How Customers Heard About Us */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #2385bd 0%, #0a4f7c 100%)',
                padding: '20px 24px',
                borderRadius: '12px 12px 0 0'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '0.5px'
                }}>
                  📢 How Customers Heard About Us
                </h2>
              </div>
              <div style={{
                border: '2px solid #e2e8f0',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                padding: '32px',
                background: '#ffffff'
              }}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {data.referralSources.map((source, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px 24px',
                      border: '2px solid #f1f5f9',
                      borderRadius: '10px',
                      background: idx < 3 ? 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' : '#fafafa'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            background: 'linear-gradient(135deg, #2385bd 0%, #0a4f7c 100%)',
                            color: '#ffffff',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '900',
                            letterSpacing: '0.5px',
                            marginRight: '10px'
                          }}>
                            {source.name}
                          </span>
                          <span style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>
                            {source.description}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ flex: 1, maxWidth: '400px' }}>
                            <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%',
                                width: `${source.percentage}%`,
                                background: 'linear-gradient(to right, #2385bd, #0a4f7c)',
                                borderRadius: '5px'
                              }} />
                            </div>
                          </div>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', margin: 0, minWidth: '60px' }}>
                            {source.percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div style={{
                        minWidth: '90px',
                        textAlign: 'right',
                        paddingLeft: '24px'
                      }}>
                        <p style={{ fontSize: '32px', fontWeight: '900', color: '#2385bd', margin: '0', lineHeight: '1' }}>
                          {source.count}
                        </p>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', margin: '4px 0 0 0', textTransform: 'uppercase' }}>
                          Customers
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Stats */}
                <div style={{
                  marginTop: '32px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    border: '2px solid #bfdbfe',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: '800', color: '#07111b', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Top Referral Source
                    </p>
                    <p style={{ fontSize: '18px', fontWeight: '900', color: '#0a4f7c', margin: 0 }}>
                      {data.referralSources[0].description}
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#2385bd', margin: '4px 0 0 0' }}>
                      {data.referralSources[0].count} customers ({data.referralSources[0].percentage}%)
                    </p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    border: '2px solid #bfdbfe',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: '800', color: '#07111b', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Total Sources Tracked
                    </p>
                    <p style={{ fontSize: '32px', fontWeight: '900', color: '#0a4f7c', margin: 0, lineHeight: '1' }}>
                      {data.referralSources.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              marginTop: '48px',
              paddingTop: '24px',
              borderTop: '2px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                This report is confidential and intended for internal use only. © {new Date().getFullYear()} NHL Shop NYC Flagship Store
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal mode (used for quick preview/download)
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '1400px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '2px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1e293b', margin: 0 }}>
            Executive Report
          </h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleDownloadPDF}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Download size={16} />
              Download PDF
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={24} color="#64748b" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px'
        }}>
          {/* Render the same content as page mode */}
          <div ref={reportRef} className="nhl-report-document" style={{
            backgroundColor: '#ffffff',
            padding: '48px',
            fontFamily: "'Roboto Condensed', 'Arial Narrow', Arial, sans-serif",
            color: '#1f2937',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Same content as page mode - copy from above */}
          </div>
        </div>
      </div>
    </div>
  );
}
