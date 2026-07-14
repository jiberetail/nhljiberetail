import { X, Download, Mail, AlertTriangle, Clock, Users, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { exportReportPdf } from "@/app/utils/exportReportPdf";
import { useRef } from "react";
import nhlLogo from "../../imports/NHL-league-logo.png";
import jibeRetailLogo from "figma:asset/c9ceb1471dccd073ec86737828ad56cc026ab66e.png";

type DateRange = {
  from: Date;
  to: Date;
};

type AbandonedSurveyReportProps = {
  dateRange: DateRange;
  onClose: () => void;
  isModal?: boolean;
};

type SurveyScreen = {
  step: number;
  screenName: string;
  description: string;
  started: number;
  completed: number;
  abandoned: number;
  abandonmentRate: number;
  avgTimeOnScreen: number; // seconds
  avgTimeBeforeAbandon: number; // seconds
};

const generateAbandonedSurveyData = (dateRange: DateRange): SurveyScreen[] => {
  return [
    {
      step: 1,
      screenName: "Welcome Screen",
      description: "Initial survey introduction and start button",
      started: 1250,
      completed: 1225,
      abandoned: 25,
      abandonmentRate: 2.0,
      avgTimeOnScreen: 8,
      avgTimeBeforeAbandon: 5
    },
    {
      step: 2,
      screenName: "Store Experience Rating",
      description: "Overall satisfaction with store visit (1-5 stars)",
      started: 1225,
      completed: 1195,
      abandoned: 30,
      abandonmentRate: 2.4,
      avgTimeOnScreen: 10,
      avgTimeBeforeAbandon: 7
    },
    {
      step: 3,
      screenName: "Product Availability",
      description: "Questions about finding desired products",
      started: 1195,
      completed: 1165,
      abandoned: 30,
      abandonmentRate: 2.5,
      avgTimeOnScreen: 12,
      avgTimeBeforeAbandon: 8
    },
    {
      step: 4,
      screenName: "Missing Merchandise Form",
      description: "Detailed form for items customer couldn't find (Team, Item, Size, Gender)",
      started: 1165,
      completed: 1065,
      abandoned: 100,
      abandonmentRate: 8.6,
      avgTimeOnScreen: 22,
      avgTimeBeforeAbandon: 12
    },
    {
      step: 5,
      screenName: "Staff Interaction",
      description: "Did staff approach and offer assistance?",
      started: 1065,
      completed: 1040,
      abandoned: 25,
      abandonmentRate: 2.3,
      avgTimeOnScreen: 8,
      avgTimeBeforeAbandon: 6
    },
    {
      step: 6,
      screenName: "Staff Satisfaction Rating",
      description: "Rate staff helpfulness and knowledge (1-5 stars)",
      started: 1040,
      completed: 1020,
      abandoned: 20,
      abandonmentRate: 1.9,
      avgTimeOnScreen: 10,
      avgTimeBeforeAbandon: 7
    },
    {
      step: 7,
      screenName: "Store Friction Points",
      description: "Multi-select: Long lines, crowded, difficult navigation, etc.",
      started: 1020,
      completed: 995,
      abandoned: 25,
      abandonmentRate: 2.5,
      avgTimeOnScreen: 14,
      avgTimeBeforeAbandon: 9
    },
    {
      step: 8,
      screenName: "Purchase Information",
      description: "Did you make a purchase? If yes, estimated amount",
      started: 995,
      completed: 975,
      abandoned: 20,
      abandonmentRate: 2.0,
      avgTimeOnScreen: 10,
      avgTimeBeforeAbandon: 7
    },
    {
      step: 9,
      screenName: "Additional Comments",
      description: "Open text field for detailed feedback (optional)",
      started: 975,
      completed: 960,
      abandoned: 15,
      abandonmentRate: 1.5,
      avgTimeOnScreen: 10,
      avgTimeBeforeAbandon: 6
    },
    {
      step: 10,
      screenName: "Contact Information",
      description: "Optional email for follow-up and promotional offers",
      started: 960,
      completed: 950,
      abandoned: 10,
      abandonmentRate: 1.0,
      avgTimeOnScreen: 8,
      avgTimeBeforeAbandon: 5
    },
    {
      step: 11,
      screenName: "Survey Complete",
      description: "Thank you message and completion confirmation",
      started: 950,
      completed: 950,
      abandoned: 0,
      abandonmentRate: 0,
      avgTimeOnScreen: 5,
      avgTimeBeforeAbandon: 0
    }
  ];
};

export function AbandonedSurveyReport({ dateRange, onClose, isModal }: AbandonedSurveyReportProps) {
  const data = generateAbandonedSurveyData(dateRange);
  const reportRef = useRef<HTMLDivElement>(null);

  const totalStarted = data[0].started;
  const totalCompleted = data[data.length - 1].completed;
  const totalAbandoned = totalStarted - totalCompleted;
  const overallAbandonmentRate = ((totalAbandoned / totalStarted) * 100).toFixed(1);
  const completionRate = ((totalCompleted / totalStarted) * 100).toFixed(1);

  // Calculate average survey time for completed
  const avgCompletionTime = data.slice(0, -1).reduce((sum, screen) => sum + screen.avgTimeOnScreen, 0);
  const avgAbandonTime = data.slice(0, -1).reduce((sum, screen) => sum + screen.avgTimeBeforeAbandon, 0) / data.length;

  // Identify highest abandonment screens
  const topAbandonmentScreens = [...data]
    .sort((a, b) => b.abandonmentRate - a.abandonmentRate)
    .slice(0, 3);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      await exportReportPdf({
        element: reportRef.current,
        title: "Abandoned Survey Report",
        fileName: `NHL_Abandoned_Survey_Report_${format(dateRange.from, "yyyy-MM-dd")}_to_${format(dateRange.to, "yyyy-MM-dd")}.pdf`,
      });
    } catch (error) {
      console.error('PDF Error:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleEmail = () => {
    const subject = `NHL Shop NYC Flagship - Abandoned Survey Report (${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")})`;
    const body = `Please find the Abandoned Survey Report for the period ${format(dateRange.from, "MMMM d, yyyy")} to ${format(dateRange.to, "MMMM d, yyyy")}.\n\nKey Metrics:\n- Total Surveys Started: ${totalStarted}\n- Total Completed: ${totalCompleted}\n- Total Abandoned: ${totalAbandoned}\n- Abandonment Rate: ${overallAbandonmentRate}%\n- Completion Rate: ${completionRate}%\n\nHighest Abandonment:\n${topAbandonmentScreens.map(s => `- ${s.screenName}: ${s.abandonmentRate}%`).join('\n')}`;

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
          <div ref={reportRef} style={{
            backgroundColor: '#ffffff',
            padding: '40px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#1f2937'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <img src={nhlLogo} alt="NHL" style={{ height: '56px' }} />
                <img src={jibeRetailLogo} alt="Jibe Retail" style={{ height: '80px' }} />
              </div>
              <div style={{ borderBottom: '3px solid #041e42', paddingBottom: '12px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#041e42', margin: '0 0 8px 0' }}>
                  Abandoned Survey Report
                </h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#6b7280', margin: 0 }}>
                    NHL Shop NYC Flagship Store - Survey Flow & Abandonment Analysis
                  </p>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                      Report Period
                    </p>
                    <p style={{ fontSize: '16px', fontWeight: '900', color: '#BC0022', margin: 0 }}>
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
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#041e42', marginBottom: '12px', textTransform: 'uppercase' }}>
                Executive Summary
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'linear-gradient(135deg, #041e42 0%, #0a2f5f 100%)', padding: '20px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    Surveys Started
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                    {totalStarted}
                  </p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '20px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    Completed
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                    {totalCompleted}
                  </p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #BC0022 0%, #d4002a 100%)', padding: '20px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    Abandoned
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                    {totalAbandoned}
                  </p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '20px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    Completion Rate
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                    {completionRate}%
                  </p>
                </div>
              </div>
            </div>

            {/* Critical Abandonment Points */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#041e42', marginBottom: '12px', textTransform: 'uppercase' }}>
                Critical Abandonment Points
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {topAbandonmentScreens.map((screen, idx) => (
                  <div key={idx} style={{ border: '2px solid #BC0022', borderRadius: '8px', padding: '16px', background: 'linear-gradient(135deg, rgba(188,0,34,0.05) 0%, #ffffff 100%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#BC0022', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '900', fontSize: '14px' }}>
                        {idx + 1}
                      </div>
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Step {screen.step}</p>
                        <p style={{ fontSize: '12px', fontWeight: '900', color: '#1f2937', margin: 0 }}>{screen.screenName}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: '28px', fontWeight: '900', color: '#BC0022', margin: '8px 0 4px 0' }}>
                      {screen.abandonmentRate}%
                    </p>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280', margin: 0 }}>
                      {screen.abandoned} users abandoned
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Survey Flow Visualization */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#041e42', marginBottom: '12px', textTransform: 'uppercase' }}>
                Survey Flow & Abandonment Funnel
              </h2>
              <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', padding: '24px', background: '#f9fafb' }}>
                {data.map((screen, idx) => {
                  const isHighAbandonment = screen.abandonmentRate >= 10;
                  const progressWidth = (screen.started / totalStarted) * 100;
                  const completedWidth = (screen.completed / totalStarted) * 100;
                  const abandonedWidth = progressWidth - completedWidth;

                  return (
                    <div key={idx} style={{ marginBottom: idx < data.length - 1 ? '20px' : 0 }}>
                      {/* Screen Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: isHighAbandonment ? '#BC0022' : '#041e42',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: '900',
                            fontSize: '16px'
                          }}>
                            {screen.step}
                          </div>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '900', color: '#1f2937', margin: 0 }}>
                              {screen.screenName}
                              {isHighAbandonment && (
                                <span style={{ marginLeft: '8px', fontSize: '11px', fontWeight: 'bold', color: '#BC0022', textTransform: 'uppercase' }}>
                                  ⚠ High Abandonment
                                </span>
                              )}
                            </p>
                            <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                              {screen.description}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '18px', fontWeight: '900', color: isHighAbandonment ? '#BC0022' : '#041e42', margin: 0 }}>
                            {screen.abandonmentRate.toFixed(1)}%
                          </p>
                          <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>
                            Abandon Rate
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ width: '100%', height: '32px', backgroundColor: '#e5e7eb', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px', position: 'relative' }}>
                        <div style={{
                          width: `${completedWidth}%`,
                          height: '100%',
                          background: 'linear-gradient(to right, #10b981, #059669)',
                          position: 'absolute',
                          left: 0,
                          top: 0
                        }}></div>
                        <div style={{
                          width: `${abandonedWidth}%`,
                          height: '100%',
                          background: 'linear-gradient(to right, #BC0022, #d4002a)',
                          position: 'absolute',
                          left: `${completedWidth}%`,
                          top: 0
                        }}></div>
                      </div>

                      {/* Stats Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '8px' }}>
                        <div style={{ background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                          <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Started</p>
                          <p style={{ fontSize: '16px', fontWeight: '900', color: '#041e42', margin: 0 }}>{screen.started}</p>
                        </div>
                        <div style={{ background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                          <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Completed</p>
                          <p style={{ fontSize: '16px', fontWeight: '900', color: '#10b981', margin: 0 }}>{screen.completed}</p>
                        </div>
                        <div style={{ background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                          <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Abandoned</p>
                          <p style={{ fontSize: '16px', fontWeight: '900', color: '#BC0022', margin: 0 }}>{screen.abandoned}</p>
                        </div>
                        <div style={{ background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                          <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Avg Time</p>
                          <p style={{ fontSize: '16px', fontWeight: '900', color: '#041e42', margin: 0 }}>{formatTime(screen.avgTimeOnScreen)}</p>
                        </div>
                        <div style={{ background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                          <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Time @ Abandon</p>
                          <p style={{ fontSize: '16px', fontWeight: '900', color: '#BC0022', margin: 0 }}>{formatTime(screen.avgTimeBeforeAbandon)}</p>
                        </div>
                        <div style={{ background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                          <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Drop-off</p>
                          <p style={{ fontSize: '16px', fontWeight: '900', color: '#f59e0b', margin: 0 }}>{screen.abandoned > 0 ? '-' + screen.abandoned : '0'}</p>
                        </div>
                      </div>

                      {/* Connector Arrow */}
                      {idx < data.length - 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                          <div style={{ width: '2px', height: '20px', background: '#d1d5db' }}></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Analysis */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#041e42', marginBottom: '12px', textTransform: 'uppercase' }}>
                Time Analysis
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ border: '2px solid #041e42', borderRadius: '8px', padding: '20px', background: 'linear-gradient(135deg, rgba(4,30,66,0.05) 0%, #ffffff 100%)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ padding: '10px', background: '#041e42', borderRadius: '8px' }}>
                      <Clock size={24} color="#ffffff" />
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>
                        Avg Time to Complete
                      </p>
                      <p style={{ fontSize: '32px', fontWeight: '900', color: '#041e42', margin: 0 }}>
                        {formatTime(avgCompletionTime)}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                    Average time spent by users who successfully completed the entire survey
                  </p>
                </div>
                <div style={{ border: '2px solid #BC0022', borderRadius: '8px', padding: '20px', background: 'linear-gradient(135deg, rgba(188,0,34,0.05) 0%, #ffffff 100%)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ padding: '10px', background: '#BC0022', borderRadius: '8px' }}>
                      <TrendingDown size={24} color="#ffffff" />
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>
                        Avg Time Before Abandon
                      </p>
                      <p style={{ fontSize: '32px', fontWeight: '900', color: '#BC0022', margin: 0 }}>
                        {formatTime(Math.round(avgAbandonTime))}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                    Average time spent by users before abandoning the survey
                  </p>
                </div>
              </div>
            </div>

            {/* Key Insights & Recommendations */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#041e42', marginBottom: '12px', textTransform: 'uppercase' }}>
                Key Insights & Recommendations
              </h2>
              <div style={{ borderLeft: '4px solid #f59e0b', padding: '20px', backgroundColor: '#fffbeb', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#f59e0b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                  ⚠️ Primary Concern: Missing Merchandise Form (Step 4)
                </h3>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', margin: '0 0 12px 0' }}>
                  The <strong>Missing Merchandise Form</strong> has the highest abandonment rate at <strong>8.6%</strong> with 100 users dropping off.
                  This screen requires detailed input (Team, Item, Size, Gender) and takes an average of 95 seconds, but users are abandoning
                  after only 48 seconds - suggesting form complexity or length is a barrier.
                </p>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#041e42', margin: '0 0 8px 0' }}>RECOMMENDED ACTIONS:</p>
                <ul style={{ fontSize: '13px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                  <li>Simplify form with auto-complete/dropdown menus instead of free text</li>
                  <li>Break into smaller steps with progress indicator</li>
                  <li>Make form optional or add "Skip" button with clear labeling</li>
                  <li>Pre-populate common items based on store inventory for faster selection</li>
                </ul>
              </div>

              <div style={{ borderLeft: '4px solid #10b981', padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#10b981', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                  ✅ Excellent Performance: Overall Survey Flow
                </h3>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', margin: '0 0 12px 0' }}>
                  With a <strong>76% completion rate</strong> and most screens maintaining abandonment rates under <strong>3%</strong>, the survey
                  demonstrates strong user engagement and efficient design. Core experience screens (rating questions, staff interactions) are
                  performing exceptionally well.
                </p>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#041e42', margin: '0 0 8px 0' }}>BEST PRACTICES TO MAINTAIN:</p>
                <ul style={{ fontSize: '13px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                  <li>Keep single-question screens with clear rating scales (1-5 stars)</li>
                  <li>Use visual elements (stars, buttons, multi-select) over text input</li>
                  <li>Maintain quick interaction times (15-30 seconds per screen)</li>
                  <li>Continue the current flow structure for consistency</li>
                </ul>
              </div>

              <div style={{ borderLeft: '4px solid #041e42', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '0 8px 8px 0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#041e42', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                  📊 Opportunity: Optimize Optional Fields (Steps 9-10)
                </h3>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', margin: '0 0 12px 0' }}>
                  Additional Comments and Contact Information screens show minimal abandonment (<strong>1-1.5%</strong>) but could capture even more
                  data with strategic incentives and clearer value propositions for users.
                </p>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#041e42', margin: '0 0 8px 0' }}>OPTIMIZATION OPPORTUNITIES:</p>
                <ul style={{ fontSize: '13px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                  <li>Add incentive messaging (e.g., "Enter email for exclusive offers and 10% off")</li>
                  <li>Test moving contact information earlier in survey for higher completion</li>
                  <li>A/B test comment field prominence to increase qualitative feedback</li>
                  <li>Consider gamification elements to boost engagement on optional sections</li>
                </ul>
              </div>
            </div>

            {/* Summary Table */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#041e42', marginBottom: '12px', textTransform: 'uppercase' }}>
                Complete Survey Metrics Summary
              </h2>
              <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(to right, #041e42, #0a2f5f)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Step</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Screen Name</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Started</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Completed</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Abandoned</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Abandon %</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Avg Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, -1).map((screen, idx) => {
                      const isHighAbandonment = screen.abandonmentRate >= 10;
                      return (
                        <tr key={idx} style={{ backgroundColor: isHighAbandonment ? 'rgba(188,0,34,0.05)' : (idx % 2 === 0 ? '#ffffff' : '#f9fafb') }}>
                          <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#041e42' }}>{screen.step}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>{screen.screenName}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#041e42', textAlign: 'right' }}>{screen.started}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#10b981', textAlign: 'right' }}>{screen.completed}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#BC0022', textAlign: 'right' }}>{screen.abandoned}</td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: isHighAbandonment ? '#BC0022' : '#6b7280', textAlign: 'right' }}>
                            {screen.abandonmentRate.toFixed(1)}%
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#041e42', textAlign: 'right' }}>{formatTime(screen.avgTimeOnScreen)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '2px solid #e5e7eb', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0' }}>
                NHL Shop NYC Flagship Store • Abandoned Survey Report • Confidential
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
            color: '#041e42',
            border: '2px solid #041e42',
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
            backgroundColor: '#041e42',
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
        <div ref={reportRef} style={{
          backgroundColor: '#ffffff',
          padding: '40px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#1f2937'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <img src={nhlLogo} alt="NHL" style={{ height: '56px' }} />
              <img src={jibeRetailLogo} alt="Jibe Retail" style={{ height: '80px' }} />
            </div>
            <div style={{ borderBottom: '3px solid #041e42', paddingBottom: '12px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#041e42', margin: '0 0 8px 0' }}>
                Abandoned Survey Report
              </h1>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#6b7280', margin: 0 }}>
                  NHL Shop NYC Flagship Store - Survey Flow & Abandonment Analysis
                </p>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                    Report Period
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '900', color: '#BC0022', margin: 0 }}>
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
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#041e42', marginBottom: '12px', textTransform: 'uppercase' }}>
              Executive Summary
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'linear-gradient(135deg, #041e42 0%, #0a2f5f 100%)', padding: '20px', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  Surveys Started
                </p>
                <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                  {totalStarted}
                </p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '20px', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  Completed
                </p>
                <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                  {totalCompleted}
                </p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #BC0022 0%, #d4002a 100%)', padding: '20px', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  Abandoned
                </p>
                <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                  {totalAbandoned}
                </p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '20px', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  Completion Rate
                </p>
                <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                  {completionRate}%
                </p>
              </div>
            </div>
          </div>

          {/* Critical Abandonment Points */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#041e42', marginBottom: '12px', textTransform: 'uppercase' }}>
              Critical Abandonment Points
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {topAbandonmentScreens.map((screen, idx) => (
                <div key={idx} style={{ border: '2px solid #BC0022', borderRadius: '8px', padding: '16px', background: 'linear-gradient(135deg, rgba(188,0,34,0.05) 0%, #ffffff 100%)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#BC0022', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '900', fontSize: '14px' }}>
                      {idx + 1}
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Step {screen.step}</p>
                      <p style={{ fontSize: '12px', fontWeight: '900', color: '#1f2937', margin: 0 }}>{screen.screenName}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '28px', fontWeight: '900', color: '#BC0022', margin: '8px 0 4px 0' }}>
                    {screen.abandonmentRate}%
                  </p>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#6b7280', margin: 0 }}>
                    {screen.abandoned} users abandoned
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Survey Flow Visualization */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#041e42', marginBottom: '12px', textTransform: 'uppercase' }}>
              Survey Flow & Abandonment Funnel
            </h2>
            <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', padding: '24px', background: '#f9fafb' }}>
              {data.map((screen, idx) => {
                const isHighAbandonment = screen.abandonmentRate >= 10;
                const progressWidth = (screen.started / totalStarted) * 100;
                const completedWidth = (screen.completed / totalStarted) * 100;
                const abandonedWidth = progressWidth - completedWidth;

                return (
                  <div key={idx} style={{ marginBottom: idx < data.length - 1 ? '20px' : 0 }}>
                    {/* Screen Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: isHighAbandonment ? '#BC0022' : '#041e42',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: '900',
                          fontSize: '16px'
                        }}>
                          {screen.step}
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '900', color: '#1f2937', margin: 0 }}>
                            {screen.screenName}
                            {isHighAbandonment && (
                              <span style={{ marginLeft: '8px', fontSize: '11px', fontWeight: 'bold', color: '#BC0022', textTransform: 'uppercase' }}>
                                ⚠ High Abandonment
                              </span>
                            )}
                          </p>
                          <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                            {screen.description}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '18px', fontWeight: '900', color: isHighAbandonment ? '#BC0022' : '#041e42', margin: 0 }}>
                          {screen.abandonmentRate.toFixed(1)}%
                        </p>
                        <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>
                          Abandon Rate
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '32px', backgroundColor: '#e5e7eb', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px', position: 'relative' }}>
                      <div style={{
                        width: `${completedWidth}%`,
                        height: '100%',
                        background: 'linear-gradient(to right, #10b981, #059669)',
                        position: 'absolute',
                        left: 0,
                        top: 0
                      }}></div>
                      <div style={{
                        width: `${abandonedWidth}%`,
                        height: '100%',
                        background: 'linear-gradient(to right, #BC0022, #d4002a)',
                        position: 'absolute',
                        left: `${completedWidth}%`,
                        top: 0
                      }}></div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '8px' }}>
                      <div style={{ background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Started</p>
                        <p style={{ fontSize: '16px', fontWeight: '900', color: '#041e42', margin: 0 }}>{screen.started}</p>
                      </div>
                      <div style={{ background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Completed</p>
                        <p style={{ fontSize: '16px', fontWeight: '900', color: '#10b981', margin: 0 }}>{screen.completed}</p>
                      </div>
                      <div style={{ background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Abandoned</p>
                        <p style={{ fontSize: '16px', fontWeight: '900', color: '#BC0022', margin: 0 }}>{screen.abandoned}</p>
                      </div>
                      <div style={{ background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Avg Time</p>
                        <p style={{ fontSize: '16px', fontWeight: '900', color: '#041e42', margin: 0 }}>{formatTime(screen.avgTimeOnScreen)}</p>
                      </div>
                      <div style={{ background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Time @ Abandon</p>
                        <p style={{ fontSize: '16px', fontWeight: '900', color: '#BC0022', margin: 0 }}>{formatTime(screen.avgTimeBeforeAbandon)}</p>
                      </div>
                      <div style={{ background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Drop-off</p>
                        <p style={{ fontSize: '16px', fontWeight: '900', color: '#f59e0b', margin: 0 }}>{screen.abandoned > 0 ? '-' + screen.abandoned : '0'}</p>
                      </div>
                    </div>

                    {/* Connector Arrow */}
                    {idx < data.length - 1 && (
                      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                        <div style={{ width: '2px', height: '20px', background: '#d1d5db' }}></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Analysis */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#041e42', marginBottom: '12px', textTransform: 'uppercase' }}>
              Time Analysis
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ border: '2px solid #041e42', borderRadius: '8px', padding: '20px', background: 'linear-gradient(135deg, rgba(4,30,66,0.05) 0%, #ffffff 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ padding: '10px', background: '#041e42', borderRadius: '8px' }}>
                    <Clock size={24} color="#ffffff" />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>
                      Avg Time to Complete
                    </p>
                    <p style={{ fontSize: '32px', fontWeight: '900', color: '#041e42', margin: 0 }}>
                      {formatTime(avgCompletionTime)}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                  Average time spent by users who successfully completed the entire survey
                </p>
              </div>
              <div style={{ border: '2px solid #BC0022', borderRadius: '8px', padding: '20px', background: 'linear-gradient(135deg, rgba(188,0,34,0.05) 0%, #ffffff 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ padding: '10px', background: '#BC0022', borderRadius: '8px' }}>
                    <TrendingDown size={24} color="#ffffff" />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>
                      Avg Time Before Abandon
                    </p>
                    <p style={{ fontSize: '32px', fontWeight: '900', color: '#BC0022', margin: 0 }}>
                      {formatTime(Math.round(avgAbandonTime))}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                  Average time spent by users before abandoning the survey
                </p>
              </div>
            </div>
          </div>

          {/* Key Insights & Recommendations */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#041e42', marginBottom: '12px', textTransform: 'uppercase' }}>
              Key Insights & Recommendations
            </h2>
            <div style={{ borderLeft: '4px solid #f59e0b', padding: '20px', backgroundColor: '#fffbeb', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#f59e0b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                ⚠️ Primary Concern: Missing Merchandise Form (Step 4)
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', margin: '0 0 12px 0' }}>
                The <strong>Missing Merchandise Form</strong> has the highest abandonment rate at <strong>8.6%</strong> with 100 users dropping off.
                This screen requires detailed input (Team, Item, Size, Gender) and takes an average of 95 seconds, but users are abandoning
                after only 48 seconds - suggesting form complexity or length is a barrier.
              </p>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#041e42', margin: '0 0 8px 0' }}>RECOMMENDED ACTIONS:</p>
              <ul style={{ fontSize: '13px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                <li>Simplify form with auto-complete/dropdown menus instead of free text</li>
                <li>Break into smaller steps with progress indicator</li>
                <li>Make form optional or add "Skip" button with clear labeling</li>
                <li>Pre-populate common items based on store inventory for faster selection</li>
              </ul>
            </div>

            <div style={{ borderLeft: '4px solid #10b981', padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#10b981', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                ✅ Excellent Performance: Overall Survey Flow
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', margin: '0 0 12px 0' }}>
                With a <strong>76% completion rate</strong> and most screens maintaining abandonment rates under <strong>3%</strong>, the survey
                demonstrates strong user engagement and efficient design. Core experience screens (rating questions, staff interactions) are
                performing exceptionally well.
              </p>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#041e42', margin: '0 0 8px 0' }}>BEST PRACTICES TO MAINTAIN:</p>
              <ul style={{ fontSize: '13px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                <li>Keep single-question screens with clear rating scales (1-5 stars)</li>
                <li>Use visual elements (stars, buttons, multi-select) over text input</li>
                <li>Maintain quick interaction times (15-30 seconds per screen)</li>
                <li>Continue the current flow structure for consistency</li>
              </ul>
            </div>

            <div style={{ borderLeft: '4px solid #041e42', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '0 8px 8px 0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#041e42', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                📊 Opportunity: Optimize Optional Fields (Steps 9-10)
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', margin: '0 0 12px 0' }}>
                Additional Comments and Contact Information screens show minimal abandonment (<strong>1-1.5%</strong>) but could capture even more
                data with strategic incentives and clearer value propositions for users.
              </p>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#041e42', margin: '0 0 8px 0' }}>OPTIMIZATION OPPORTUNITIES:</p>
              <ul style={{ fontSize: '13px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                <li>Add incentive messaging (e.g., "Enter email for exclusive offers and 10% off")</li>
                <li>Test moving contact information earlier in survey for higher completion</li>
                <li>A/B test comment field prominence to increase qualitative feedback</li>
                <li>Consider gamification elements to boost engagement on optional sections</li>
              </ul>
            </div>
          </div>

          {/* Summary Table */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#041e42', marginBottom: '12px', textTransform: 'uppercase' }}>
              Complete Survey Metrics Summary
            </h2>
            <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(to right, #041e42, #0a2f5f)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Step</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Screen Name</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Started</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Completed</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Abandoned</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Abandon %</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Avg Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, -1).map((screen, idx) => {
                    const isHighAbandonment = screen.abandonmentRate >= 10;
                    return (
                      <tr key={idx} style={{ backgroundColor: isHighAbandonment ? 'rgba(188,0,34,0.05)' : (idx % 2 === 0 ? '#ffffff' : '#f9fafb') }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#041e42' }}>{screen.step}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>{screen.screenName}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#041e42', textAlign: 'right' }}>{screen.started}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#10b981', textAlign: 'right' }}>{screen.completed}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#BC0022', textAlign: 'right' }}>{screen.abandoned}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: isHighAbandonment ? '#BC0022' : '#6b7280', textAlign: 'right' }}>
                          {screen.abandonmentRate.toFixed(1)}%
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#041e42', textAlign: 'right' }}>{formatTime(screen.avgTimeOnScreen)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '2px solid #e5e7eb', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0' }}>
              NHL Shop NYC Flagship Store • Abandoned Survey Report • Confidential
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
