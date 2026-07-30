import { X, Download, Mail, MapPin, TrendingUp, Users, Package, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { exportReportPdf } from "@/app/utils/exportReportPdf";
import { useRef } from "react";
import nhlLogo from "../../imports/NHL-league-logo.png";
import jibeRetailLogo from "../../imports/jibe-retail-official-logo.png";

type DateRange = {
  from: Date;
  to: Date;
};

type PodiumActivityReportProps = {
  dateRange: DateRange;
  onClose: () => void;
  isModal?: boolean;
};

type PodiumData = {
  id: string;
  name: string;
  location: string;
  totalSurveys: number;
  completedSurveys: number;
  abandonedSurveys: number;
  completionRate: number;
  avgSurveyTime: number;
  peakHours: string;
  topMissingItems: {
    team: string;
    item: string;
    size: string;
    count: number;
  }[];
  staffContactRate: number;
  avgStaffRating: number;
  topFrictionPoints: {
    issue: string;
    count: number;
  }[];
};

const generatePodiumData = (dateRange: DateRange): PodiumData[] => {
  return [
    {
      id: '1',
      name: 'O-Zone',
      location: 'Level 1 - Main Entrance',
      totalSurveys: 285,
      completedSurveys: 224,
      abandonedSurveys: 61,
      completionRate: 78.6,
      avgSurveyTime: 108,
      peakHours: '11am - 2pm, 5pm - 7pm',
      topMissingItems: [
        { team: 'Rangers', item: 'Home Jersey (Panarin #10)', size: 'L', count: 42 },
        { team: 'Rangers', item: 'Fitted Cap', size: '7 1/4', count: 38 },
        { team: 'Islanders', item: 'Away Jersey (Barzal #13)', size: 'XL', count: 31 },
        { team: 'Rangers', item: 'Pullover Hoodie', size: 'L', count: 28 },
        { team: 'Kings', item: 'Fitted Cap', size: '7 1/4', count: 24 }
      ],
      staffContactRate: 82.5,
      avgStaffRating: 4.6,
      topFrictionPoints: [
        { issue: 'Long checkout lines', count: 47 },
        { issue: 'Crowded aisles', count: 35 },
        { issue: 'Difficulty finding items', count: 28 }
      ]
    },
    {
      id: '2',
      name: 'Left Wing',
      location: 'Level 1 - West',
      totalSurveys: 312,
      completedSurveys: 241,
      abandonedSurveys: 71,
      completionRate: 77.2,
      avgSurveyTime: 115,
      peakHours: '12pm - 3pm, 6pm - 8pm',
      topMissingItems: [
        { team: 'Rangers', item: 'Home Jersey (Panarin #10)', size: 'XL', count: 55 },
        { team: 'Rangers', item: 'Home Jersey (Panarin #10)', size: 'L', count: 48 },
        { team: 'Rangers', item: 'Fitted Cap', size: '7 3/8', count: 41 },
        { team: 'Rangers', item: 'Track Jacket', size: 'XL', count: 39 },
        { team: 'Rangers', item: 'Panarin Game-Used Stick (Signed)', size: 'N/A', count: 18 }
      ],
      staffContactRate: 88.2,
      avgStaffRating: 4.8,
      topFrictionPoints: [
        { issue: 'Out of stock popular items', count: 68 },
        { issue: 'Long checkout lines', count: 42 },
        { issue: 'Limited size availability', count: 38 }
      ]
    },
    {
      id: '3',
      name: 'Right Wing',
      location: 'Level 1 - East',
      totalSurveys: 198,
      completedSurveys: 152,
      abandonedSurveys: 46,
      completionRate: 76.8,
      avgSurveyTime: 112,
      peakHours: '1pm - 4pm, 5pm - 7pm',
      topMissingItems: [
        { team: 'Islanders', item: 'Away Jersey (Barzal #13)', size: 'XL', count: 36 },
        { team: 'Islanders', item: 'Home Jersey (Lee #27)', size: 'L', count: 32 },
        { team: 'Islanders', item: 'Fitted Cap', size: '7 1/2', count: 29 },
        { team: 'Islanders', item: 'Tavares Game-Used Jersey (Signed)', size: 'N/A', count: 15 },
        { team: 'Islanders', item: 'Pullover Hoodie', size: 'M', count: 14 }
      ],
      staffContactRate: 79.4,
      avgStaffRating: 4.5,
      topFrictionPoints: [
        { issue: 'Out of stock popular items', count: 52 },
        { issue: 'Difficulty finding items', count: 31 },
        { issue: 'Limited merchandise selection', count: 24 }
      ]
    },
    {
      id: '4',
      name: 'Center Lane',
      location: 'Level 2 - Top of Stairs',
      totalSurveys: 267,
      completedSurveys: 208,
      abandonedSurveys: 59,
      completionRate: 77.9,
      avgSurveyTime: 105,
      peakHours: '11am - 1pm, 3pm - 6pm',
      topMissingItems: [
        { team: 'Rangers', item: 'Fitted Cap', size: '7 1/4', count: 62 },
        { team: 'Rangers', item: 'Fitted Cap', size: '7 3/8', count: 54 },
        { team: 'Kings', item: 'Fitted Cap', size: '7 1/4', count: 47 },
        { team: 'Rangers', item: 'Snapback Cap (Vintage Logo)', size: 'Adjustable', count: 38 },
        { team: 'Islanders', item: 'Fitted Cap', size: '7 1/2', count: 35 }
      ],
      staffContactRate: 85.7,
      avgStaffRating: 4.7,
      topFrictionPoints: [
        { issue: 'Limited size availability', count: 71 },
        { issue: 'Out of stock popular items', count: 58 },
        { issue: 'Long checkout lines', count: 33 }
      ]
    },
    {
      id: '5',
      name: 'Blue Line',
      location: 'Level 2 - West',
      totalSurveys: 241,
      completedSurveys: 186,
      abandonedSurveys: 55,
      completionRate: 77.2,
      avgSurveyTime: 118,
      peakHours: '12pm - 2pm, 4pm - 7pm',
      topMissingItems: [
        { team: 'Rangers', item: 'Home Jersey (Panarin #10)', size: 'L', count: 44 },
        { team: 'Bruins', item: 'Home Jersey (Pastrnak #88)', size: 'M', count: 38 },
        { team: 'Kings', item: 'Home Jersey (Kopitar #11)', size: 'L', count: 36 },
        { team: 'Blackhawks', item: 'Retro Jersey (Toews #19)', size: 'L', count: 28 },
        { team: 'Capitals', item: 'Home Jersey (Ovechkin #8)', size: 'L', count: 22 }
      ],
      staffContactRate: 81.3,
      avgStaffRating: 4.6,
      topFrictionPoints: [
        { issue: 'Out of stock popular items', count: 64 },
        { issue: 'Limited size availability', count: 45 },
        { issue: 'High prices', count: 28 }
      ]
    },
    {
      id: '6',
      name: 'Red Line',
      location: 'Level 2 - East',
      totalSurveys: 147,
      completedSurveys: 115,
      abandonedSurveys: 32,
      completionRate: 78.2,
      avgSurveyTime: 98,
      peakHours: '10am - 12pm, 2pm - 5pm',
      topMissingItems: [
        { team: 'Rangers', item: 'Kids Home Jersey', size: 'Youth L', count: 32 },
        { team: 'Islanders', item: 'Kids Home Jersey', size: 'Youth M', count: 28 },
        { team: 'Rangers', item: 'Kids Adjustable Cap', size: 'Youth', count: 24 },
        { team: 'Rangers', item: 'Performance T-Shirt', size: 'Youth L', count: 19 },
        { team: 'Kings', item: 'Kids Home Jersey', size: 'Youth M', count: 16 }
      ],
      staffContactRate: 91.2,
      avgStaffRating: 4.9,
      topFrictionPoints: [
        { issue: 'Limited size availability', count: 38 },
        { issue: 'Out of stock popular items', count: 29 },
        { issue: 'Difficulty finding items', count: 18 }
      ]
    }
  ];
};

export function PodiumActivityReport({ dateRange, onClose, isModal }: PodiumActivityReportProps) {
  const data = generatePodiumData(dateRange);
  const reportRef = useRef<HTMLDivElement>(null);

  // Calculate totals
  const totalSurveys = data.reduce((sum, p) => sum + p.totalSurveys, 0);
  const totalCompleted = data.reduce((sum, p) => sum + p.completedSurveys, 0);
  const overallCompletionRate = ((totalCompleted / totalSurveys) * 100).toFixed(1);
  const avgStaffContactRate = (data.reduce((sum, p) => sum + p.staffContactRate, 0) / data.length).toFixed(1);
  const avgStaffRating = (data.reduce((sum, p) => sum + p.avgStaffRating, 0) / data.length).toFixed(1);

  // Find top performing podium
  const topPodium = [...data].sort((a, b) => b.completionRate - a.completionRate)[0];
  const bottomPodium = [...data].sort((a, b) => a.completionRate - b.completionRate)[0];

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      await exportReportPdf({
        element: reportRef.current,
        title: "Kiosk Activity Report",
        fileName: `NHL_Kiosk_Activity_Report_${format(dateRange.from, "yyyy-MM-dd")}_to_${format(dateRange.to, "yyyy-MM-dd")}.pdf`,
      });
    } catch (error) {
      console.error('PDF Error:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleEmail = () => {
    const subject = `NHL Shop NYC Flagship - Kiosk Activity Report (${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")})`;
    const body = `Please find the Kiosk Activity Report for the period ${format(dateRange.from, "MMMM d, yyyy")} to ${format(dateRange.to, "MMMM d, yyyy")}.\n\nKey Metrics:\n- Total Surveys: ${totalSurveys}\n- Total Completed: ${totalCompleted}\n- Overall Completion Rate: ${overallCompletionRate}%\n- Avg Staff Contact Rate: ${avgStaffContactRate}%\n- Avg Staff Rating: ${avgStaffRating}/5.0\n\nTop Performing Kiosk: ${topPodium.name} (${topPodium.completionRate.toFixed(1)}%)`;

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Page mode - no overlay
  if (isModal === false) {
    return (
      <div className="w-full">
        {/* Hidden Download and Email Buttons for programmatic triggering */}
        <button
          onClick={handleDownloadPDF}
          data-report-download
          style={{ display: 'none' }}
        />
        <button
          onClick={handleEmail}
          data-report-email
          style={{ display: 'none' }}
        />

        <div className="px-6 py-6">
          <div ref={reportRef} className="nhl-report-document" style={{
            backgroundColor: '#ffffff',
            padding: '40px',
            fontFamily: "'Roboto Condensed', 'Arial Narrow', Arial, sans-serif",
            color: '#1f2937'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <img src={nhlLogo} alt="NHL" style={{ height: '56px' }} />
                <img src={jibeRetailLogo} alt="Jibe Retail" style={{ height: '80px' }} />
              </div>
              <div style={{ borderBottom: '3px solid #c7a447', paddingBottom: '12px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#07111b', margin: '0 0 8px 0' }}>
                  Kiosk Activity Report
                </h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#6b7280', margin: 0 }}>
                    NHL Shop NYC Flagship Store - Detailed Kiosk Performance Analysis
                  </p>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                      Report Period
                    </p>
                    <p style={{ fontSize: '16px', fontWeight: '900', color: '#9a7120', margin: 0 }}>
                      {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                      Generated: {format(new Date(), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#07111b', marginBottom: '12px', textTransform: 'uppercase' }}>
                Executive Summary
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'linear-gradient(135deg, #07111b 0%, #0a4f7c 100%)', padding: '20px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    Total Surveys
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                    {totalSurveys}
                  </p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #2385bd 0%, #167cb4 100%)', padding: '20px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    Completion Rate
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                    {overallCompletionRate}%
                  </p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #9a7120 0%, #c7a447 100%)', padding: '20px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    Staff Contact Rate
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                    {avgStaffContactRate}%
                  </p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '20px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    Avg Staff Rating
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                    {avgStaffRating}/5.0
                  </p>
                </div>
              </div>

              {/* Performance Highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ border: '2px solid #2385bd', borderRadius: '8px', padding: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, #ffffff 100%)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <TrendingUp size={20} color="#2385bd" />
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2385bd', margin: 0, textTransform: 'uppercase' }}>
                      Top Performing Kiosk
                    </p>
                  </div>
                  <p style={{ fontSize: '18px', fontWeight: '900', color: '#07111b', margin: '0 0 4px 0' }}>
                    {topPodium.name}
                  </p>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0' }}>
                    {topPodium.location}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Completion Rate</p>
                      <p style={{ fontSize: '20px', fontWeight: '900', color: '#2385bd', margin: 0 }}>{topPodium.completionRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Staff Rating</p>
                      <p style={{ fontSize: '20px', fontWeight: '900', color: '#2385bd', margin: 0 }}>{topPodium.avgStaffRating}/5.0</p>
                    </div>
                  </div>
                </div>
                <div style={{ border: '2px solid #f59e0b', borderRadius: '8px', padding: '16px', background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, #ffffff 100%)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <AlertCircle size={20} color="#f59e0b" />
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#f59e0b', margin: 0, textTransform: 'uppercase' }}>
                      Needs Attention
                    </p>
                  </div>
                  <p style={{ fontSize: '18px', fontWeight: '900', color: '#07111b', margin: '0 0 4px 0' }}>
                    {bottomPodium.name}
                  </p>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0' }}>
                    {bottomPodium.location}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Completion Rate</p>
                      <p style={{ fontSize: '20px', fontWeight: '900', color: '#f59e0b', margin: 0 }}>{bottomPodium.completionRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Staff Rating</p>
                      <p style={{ fontSize: '20px', fontWeight: '900', color: '#f59e0b', margin: 0 }}>{bottomPodium.avgStaffRating}/5.0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Podium Breakdowns */}
            {data.map((podium, idx) => (
              <div key={podium.id} style={{ marginBottom: '32px' }}>
                {/* Podium Header */}
                <div style={{
                  background: `linear-gradient(135deg, ${idx % 2 === 0 ? '#07111b' : '#9a7120'} 0%, ${idx % 2 === 0 ? '#0a4f7c' : '#c7a447'} 100%)`,
                  padding: '20px',
                  borderRadius: '8px 8px 0 0',
                  marginBottom: '0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '3px solid rgba(255,255,255,0.4)'
                        }}>
                          <p style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                            {podium.id}
                          </p>
                        </div>
                        <div>
                          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', margin: '0 0 4px 0' }}>
                            {podium.name}
                          </h2>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={14} color="rgba(255,255,255,0.9)" />
                            <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                              {podium.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                        Kiosk ID
                      </p>
                      <p style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                        JibeKiosk {podium.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Podium Content */}
                <div style={{ border: '2px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '24px' }}>
                  {/* Key Metrics */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                      Performance Metrics
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', background: '#f9fafb' }}>
                        <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Total Surveys</p>
                        <p style={{ fontSize: '24px', fontWeight: '900', color: '#07111b', margin: 0 }}>{podium.totalSurveys}</p>
                      </div>
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', background: '#f9fafb' }}>
                        <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Completed</p>
                        <p style={{ fontSize: '24px', fontWeight: '900', color: '#2385bd', margin: 0 }}>{podium.completedSurveys}</p>
                      </div>
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', background: '#f9fafb' }}>
                        <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Completion Rate</p>
                        <p style={{ fontSize: '24px', fontWeight: '900', color: '#9a7120', margin: 0 }}>{podium.completionRate.toFixed(1)}%</p>
                      </div>
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', background: '#f9fafb' }}>
                        <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Avg Time</p>
                        <p style={{ fontSize: '24px', fontWeight: '900', color: '#07111b', margin: 0 }}>{formatTime(podium.avgSurveyTime)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Staff Performance */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                      Staff Performance
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div style={{ border: '2px solid #07111b', borderRadius: '6px', padding: '16px', background: 'linear-gradient(135deg, rgba(7,17,27,0.05) 0%, #ffffff 100%)' }}>
                        <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Staff Contact Rate</p>
                        <p style={{ fontSize: '28px', fontWeight: '900', color: '#07111b', margin: 0 }}>{podium.staffContactRate}%</p>
                      </div>
                      <div style={{ border: '2px solid #f59e0b', borderRadius: '6px', padding: '16px', background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, #ffffff 100%)' }}>
                        <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Avg Staff Rating</p>
                        <p style={{ fontSize: '28px', fontWeight: '900', color: '#f59e0b', margin: 0 }}>{podium.avgStaffRating}/5.0</p>
                      </div>
                      <div style={{ border: '2px solid #2385bd', borderRadius: '6px', padding: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, #ffffff 100%)' }}>
                        <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Peak Hours</p>
                        <p style={{ fontSize: '14px', fontWeight: '900', color: '#2385bd', margin: 0 }}>{podium.peakHours}</p>
                      </div>
                    </div>
                  </div>

                  {/* Top Missing Items */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                      Top Missing Items Reported
                    </h3>
                    <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'linear-gradient(to right, #9a7120, #c7a447)' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Rank</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Team</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Item</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Size</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '10px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Reports</th>
                          </tr>
                        </thead>
                        <tbody>
                          {podium.topMissingItems.map((item, itemIdx) => (
                            <tr key={itemIdx} style={{ backgroundColor: itemIdx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                              <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '900', color: '#07111b' }}>#{itemIdx + 1}</td>
                              <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '900', color: '#1f2937' }}>{item.team}</td>
                              <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>{item.item}</td>
                              <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>{item.size}</td>
                              <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '900', color: '#9a7120', textAlign: 'right' }}>{item.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Top Friction Points */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                      Top Customer Friction Points
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      {podium.topFrictionPoints.map((friction, frictionIdx) => (
                        <div key={frictionIdx} style={{
                          border: '2px solid #e5e7eb',
                          borderRadius: '6px',
                          padding: '14px',
                          background: frictionIdx === 0 ? 'linear-gradient(135deg, rgba(154,113,32,0.08) 0%, #ffffff 100%)' : '#f9fafb'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: frictionIdx === 0 ? '#9a7120' : '#6b7280',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              fontSize: '12px',
                              fontWeight: '900'
                            }}>
                              {frictionIdx + 1}
                            </div>
                            <p style={{ fontSize: '11px', fontWeight: '900', color: '#1f2937', margin: 0 }}>
                              {friction.issue}
                            </p>
                          </div>
                          <p style={{ fontSize: '20px', fontWeight: '900', color: frictionIdx === 0 ? '#9a7120' : '#6b7280', margin: 0 }}>
                            {friction.count} reports
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Comparative Analysis */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#07111b', marginBottom: '12px', textTransform: 'uppercase' }}>
                Comparative Kiosk Analysis
              </h2>
              <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(to right, #07111b, #0a4f7c)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Kiosk</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Location</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Surveys</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Completion %</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Staff Contact %</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Staff Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((podium, idx) => (
                      <tr key={podium.id} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#07111b' }}>{podium.name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>{podium.location}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#07111b', textAlign: 'right' }}>{podium.totalSurveys}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#2385bd', textAlign: 'right' }}>{podium.completionRate.toFixed(1)}%</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#9a7120', textAlign: 'right' }}>{podium.staffContactRate}%</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#f59e0b', textAlign: 'right' }}>{podium.avgStaffRating}/5.0</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Insights */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#07111b', marginBottom: '12px', textTransform: 'uppercase' }}>
                Key Insights & Recommendations
              </h2>
              <div style={{ borderLeft: '4px solid #2385bd', padding: '20px', backgroundColor: '#eff6ff', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#2385bd', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                  ✅ High Performance Areas
                </h3>
                <ul style={{ fontSize: '14px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                  <li><strong>Red Line</strong> leads with 91.2% staff contact rate and 4.9/5.0 staff rating - excellent customer service model</li>
                  <li><strong>Left Wing</strong> shows highest customer engagement with 312 total surveys, indicating strong traffic and interest</li>
                  <li><strong>Center Lane</strong> demonstrates focused inventory needs with high concentration of specific fitted cap sizes</li>
                </ul>
              </div>

              <div style={{ borderLeft: '4px solid #9a7120', padding: '20px', backgroundColor: 'rgba(154,113,32,0.05)', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#9a7120', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                  🚨 Critical Inventory Issues
                </h3>
                <ul style={{ fontSize: '14px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                  <li><strong>Rangers merchandise</strong> dominates missing item reports across multiple kiosks, especially Panarin jerseys (L/XL) and fitted caps</li>
                  <li><strong>Size availability</strong> is the #1 friction point at Center Lane (71 reports) and Blue Line (45 reports)</li>
                  <li><strong>Game-used memorabilia</strong> shows consistent demand but limited supply across Left Wing and Right Wing</li>
                </ul>
              </div>

              <div style={{ borderLeft: '4px solid #07111b', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '0 8px 8px 0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                  📊 Operational Recommendations
                </h3>
                <ol style={{ fontSize: '14px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                  <li><strong>Inventory Redistribution:</strong> Prioritize Rangers merchandise at Left Wing and O-Zone based on high demand patterns</li>
                  <li><strong>Staff Training:</strong> Replicate the Red Line kiosk customer service approach at lower-performing locations</li>
                  <li><strong>Peak Hour Staffing:</strong> Increase staff presence during identified peak hours at each kiosk to maintain high contact rates</li>
                  <li><strong>Size Matrix Optimization:</strong> Focus restocking on L/XL apparel and 7 1/4 - 7 3/8 fitted caps based on report data</li>
                  <li><strong>Checkout Efficiency:</strong> Address long lines issue (top friction at 3 kiosks) with mobile checkout or additional registers during peak times</li>
                </ol>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '2px solid #e5e7eb', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0' }}>
                NHL Shop NYC Flagship Store • Kiosk Activity Report • Confidential
              </p>
              <p style={{ fontSize: '10px', color: '#d1d5db', margin: 0 }}>
                Generated on {format(new Date(), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal mode - with overlay
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '16px'
    }}>
      {/* Buttons */}
      <div style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        display: 'flex',
        gap: '8px',
        zIndex: 60
      }}>
        <button
          onClick={handleEmail}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            color: '#07111b',
            border: '2px solid #07111b',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <Mail size={16} />
          Email
        </button>
        <button
          onClick={handleDownloadPDF}
          data-report-download
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#07111b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <Download size={16} />
          Download PDF
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <X size={20} color="#374151" />
        </button>
      </div>

      {/* Report Container */}
      <div style={{
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div ref={reportRef} className="nhl-report-document" style={{
          backgroundColor: '#ffffff',
          padding: '40px',
          fontFamily: "'Roboto Condensed', 'Arial Narrow', Arial, sans-serif",
          color: '#1f2937'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <img src={nhlLogo} alt="NHL" style={{ height: '56px' }} />
              <img src={jibeRetailLogo} alt="Jibe Retail" style={{ height: '80px' }} />
            </div>
            <div style={{ borderBottom: '3px solid #c7a447', paddingBottom: '12px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#07111b', margin: '0 0 8px 0' }}>
                Kiosk Activity Report
              </h1>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#6b7280', margin: 0 }}>
                  NHL Shop NYC Flagship Store - Detailed Kiosk Performance Analysis
                </p>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                    Report Period
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '900', color: '#9a7120', margin: 0 }}>
                    {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                  </p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                    Generated: {format(new Date(), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#07111b', marginBottom: '12px', textTransform: 'uppercase' }}>
              Executive Summary
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'linear-gradient(135deg, #07111b 0%, #0a4f7c 100%)', padding: '20px', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  Total Surveys
                </p>
                <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                  {totalSurveys}
                </p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #2385bd 0%, #167cb4 100%)', padding: '20px', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  Completion Rate
                </p>
                <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                  {overallCompletionRate}%
                </p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #9a7120 0%, #c7a447 100%)', padding: '20px', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  Staff Contact Rate
                </p>
                <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                  {avgStaffContactRate}%
                </p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '20px', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  Avg Staff Rating
                </p>
                <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                  {avgStaffRating}/5.0
                </p>
              </div>
            </div>

            {/* Performance Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ border: '2px solid #2385bd', borderRadius: '8px', padding: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, #ffffff 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <TrendingUp size={20} color="#2385bd" />
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2385bd', margin: 0, textTransform: 'uppercase' }}>
                    Top Performing Kiosk
                  </p>
                </div>
                <p style={{ fontSize: '18px', fontWeight: '900', color: '#07111b', margin: '0 0 4px 0' }}>
                  {topPodium.name}
                </p>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0' }}>
                  {topPodium.location}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Completion Rate</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: '#2385bd', margin: 0 }}>{topPodium.completionRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Staff Rating</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: '#2385bd', margin: 0 }}>{topPodium.avgStaffRating}/5.0</p>
                  </div>
                </div>
              </div>
              <div style={{ border: '2px solid #f59e0b', borderRadius: '8px', padding: '16px', background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, #ffffff 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertCircle size={20} color="#f59e0b" />
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#f59e0b', margin: 0, textTransform: 'uppercase' }}>
                    Needs Attention
                  </p>
                </div>
                <p style={{ fontSize: '18px', fontWeight: '900', color: '#07111b', margin: '0 0 4px 0' }}>
                  {bottomPodium.name}
                </p>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0' }}>
                  {bottomPodium.location}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Completion Rate</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: '#f59e0b', margin: 0 }}>{bottomPodium.completionRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Staff Rating</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: '#f59e0b', margin: 0 }}>{bottomPodium.avgStaffRating}/5.0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Podium Breakdowns */}
          {data.map((podium, idx) => (
            <div key={podium.id} style={{ marginBottom: '32px' }}>
              {/* Podium Header */}
              <div style={{
                background: `linear-gradient(135deg, ${idx % 2 === 0 ? '#07111b' : '#9a7120'} 0%, ${idx % 2 === 0 ? '#0a4f7c' : '#c7a447'} 100%)`,
                padding: '20px',
                borderRadius: '8px 8px 0 0',
                marginBottom: '0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px solid rgba(255,255,255,0.4)'
                      }}>
                        <p style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                          {podium.id}
                        </p>
                      </div>
                      <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', margin: '0 0 4px 0' }}>
                          {podium.name}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} color="rgba(255,255,255,0.9)" />
                          <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                            {podium.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                      Kiosk ID
                    </p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                      JibeKiosk {podium.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Podium Content */}
              <div style={{ border: '2px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '24px' }}>
                {/* Key Metrics */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                    Performance Metrics
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', background: '#f9fafb' }}>
                      <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Total Surveys</p>
                      <p style={{ fontSize: '24px', fontWeight: '900', color: '#07111b', margin: 0 }}>{podium.totalSurveys}</p>
                    </div>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', background: '#f9fafb' }}>
                      <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Completed</p>
                      <p style={{ fontSize: '24px', fontWeight: '900', color: '#2385bd', margin: 0 }}>{podium.completedSurveys}</p>
                    </div>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', background: '#f9fafb' }}>
                      <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Completion Rate</p>
                      <p style={{ fontSize: '24px', fontWeight: '900', color: '#9a7120', margin: 0 }}>{podium.completionRate.toFixed(1)}%</p>
                    </div>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', background: '#f9fafb' }}>
                      <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Avg Time</p>
                      <p style={{ fontSize: '24px', fontWeight: '900', color: '#07111b', margin: 0 }}>{formatTime(podium.avgSurveyTime)}</p>
                    </div>
                  </div>
                </div>

                {/* Staff Performance */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                    Staff Performance
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div style={{ border: '2px solid #07111b', borderRadius: '6px', padding: '16px', background: 'linear-gradient(135deg, rgba(7,17,27,0.05) 0%, #ffffff 100%)' }}>
                      <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Staff Contact Rate</p>
                      <p style={{ fontSize: '28px', fontWeight: '900', color: '#07111b', margin: 0 }}>{podium.staffContactRate}%</p>
                    </div>
                    <div style={{ border: '2px solid #f59e0b', borderRadius: '6px', padding: '16px', background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, #ffffff 100%)' }}>
                      <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Avg Staff Rating</p>
                      <p style={{ fontSize: '28px', fontWeight: '900', color: '#f59e0b', margin: 0 }}>{podium.avgStaffRating}/5.0</p>
                    </div>
                    <div style={{ border: '2px solid #2385bd', borderRadius: '6px', padding: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, #ffffff 100%)' }}>
                      <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Peak Hours</p>
                      <p style={{ fontSize: '14px', fontWeight: '900', color: '#2385bd', margin: 0 }}>{podium.peakHours}</p>
                    </div>
                  </div>
                </div>

                {/* Top Missing Items */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                    Top Missing Items Reported
                  </h3>
                  <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'linear-gradient(to right, #9a7120, #c7a447)' }}>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Rank</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Team</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Item</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Size</th>
                          <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '10px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Reports</th>
                        </tr>
                      </thead>
                      <tbody>
                        {podium.topMissingItems.map((item, itemIdx) => (
                          <tr key={itemIdx} style={{ backgroundColor: itemIdx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                            <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '900', color: '#07111b' }}>#{itemIdx + 1}</td>
                            <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '900', color: '#1f2937' }}>{item.team}</td>
                            <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>{item.item}</td>
                            <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>{item.size}</td>
                            <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '900', color: '#9a7120', textAlign: 'right' }}>{item.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Friction Points */}
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                    Top Customer Friction Points
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    {podium.topFrictionPoints.map((friction, frictionIdx) => (
                      <div key={frictionIdx} style={{
                        border: '2px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '14px',
                        background: frictionIdx === 0 ? 'linear-gradient(135deg, rgba(154,113,32,0.08) 0%, #ffffff 100%)' : '#f9fafb'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: frictionIdx === 0 ? '#9a7120' : '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: '900'
                          }}>
                            {frictionIdx + 1}
                          </div>
                          <p style={{ fontSize: '11px', fontWeight: '900', color: '#1f2937', margin: 0 }}>
                            {friction.issue}
                          </p>
                        </div>
                        <p style={{ fontSize: '20px', fontWeight: '900', color: frictionIdx === 0 ? '#9a7120' : '#6b7280', margin: 0 }}>
                          {friction.count} reports
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Comparative Analysis */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#07111b', marginBottom: '12px', textTransform: 'uppercase' }}>
              Comparative Kiosk Analysis
            </h2>
            <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(to right, #07111b, #0a4f7c)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Kiosk</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Location</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Surveys</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Completion %</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Staff Contact %</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Staff Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((podium, idx) => (
                    <tr key={podium.id} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#07111b' }}>{podium.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>{podium.location}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#07111b', textAlign: 'right' }}>{podium.totalSurveys}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#2385bd', textAlign: 'right' }}>{podium.completionRate.toFixed(1)}%</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#9a7120', textAlign: 'right' }}>{podium.staffContactRate}%</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#f59e0b', textAlign: 'right' }}>{podium.avgStaffRating}/5.0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Insights */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#07111b', marginBottom: '12px', textTransform: 'uppercase' }}>
              Key Insights & Recommendations
            </h2>
            <div style={{ borderLeft: '4px solid #2385bd', padding: '20px', backgroundColor: '#eff6ff', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#2385bd', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                ✅ High Performance Areas
              </h3>
              <ul style={{ fontSize: '14px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                <li><strong>Red Line</strong> leads with 91.2% staff contact rate and 4.9/5.0 staff rating - excellent customer service model</li>
                <li><strong>Left Wing</strong> shows highest customer engagement with 312 total surveys, indicating strong traffic and interest</li>
                <li><strong>Center Lane</strong> demonstrates focused inventory needs with high concentration of specific fitted cap sizes</li>
              </ul>
            </div>

            <div style={{ borderLeft: '4px solid #9a7120', padding: '20px', backgroundColor: 'rgba(154,113,32,0.05)', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#9a7120', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                🚨 Critical Inventory Issues
              </h3>
              <ul style={{ fontSize: '14px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                <li><strong>Rangers merchandise</strong> dominates missing item reports across multiple kiosks, especially Panarin jerseys (L/XL) and fitted caps</li>
                <li><strong>Size availability</strong> is the #1 friction point at Center Lane (71 reports) and Blue Line (45 reports)</li>
                <li><strong>Game-used memorabilia</strong> shows consistent demand but limited supply across Left Wing and Right Wing</li>
              </ul>
            </div>

            <div style={{ borderLeft: '4px solid #07111b', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '0 8px 8px 0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                📊 Operational Recommendations
              </h3>
              <ol style={{ fontSize: '14px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                <li><strong>Inventory Redistribution:</strong> Prioritize Rangers merchandise at Left Wing and O-Zone based on high demand patterns</li>
                <li><strong>Staff Training:</strong> Replicate the Red Line kiosk customer service approach at lower-performing locations</li>
                <li><strong>Peak Hour Staffing:</strong> Increase staff presence during identified peak hours at each kiosk to maintain high contact rates</li>
                <li><strong>Size Matrix Optimization:</strong> Focus restocking on L/XL apparel and 7 1/4 - 7 3/8 fitted caps based on report data</li>
                <li><strong>Checkout Efficiency:</strong> Address long lines issue (top friction at 3 kiosks) with mobile checkout or additional registers during peak times</li>
              </ol>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '2px solid #e5e7eb', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0' }}>
              NHL Shop NYC Flagship Store • Kiosk Activity Report • Confidential
            </p>
            <p style={{ fontSize: '10px', color: '#d1d5db', margin: 0 }}>
              Generated on {format(new Date(), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
