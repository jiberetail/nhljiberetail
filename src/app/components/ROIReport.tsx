import { useRef } from "react";
import { format } from "date-fns";
import { ROI_REDIRECT_RATE, ROI_CONVERSION_RATE, ROI_AVG_ORDER_VALUE, calculateKPIData } from "@/app/utils/dataCalculations";
import { exportReportPdf } from "@/app/utils/exportReportPdf";
import nhlLogo from "../../imports/NHL-league-logo.png";
import jibeRetailLogo from "figma:asset/c9ceb1471dccd073ec86737828ad56cc026ab66e.png";

type DateRange = { from: Date; to: Date };
type ROIReportProps = { dateRange: DateRange; onClose: () => void; isModal?: boolean };

const MERCH_CATEGORIES = [
  { category: "Jerseys — Home",          icon: "🏒", redirectShare: 0.28, convRate: 0.91, aov: 265 },
  { category: "Jerseys — Away / Alt.",   icon: "🏒", redirectShare: 0.19, convRate: 0.87, aov: 225 },
  { category: "Hoodies & Sweatshirts",   icon: "👕", redirectShare: 0.16, convRate: 0.83, aov: 138 },
  { category: "Fitted & Snapback Caps",  icon: "🧢", redirectShare: 0.17, convRate: 0.80, aov: 48  },
  { category: "Jackets & Outerwear",     icon: "🧥", redirectShare: 0.09, convRate: 0.91, aov: 312 },
  { category: "T-Shirts & Polos",        icon: "👕", redirectShare: 0.07, convRate: 0.77, aov: 42  },
  { category: "Accessories & Other",     icon: "🎽", redirectShare: 0.04, convRate: 0.72, aov: 35  },
];

const TEAM_ITEMS = [
  { team: "NY Rangers",          item: "Panarin #10 Home Jersey",     redirectShare: 0.22, convRate: 0.92, aov: 265, color: "#0038A8" },
  { team: "NY Islanders",        item: "Barzal #13 Away Jersey",       redirectShare: 0.14, convRate: 0.88, aov: 225, color: "#F47D30" },
  { team: "Boston Bruins",       item: "Pastrnak #88 Home Jersey",     redirectShare: 0.11, convRate: 0.86, aov: 225, color: "#FFB81C" },
  { team: "Washington Capitals", item: "Ovechkin #8 Alt. Jersey",      redirectShare: 0.09, convRate: 0.85, aov: 250, color: "#CF0A2C" },
  { team: "NY Rangers",          item: "Artemi Panarin Track Jacket",  redirectShare: 0.08, convRate: 0.90, aov: 312, color: "#0038A8" },
  { team: "Chicago Blackhawks",  item: "Toews #19 Retro Jersey",       redirectShare: 0.07, convRate: 0.84, aov: 220, color: "#CC0000" },
  { team: "Tampa Bay Lightning", item: "Kucherov #86 Home Jersey",     redirectShare: 0.06, convRate: 0.83, aov: 215, color: "#002868" },
  { team: "NJ Devils",           item: "Hughes #86 Home Jersey",       redirectShare: 0.05, convRate: 0.82, aov: 210, color: "#CE1126" },
];

// Day-of-week conversion pattern (relative to avg)
const DOW_PATTERNS = [
  { day: "Sun", factor: 0.82 },
  { day: "Mon", factor: 0.71 },
  { day: "Tue", factor: 0.68 },
  { day: "Wed", factor: 0.76 },
  { day: "Thu", factor: 0.85 },
  { day: "Fri", factor: 1.24 },
  { day: "Sat", factor: 1.44 },
];

// Time-of-day conversion pattern
const TOD_PATTERNS = [
  { hour: "9–10a",  factor: 0.41 },
  { hour: "10–11a", factor: 0.68 },
  { hour: "11–12p", factor: 0.95 },
  { hour: "12–1p",  factor: 1.12 },
  { hour: "1–2p",   factor: 1.08 },
  { hour: "2–3p",   factor: 1.31 },
  { hour: "3–4p",   factor: 1.38 },
  { hour: "4–5p",   factor: 1.19 },
  { hour: "5–6p",   factor: 0.97 },
  { hour: "6–7p",   factor: 0.74 },
  { hour: "7–8p",   factor: 0.53 },
];

// Gender / Age segment data
const SEGMENT_DATA = [
  { label: "Male 18–24",   pct: 14, convRate: 0.67, aov: 198 },
  { label: "Male 25–34",   pct: 28, convRate: 0.69, aov: 241 },
  { label: "Male 35–44",   pct: 18, convRate: 0.63, aov: 267 },
  { label: "Male 45–54",   pct: 9,  convRate: 0.58, aov: 285 },
  { label: "Male 55+",     pct: 4,  convRate: 0.52, aov: 294 },
  { label: "Female 18–24", pct: 8,  convRate: 0.71, aov: 152 },
  { label: "Female 25–34", pct: 11, convRate: 0.73, aov: 176 },
  { label: "Female 35–44", pct: 5,  convRate: 0.66, aov: 183 },
  { label: "Female 45+",   pct: 3,  convRate: 0.60, aov: 195 },
];

function generateData(dateRange: DateRange) {
  const days = Math.max(1, Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const kpi = calculateKPIData(days, false);
  const totalSurveys = kpi.totalSurveys;
  const totalRedirects = Math.round(totalSurveys * ROI_REDIRECT_RATE);
  const totalConversions = Math.round(totalRedirects * ROI_CONVERSION_RATE);
  const totalROI = totalConversions * ROI_AVG_ORDER_VALUE;
  const overallConvRate = Math.round((totalConversions / Math.max(1, totalRedirects)) * 100);
  const dailyROI = Math.round(totalROI / days);

  const merch = MERCH_CATEGORIES.map(m => {
    const redirects = Math.round(totalRedirects * m.redirectShare);
    const conversions = Math.round(redirects * m.convRate);
    const revenue = conversions * m.aov;
    return { ...m, redirects, conversions, revenue, pct: Math.round((revenue / Math.max(1, totalROI)) * 100) };
  });

  const teams = TEAM_ITEMS.map(t => {
    const redirects = Math.round(totalRedirects * t.redirectShare);
    const conversions = Math.round(redirects * t.convRate);
    const revenue = conversions * t.aov;
    return { ...t, redirects, conversions, revenue };
  }).sort((a, b) => b.revenue - a.revenue);

  const maxDowFactor = Math.max(...DOW_PATTERNS.map(d => d.factor));
  const maxTodFactor = Math.max(...TOD_PATTERNS.map(d => d.factor));
  const avgDailyConversions = totalConversions / days;

  const segments = SEGMENT_DATA.map(s => {
    const redirects = Math.round(totalRedirects * (s.pct / 100));
    const conversions = Math.round(redirects * s.convRate);
    const revenue = conversions * s.aov;
    return { ...s, redirects, conversions, revenue };
  });

  return { days, totalSurveys, totalRedirects, totalConversions, totalROI, overallConvRate, dailyROI, merch, teams, maxDowFactor, maxTodFactor, avgDailyConversions, segments };
}

const cell = (style: React.CSSProperties = {}): React.CSSProperties => ({
  padding: '10px 12px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#475569',
  ...style,
});

const headCell = (style: React.CSSProperties = {}): React.CSSProperties => ({
  padding: '10px 12px',
  fontSize: '10px',
  fontWeight: 900,
  color: '#ffffff',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.4px',
  ...style,
});

export function ROIReport({ dateRange, onClose, isModal }: ROIReportProps) {
  const d = generateData(dateRange);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      await exportReportPdf({
        element: reportRef.current,
        title: "ROI Report",
        fileName: `NHL_ROI_Report_${format(dateRange.from, "yyyy-MM-dd")}_to_${format(dateRange.to, "yyyy-MM-dd")}.pdf`,
      });
    } catch {
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleEmail = () => {
    const subject = `NHL Shop NYC — ROI Report (${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d, yyyy")})`;
    const body = `Please find the ROI Report for the period ${format(dateRange.from, "MMMM d, yyyy")} to ${format(dateRange.to, "MMMM d, yyyy")}.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const content = (
    <div ref={reportRef} style={{ backgroundColor: '#ffffff', padding: '48px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1f2937', maxWidth: '1200px', margin: '0 auto' }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <img src={nhlLogo} alt="NHL" style={{ height: '64px' }} />
          <img src={jibeRetailLogo} alt="Jibe Retail" style={{ height: '90px' }} />
        </div>
        <div style={{ borderLeft: '6px solid #15803d', paddingLeft: '24px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#14532d', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            ROI Report
          </h1>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#6b7280', margin: 0 }}>
            NHL Shop NYC Flagship — Survey QR Code Online Conversion Analysis
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#15803d', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Report Period</p>
            <p style={{ fontSize: '20px', fontWeight: 900, color: '#14532d', margin: 0 }}>{format(dateRange.from, "MMM d")} – {format(dateRange.to, "MMM d, yyyy")}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#15803d', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Days Covered</p>
            <p style={{ fontSize: '20px', fontWeight: 900, color: '#14532d', margin: 0 }}>{d.days}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#15803d', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Generated</p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#475569', margin: 0 }}>{format(new Date(), "MMM d, yyyy 'at' h:mm a")}</p>
          </div>
        </div>
      </div>

      {/* ── HERO KPI CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '40px' }}>
        {[
          { label: 'Total ROI',         value: `$${d.totalROI.toLocaleString()}`,       sub: 'Online revenue',          bg: 'linear-gradient(135deg,#14532d,#166534)', light: false },
          { label: 'Daily Avg ROI',     value: `$${d.dailyROI.toLocaleString()}`,        sub: 'Per day',                 bg: 'linear-gradient(135deg,#166534,#15803d)', light: false },
          { label: 'QR Redirects',      value: d.totalRedirects.toLocaleString(),        sub: 'Sent online',             bg: 'linear-gradient(135deg,#1e3a5f,#1e40af)', light: false },
          { label: 'Conversions',       value: d.totalConversions.toLocaleString(),      sub: 'Completed purchases',     bg: 'linear-gradient(135deg,#f8fafc,#f1f5f9)',  light: true  },
          { label: 'Conversion Rate',   value: `${d.overallConvRate}%`,                  sub: 'Redirects → purchases',  bg: 'linear-gradient(135deg,#f8fafc,#f1f5f9)',  light: true  },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: '12px', padding: '18px 14px', textAlign: 'center', border: s.light ? '2px solid #e2e8f0' : 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.09)' }}>
            <p style={{ fontSize: '9px', fontWeight: 800, color: s.light ? '#64748b' : 'rgba(255,255,255,0.8)', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{s.label}</p>
            <p style={{ fontSize: '22px', fontWeight: 900, color: s.light ? '#111827' : '#ffffff', margin: 0, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: '10px', fontWeight: 600, color: s.light ? '#94a3b8' : 'rgba(255,255,255,0.7)', margin: '6px 0 0 0' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── CONVERSION FUNNEL ── */}
      <div style={{ marginBottom: '40px', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '2px solid #bbf7d0', borderRadius: '14px', padding: '28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#14532d', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          📊 Conversion Funnel
        </h2>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: '6px' }}>
          {[
            { label: 'Total Surveys',  value: d.totalSurveys,     pct: '100%',  color: '#1e3a5f',  bg: '#dbeafe' },
            { label: 'QR Redirects',   value: d.totalRedirects,   pct: `${Math.round((d.totalRedirects / d.totalSurveys) * 100)}%`,   color: '#1d4ed8', bg: '#bfdbfe' },
            { label: 'Conversions',    value: d.totalConversions, pct: `${Math.round((d.totalConversions / d.totalSurveys) * 100)}%`, color: '#15803d', bg: '#bbf7d0' },
          ].map((step, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', height: '56px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: step.pct, background: step.color, borderRadius: '8px' }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{step.value.toLocaleString()}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>({step.pct})</span>
                </div>
              </div>
              <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 800, color: '#374151', margin: 0 }}>{step.label}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', padding: '12px 0 0 0', borderTop: '1px solid #86efac' }}>
          {[
            { label: 'Redirect Rate',   value: `${Math.round(ROI_REDIRECT_RATE * 100)}%`,  sub: 'Surveys → QR scan' },
            { label: 'Conversion Rate', value: `${d.overallConvRate}%`,                      sub: 'Redirects → purchase' },
            { label: 'Overall Rate',    value: `${Math.round((d.totalConversions / d.totalSurveys) * 100)}%`, sub: 'Surveys → purchase' },
            { label: 'Avg Order Value', value: `$${ROI_AVG_ORDER_VALUE}`,                   sub: 'Per converted sale' },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: 900, color: '#14532d', margin: '0 0 4px 0' }}>{m.value}</p>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: 0 }}>{m.label}</p>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0' }}>{m.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── ROI BY MERCH CATEGORY ── */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#14532d', margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🏒 ROI by Merchandise Category
        </h2>
        <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '26%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '9%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '19%' }} />
            </colgroup>
            <thead>
              <tr style={{ background: 'linear-gradient(to right,#14532d,#166534)' }}>
                {['Category','Redirects','Conversions','Conv. Rate','Avg Order','Revenue','% of Total ROI'].map(h => (
                  <th key={h} style={headCell({ textAlign: h === 'Category' ? 'left' : 'right' })}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.merch.map((m, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <td style={cell({ fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>{m.icon} {m.category}</td>
                  <td style={cell({ textAlign: 'right' })}>{m.redirects.toLocaleString()}</td>
                  <td style={cell({ textAlign: 'right', fontWeight: 700, color: '#1e293b' })}>{m.conversions.toLocaleString()}</td>
                  <td style={{ ...cell({ textAlign: 'right' }) }}>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>{Math.round(m.convRate * 100)}%</span>
                  </td>
                  <td style={cell({ textAlign: 'right' })}>${m.aov}</td>
                  <td style={cell({ textAlign: 'right', fontWeight: 900, color: '#15803d', fontSize: '13px' })}>${m.revenue.toLocaleString()}</td>
                  <td style={cell({ textAlign: 'right' })}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <div style={{ width: '48px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${m.pct}%`, background: 'linear-gradient(to right,#14532d,#16a34a)', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#374151' }}>{m.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              <tr style={{ background: 'linear-gradient(to right,#1e293b,#334155)' }}>
                <td style={cell({ fontWeight: 900, color: '#ffffff', textTransform: 'uppercase' })}>TOTAL</td>
                <td style={cell({ textAlign: 'right', fontWeight: 900, color: '#ffffff' })}>{d.totalRedirects.toLocaleString()}</td>
                <td style={cell({ textAlign: 'right', fontWeight: 900, color: '#ffffff' })}>{d.totalConversions.toLocaleString()}</td>
                <td style={cell({ textAlign: 'right', fontWeight: 900, color: '#4ade80' })}>{d.overallConvRate}%</td>
                <td style={cell({ textAlign: 'right', fontWeight: 900, color: '#ffffff' })}>${ROI_AVG_ORDER_VALUE}</td>
                <td style={cell({ textAlign: 'right', fontWeight: 900, color: '#4ade80', fontSize: '13px' })}>${d.totalROI.toLocaleString()}</td>
                <td style={cell({ textAlign: 'right', fontWeight: 900, color: '#ffffff' })}>100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ROI BY TEAM ── */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#14532d', margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🏆 Top Teams by Conversion Revenue
        </h2>
        <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
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
              <tr style={{ background: 'linear-gradient(to right,#14532d,#166534)' }}>
                {['#','Team','Top Item','Redirects','Conversions','Rate','Revenue'].map(h => (
                  <th key={h} style={headCell({ textAlign: ['#','Team','Top Item'].includes(h) ? 'left' : 'right' })}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.teams.map((t, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <td style={cell({ fontWeight: 900, color: idx < 3 ? '#15803d' : '#94a3b8' })}>#{idx + 1}</td>
                  <td style={cell({ fontWeight: 800, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: t.color, marginRight: '6px', verticalAlign: 'middle' }} />
                    {t.team}
                  </td>
                  <td style={cell({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>{t.item}</td>
                  <td style={cell({ textAlign: 'right' })}>{t.redirects.toLocaleString()}</td>
                  <td style={cell({ textAlign: 'right', fontWeight: 700, color: '#1e293b' })}>{t.conversions.toLocaleString()}</td>
                  <td style={cell({ textAlign: 'right' })}>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>{Math.round(t.convRate * 100)}%</span>
                  </td>
                  <td style={cell({ textAlign: 'right', fontWeight: 900, color: '#15803d', fontSize: '13px' })}>${t.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── DAY OF WEEK + TIME OF DAY ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>

        {/* Day of Week */}
        <div style={{ border: '2px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#1e40af)', padding: '16px 20px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#ffffff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>📅 Conversions by Day of Week</h3>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: '4px 0 0 0' }}>Relative to daily average</p>
          </div>
          <div style={{ padding: '20px' }}>
            {DOW_PATTERNS.map((dow) => {
              const convs = Math.round(d.avgDailyConversions * dow.factor);
              const barW = Math.round((dow.factor / d.maxDowFactor) * 100);
              const isWeekend = dow.day === 'Sat' || dow.day === 'Sun';
              return (
                <div key={dow.day} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: isWeekend ? '#14532d' : '#64748b', width: '28px' }}>{dow.day}</span>
                  <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '4px', height: '20px', overflow: 'hidden' }}>
                    <div style={{ width: `${barW}%`, height: '100%', background: isWeekend ? 'linear-gradient(to right,#14532d,#16a34a)' : 'linear-gradient(to right,#1e3a5f,#3b82f6)', borderRadius: '4px' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#374151', width: '28px', textAlign: 'right' }}>{convs}</span>
                  <span style={{ fontSize: '10px', color: isWeekend ? '#15803d' : '#94a3b8', width: '38px', textAlign: 'right', fontWeight: isWeekend ? 800 : 600 }}>×{dow.factor}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time of Day */}
        <div style={{ border: '2px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#1e40af)', padding: '16px 20px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#ffffff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>🕐 Conversions by Time of Day</h3>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: '4px 0 0 0' }}>Avg conversions per hour window</p>
          </div>
          <div style={{ padding: '20px' }}>
            {TOD_PATTERNS.map((tod) => {
              const convs = Math.round((d.totalConversions / d.days / 11) * tod.factor);
              const barW = Math.round((tod.factor / d.maxTodFactor) * 100);
              const isPeak = tod.factor >= 1.25;
              return (
                <div key={tod.hour} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: isPeak ? '#14532d' : '#64748b', width: '42px' }}>{tod.hour}</span>
                  <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '4px', height: '20px', overflow: 'hidden' }}>
                    <div style={{ width: `${barW}%`, height: '100%', background: isPeak ? 'linear-gradient(to right,#14532d,#16a34a)' : 'linear-gradient(to right,#6b7280,#9ca3af)', borderRadius: '4px' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#374151', width: '22px', textAlign: 'right' }}>{convs}</span>
                  {isPeak && <span style={{ fontSize: '9px', fontWeight: 800, color: '#15803d', background: '#dcfce7', padding: '1px 5px', borderRadius: '10px' }}>PEAK</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CUSTOMER SEGMENT ROI ── */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#14532d', margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          👤 ROI by Customer Segment
        </h2>
        <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '22%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '18%' }} />
            </colgroup>
            <thead>
              <tr style={{ background: 'linear-gradient(to right,#14532d,#166534)' }}>
                {['Segment','Share','Redirects','Conversions','Conv. Rate','Avg Order','Revenue'].map(h => (
                  <th key={h} style={headCell({ textAlign: h === 'Segment' ? 'left' : 'right' })}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.segments.map((s, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <td style={cell({ fontWeight: 700, color: '#1e293b' })}>{s.label}</td>
                  <td style={cell({ textAlign: 'right' })}>{s.pct}%</td>
                  <td style={cell({ textAlign: 'right' })}>{s.redirects.toLocaleString()}</td>
                  <td style={cell({ textAlign: 'right', fontWeight: 700, color: '#1e293b' })}>{s.conversions.toLocaleString()}</td>
                  <td style={cell({ textAlign: 'right' })}>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>{Math.round(s.convRate * 100)}%</span>
                  </td>
                  <td style={cell({ textAlign: 'right' })}>${s.aov}</td>
                  <td style={cell({ textAlign: 'right', fontWeight: 900, color: '#15803d', fontSize: '13px' })}>${s.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── INSIGHTS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        {[
          {
            title: '💡 Top Opportunity',
            body: 'Fitted & Snapback Caps drive high redirect volume but only a $48 average order. Bundling with a jersey or hoodie suggestion at QR landing could lift per-scan revenue significantly.',
            bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '#6ee7b7', titleColor: '#065f46',
          },
          {
            title: '📈 Biggest Win',
            body: 'Rangers jerseys alone account for 30%+ of redirect share with the highest conversion rate (92%). Keeping jersey SKUs in-stock or ensuring fast online fulfilment directly protects the top revenue driver.',
            bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '#93c5fd', titleColor: '#1e3a5f',
          },
          {
            title: '⏰ Peak Window',
            body: 'The 2–4 PM window generates 39% more conversions per hour than the daily average. Staffing the podiums during this window and ensuring QR links are live maximizes captured revenue.',
            bg: 'linear-gradient(135deg,#fefce8,#fef9c3)', border: '#fde047', titleColor: '#713f12',
          },
        ].map((ins, i) => (
          <div key={i} style={{ background: ins.bg, border: `2px solid ${ins.border}`, borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: 900, color: ins.titleColor, margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{ins.title}</p>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: ins.titleColor, margin: 0, opacity: 0.9 }}>{ins.body}</p>
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>NHL Shop NYC Flagship · ROI Report · {format(new Date(), "MMMM d, yyyy")}</p>
        <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Powered by Jibe Retail · Confidential</p>
      </div>

    </div>
  );

  if (isModal === false) {
    return (
      <div className="w-full">
        <button onClick={handleDownloadPDF} data-report-download style={{ display: 'none' }} />
        <button onClick={handleEmail} data-report-email style={{ display: 'none' }} />
        <div className="px-6 py-6">{content}</div>
      </div>
    );
  }

  return content;
}
