import { X, Download, Mail, TrendingUp, Users, MapPin, Award, AlertCircle, ThumbsUp } from "lucide-react";
import { format } from "date-fns";
import { exportReportPdf } from "@/app/utils/exportReportPdf";
import { useRef } from "react";
import nhlLogo from "../../imports/NHL-league-logo.png";
import jibeRetailLogo from "../../imports/jibe-retail-official-logo.png";

type DateRange = {
  from: Date;
  to: Date;
};

type StaffSatisfactionReportProps = {
  dateRange: DateRange;
  onClose: () => void;
  isModal?: boolean;
};

type PodiumStaffData = {
  id: string;
  name: string;
  location: string;
  totalSurveys: number;
  talkedToStaff: number;
  staffContactRate: number; // percentage
  satisfactionBreakdown: {
    veryDissatisfied: number;
    dissatisfied: number;
    neutral: number;
    satisfied: number;
    verySatisfied: number;
  };
  overallSatisfactionScore: number; // percentage (satisfied + very satisfied)
};

type OverallMetrics = {
  totalSurveys: number;
  totalStaffInteractions: number;
  overallContactRate: number;
  overallSatisfactionScore: number;
  topPerformingPodium: string;
  lowestPerformingPodium: string;
};

const generateStaffData = (dateRange: DateRange): { podiums: PodiumStaffData[], overall: OverallMetrics } => {
  const podiums: PodiumStaffData[] = [
    {
      id: '1',
      name: 'O-Zone',
      location: 'Level 1 - Main Entrance',
      totalSurveys: 285,
      talkedToStaff: 235,
      staffContactRate: 82.5,
      satisfactionBreakdown: {
        veryDissatisfied: 2,
        dissatisfied: 5,
        neutral: 15,
        satisfied: 51,
        verySatisfied: 162
      },
      overallSatisfactionScore: 90.6 // (51 + 162) / 235 * 100
    },
    {
      id: '2',
      name: 'Left Wing',
      location: 'Level 1 - West',
      totalSurveys: 312,
      talkedToStaff: 275,
      staffContactRate: 88.2,
      satisfactionBreakdown: {
        veryDissatisfied: 2,
        dissatisfied: 3,
        neutral: 10,
        satisfied: 42,
        verySatisfied: 218
      },
      overallSatisfactionScore: 94.5 // (42 + 218) / 275 * 100
    },
    {
      id: '3',
      name: 'Right Wing',
      location: 'Level 1 - East',
      totalSurveys: 198,
      talkedToStaff: 152,
      staffContactRate: 76.8,
      satisfactionBreakdown: {
        veryDissatisfied: 2,
        dissatisfied: 3,
        neutral: 10,
        satisfied: 35,
        verySatisfied: 102
      },
      overallSatisfactionScore: 90.1 // (35 + 102) / 152 * 100
    },
    {
      id: '4',
      name: 'Center Lane',
      location: 'Level 2 - Top of Stairs',
      totalSurveys: 267,
      talkedToStaff: 229,
      staffContactRate: 85.8,
      satisfactionBreakdown: {
        veryDissatisfied: 2,
        dissatisfied: 3,
        neutral: 10,
        satisfied: 40,
        verySatisfied: 174
      },
      overallSatisfactionScore: 93.4 // (40 + 174) / 229 * 100
    },
    {
      id: '5',
      name: 'Blue Line',
      location: 'Level 2 - West',
      totalSurveys: 241,
      talkedToStaff: 196,
      staffContactRate: 81.3,
      satisfactionBreakdown: {
        veryDissatisfied: 2,
        dissatisfied: 3,
        neutral: 11,
        satisfied: 38,
        verySatisfied: 142
      },
      overallSatisfactionScore: 91.8 // (38 + 142) / 196 * 100
    },
    {
      id: '6',
      name: 'Red Line',
      location: 'Level 2 - East',
      totalSurveys: 147,
      talkedToStaff: 134,
      staffContactRate: 91.2,
      satisfactionBreakdown: {
        veryDissatisfied: 0,
        dissatisfied: 1,
        neutral: 2,
        satisfied: 13,
        verySatisfied: 118
      },
      overallSatisfactionScore: 97.8 // (13 + 118) / 134 * 100
    }
  ];

  const totalSurveys = podiums.reduce((sum, p) => sum + p.totalSurveys, 0);
  const totalStaffInteractions = podiums.reduce((sum, p) => sum + p.talkedToStaff, 0);
  const overallContactRate = (totalStaffInteractions / totalSurveys) * 100;

  // Calculate overall satisfaction score weighted by interactions
  const totalSatisfied = podiums.reduce((sum, p) =>
    sum + p.satisfactionBreakdown.satisfied + p.satisfactionBreakdown.verySatisfied, 0
  );
  const overallSatisfactionScore = (totalSatisfied / totalStaffInteractions) * 100;

  const topPodium = [...podiums].sort((a, b) => b.overallSatisfactionScore - a.overallSatisfactionScore)[0];
  const bottomPodium = [...podiums].sort((a, b) => a.overallSatisfactionScore - b.overallSatisfactionScore)[0];

  return {
    podiums,
    overall: {
      totalSurveys,
      totalStaffInteractions,
      overallContactRate,
      overallSatisfactionScore,
      topPerformingPodium: topPodium.name,
      lowestPerformingPodium: bottomPodium.name
    }
  };
};

export function StaffSatisfactionReport({ dateRange, onClose, isModal }: StaffSatisfactionReportProps) {
  const { podiums, overall } = generateStaffData(dateRange);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      await exportReportPdf({
        element: reportRef.current,
        title: "Staff Satisfaction Report",
        fileName: `NHL_Staff_Satisfaction_Report_${format(dateRange.from, "yyyy-MM-dd")}_to_${format(dateRange.to, "yyyy-MM-dd")}.pdf`,
      });
    } catch (error) {
      console.error('PDF Error:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleEmail = () => {
    const subject = `NHL Shop NYC Flagship - Staff Satisfaction Report (${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")})`;
    const body = `Please find the Staff Satisfaction Report for the period ${format(dateRange.from, "MMMM d, yyyy")} to ${format(dateRange.to, "MMMM d, yyyy")}.\n\nKey Metrics:\n- Total Staff Interactions: ${overall.totalStaffInteractions}\n- Overall Contact Rate: ${overall.overallContactRate.toFixed(1)}%\n- Overall Satisfaction Score: ${overall.overallSatisfactionScore.toFixed(1)}%\n- Top Performing Kiosk: ${overall.topPerformingPodium}`;

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
                  Staff Satisfaction Report
                </h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#6b7280', margin: 0 }}>
                    NHL Shop NYC Flagship Store - Comprehensive Staff Interaction & Customer Satisfaction Analysis
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
                    {overall.totalSurveys}
                  </p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #2385bd 0%, #167cb4 100%)', padding: '20px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    Staff Contact Rate
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                    {overall.overallContactRate.toFixed(1)}%
                  </p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '20px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    Satisfaction Score
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                    {overall.overallSatisfactionScore.toFixed(1)}%
                  </p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #9a7120 0%, #c7a447 100%)', padding: '20px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    Staff Interactions
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                    {overall.totalStaffInteractions}
                  </p>
                </div>
              </div>

              {/* Performance Highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ border: '2px solid #2385bd', borderRadius: '8px', padding: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, #ffffff 100%)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Award size={20} color="#2385bd" />
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2385bd', margin: 0, textTransform: 'uppercase' }}>
                      Top Performing Kiosk
                    </p>
                  </div>
                  <p style={{ fontSize: '18px', fontWeight: '900', color: '#07111b', margin: '0 0 4px 0' }}>
                    {overall.topPerformingPodium}
                  </p>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0' }}>
                    {podiums.find(p => p.name === overall.topPerformingPodium)?.location}
                  </p>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Satisfaction</p>
                      <p style={{ fontSize: '20px', fontWeight: '900', color: '#2385bd', margin: 0 }}>
                        {podiums.find(p => p.name === overall.topPerformingPodium)?.overallSatisfactionScore.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Contact Rate</p>
                      <p style={{ fontSize: '20px', fontWeight: '900', color: '#2385bd', margin: 0 }}>
                        {podiums.find(p => p.name === overall.topPerformingPodium)?.staffContactRate.toFixed(1)}%
                      </p>
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
                    {overall.lowestPerformingPodium}
                  </p>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0' }}>
                    {podiums.find(p => p.name === overall.lowestPerformingPodium)?.location}
                  </p>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Satisfaction</p>
                      <p style={{ fontSize: '20px', fontWeight: '900', color: '#f59e0b', margin: 0 }}>
                        {podiums.find(p => p.name === overall.lowestPerformingPodium)?.overallSatisfactionScore.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Contact Rate</p>
                      <p style={{ fontSize: '20px', fontWeight: '900', color: '#f59e0b', margin: 0 }}>
                        {podiums.find(p => p.name === overall.lowestPerformingPodium)?.staffContactRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Podium Breakdowns */}
            {podiums.map((podium, idx) => {
              const total = Object.values(podium.satisfactionBreakdown).reduce((a, b) => a + b, 0);

              return (
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
                            <Users size={24} color="#ffffff" />
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
                          Staff Satisfaction
                        </p>
                        <p style={{ fontSize: '36px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                          {podium.overallSatisfactionScore.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Podium Content */}
                  <div style={{ border: '2px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '24px' }}>
                    {/* Key Metrics */}
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                        Staff Interaction Metrics
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', background: '#f9fafb' }}>
                          <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Total Surveys</p>
                          <p style={{ fontSize: '24px', fontWeight: '900', color: '#07111b', margin: 0 }}>{podium.totalSurveys}</p>
                        </div>
                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', background: '#f9fafb' }}>
                          <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Talked to Staff</p>
                          <p style={{ fontSize: '24px', fontWeight: '900', color: '#2385bd', margin: 0 }}>{podium.talkedToStaff}</p>
                        </div>
                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', background: '#f9fafb' }}>
                          <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Contact Rate</p>
                          <p style={{ fontSize: '24px', fontWeight: '900', color: '#9a7120', margin: 0 }}>{podium.staffContactRate.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Satisfaction Breakdown */}
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                        Customer Satisfaction Breakdown
                      </h3>
                      <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', padding: '20px', background: '#ffffff' }}>
                        {[
                          { label: 'Very Satisfied', count: podium.satisfactionBreakdown.verySatisfied, color: '#2385bd' },
                          { label: 'Satisfied', count: podium.satisfactionBreakdown.satisfied, color: '#3b82f6' },
                          { label: 'Neutral', count: podium.satisfactionBreakdown.neutral, color: '#f59e0b' },
                          { label: 'Dissatisfied', count: podium.satisfactionBreakdown.dissatisfied, color: '#ef4444' },
                          { label: 'Very Dissatisfied', count: podium.satisfactionBreakdown.veryDissatisfied, color: '#9a7120' }
                        ].map((rating, ratingIdx) => {
                          const percentage = total > 0 ? (rating.count / total) * 100 : 0;
                          return (
                            <div key={ratingIdx} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '120px' }}>
                                <span style={{ fontSize: '14px', fontWeight: '900', color: '#1f2937' }}>{rating.label}</span>
                              </div>
                              <div style={{ flex: 1, height: '24px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                                <div style={{
                                  width: `${percentage}%`,
                                  height: '100%',
                                  background: `linear-gradient(to right, ${rating.color}, ${rating.color})`,
                                  transition: 'width 0.3s'
                                }}></div>
                              </div>
                              <div style={{ width: '120px', textAlign: 'right' }}>
                                <span style={{ fontSize: '14px', fontWeight: '900', color: '#1f2937' }}>
                                  {rating.count} ({percentage.toFixed(1)}%)
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Overall Satisfaction Score Display */}
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                        Overall Satisfaction Score
                      </h3>
                      <div style={{ border: '3px solid #2385bd', borderRadius: '8px', padding: '20px', background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, #ffffff 100%)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 4px 0' }}>
                              Satisfied + Very Satisfied
                            </p>
                            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                              {podium.satisfactionBreakdown.satisfied + podium.satisfactionBreakdown.verySatisfied} out of {total} responses
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '42px', fontWeight: '900', color: '#2385bd', margin: 0, lineHeight: '1' }}>
                              {podium.overallSatisfactionScore.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        <div style={{ height: '12px', background: '#f3f4f6', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: `${podium.overallSatisfactionScore}%`, height: '100%', background: 'linear-gradient(to right, #2385bd, #167cb4)' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Comparative Staff Performance Table */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#07111b', marginBottom: '12px', textTransform: 'uppercase' }}>
                Comparative Staff Performance by Kiosk
              </h2>
              <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(to right, #07111b, #0a4f7c)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Kiosk</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Location</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Contact Rate</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Interactions</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...podiums].sort((a, b) => b.overallSatisfactionScore - a.overallSatisfactionScore).map((podium, idx) => (
                      <tr key={podium.id} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#07111b' }}>{podium.name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>{podium.location}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#2385bd', textAlign: 'right' }}>{podium.staffContactRate.toFixed(1)}%</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#07111b', textAlign: 'right' }}>{podium.talkedToStaff}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#9a7120', textAlign: 'right' }}>{podium.overallSatisfactionScore.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Insights & Recommendations */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#07111b', marginBottom: '12px', textTransform: 'uppercase' }}>
                Key Insights & Recommendations
              </h2>

              <div style={{ borderLeft: '4px solid #2385bd', padding: '20px', backgroundColor: '#eff6ff', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#2385bd', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                  ✅ High Performance Areas
                </h3>
                <ul style={{ fontSize: '14px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                  <li><strong>Red Line</strong> leads with 97.8% satisfaction and 91.2% staff contact rate - excellent customer service model</li>
                  <li><strong>Left Wing</strong> demonstrates strong performance with 94.5% satisfaction and 88.2% contact rate</li>
                  <li><strong>Overall satisfaction</strong> is strong at {overall.overallSatisfactionScore.toFixed(1)}%, indicating positive customer experiences with staff</li>
                  <li><strong>High staff engagement</strong> with {overall.overallContactRate.toFixed(1)}% of customers talking to staff members</li>
                </ul>
              </div>

              <div style={{ borderLeft: '4px solid #f59e0b', padding: '20px', backgroundColor: 'rgba(245,158,11,0.05)', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#f59e0b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                  ⚠️ Areas for Improvement
                </h3>
                <ul style={{ fontSize: '14px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                  <li><strong>Right Wing</strong> shows lower staff contact rate (76.8%) and needs increased staff presence on the floor</li>
                  <li><strong>Staff visibility</strong> should be improved at locations with lower contact rates to ensure customers can easily find help</li>
                  <li><strong>Neutral and negative feedback</strong> exists at all locations - address specific pain points through training</li>
                </ul>
              </div>

              <div style={{ borderLeft: '4px solid #07111b', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '0 8px 8px 0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                  📊 Recommended Actions
                </h3>
                <ol style={{ fontSize: '14px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                  <li><strong>Best Practice Sharing:</strong> Document Red Line's approach (97.8% satisfaction) and replicate across all kiosks</li>
                  <li><strong>Staff Coverage:</strong> Increase floor presence at Right Wing and Blue Line during peak hours</li>
                  <li><strong>Proactive Engagement:</strong> Train staff to initiate customer interactions rather than waiting to be approached</li>
                  <li><strong>Follow-up on Negative Feedback:</strong> Review all dissatisfied responses and implement corrective measures</li>
                  <li><strong>Recognition Program:</strong> Reward staff at high-performing kiosks to encourage continued excellence</li>
                  <li><strong>Regular Monitoring:</strong> Track satisfaction scores weekly to identify trends and address issues quickly</li>
                </ol>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '2px solid #e5e7eb', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0' }}>
                NHL Shop NYC Flagship Store • Staff Satisfaction Report • Confidential
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
                Staff Satisfaction Report
              </h1>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#6b7280', margin: 0 }}>
                  NHL Shop NYC Flagship Store - Comprehensive Staff Interaction & Customer Satisfaction Analysis
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
                  {overall.totalSurveys}
                </p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #2385bd 0%, #167cb4 100%)', padding: '20px', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  Staff Contact Rate
                </p>
                <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                  {overall.overallContactRate.toFixed(1)}%
                </p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '20px', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  Satisfaction Score
                </p>
                <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                  {overall.overallSatisfactionScore.toFixed(1)}%
                </p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #9a7120 0%, #c7a447 100%)', padding: '20px', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  Staff Interactions
                </p>
                <p style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                  {overall.totalStaffInteractions}
                </p>
              </div>
            </div>

            {/* Performance Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ border: '2px solid #2385bd', borderRadius: '8px', padding: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, #ffffff 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Award size={20} color="#2385bd" />
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2385bd', margin: 0, textTransform: 'uppercase' }}>
                    Top Performing Kiosk
                  </p>
                </div>
                <p style={{ fontSize: '18px', fontWeight: '900', color: '#07111b', margin: '0 0 4px 0' }}>
                  {overall.topPerformingPodium}
                </p>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0' }}>
                  {podiums.find(p => p.name === overall.topPerformingPodium)?.location}
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Satisfaction</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: '#2385bd', margin: 0 }}>
                      {podiums.find(p => p.name === overall.topPerformingPodium)?.overallSatisfactionScore.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Contact Rate</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: '#2385bd', margin: 0 }}>
                      {podiums.find(p => p.name === overall.topPerformingPodium)?.staffContactRate.toFixed(1)}%
                    </p>
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
                  {overall.lowestPerformingPodium}
                </p>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0' }}>
                  {podiums.find(p => p.name === overall.lowestPerformingPodium)?.location}
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Satisfaction</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: '#f59e0b', margin: 0 }}>
                      {podiums.find(p => p.name === overall.lowestPerformingPodium)?.overallSatisfactionScore.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>Contact Rate</p>
                    <p style={{ fontSize: '20px', fontWeight: '900', color: '#f59e0b', margin: 0 }}>
                      {podiums.find(p => p.name === overall.lowestPerformingPodium)?.staffContactRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Podium Breakdowns */}
          {podiums.map((podium, idx) => {
            const total = Object.values(podium.satisfactionBreakdown).reduce((a, b) => a + b, 0);

            return (
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
                          <Users size={24} color="#ffffff" />
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
                        Staff Satisfaction
                      </p>
                      <p style={{ fontSize: '36px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                        {podium.overallSatisfactionScore.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Podium Content */}
                <div style={{ border: '2px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '24px' }}>
                  {/* Key Metrics */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                      Staff Interaction Metrics
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', background: '#f9fafb' }}>
                        <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Total Surveys</p>
                        <p style={{ fontSize: '24px', fontWeight: '900', color: '#07111b', margin: 0 }}>{podium.totalSurveys}</p>
                      </div>
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', background: '#f9fafb' }}>
                        <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Talked to Staff</p>
                        <p style={{ fontSize: '24px', fontWeight: '900', color: '#2385bd', margin: 0 }}>{podium.talkedToStaff}</p>
                      </div>
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', background: '#f9fafb' }}>
                        <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Contact Rate</p>
                        <p style={{ fontSize: '24px', fontWeight: '900', color: '#9a7120', margin: 0 }}>{podium.staffContactRate.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Satisfaction Breakdown */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                      Customer Satisfaction Breakdown
                    </h3>
                    <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', padding: '20px', background: '#ffffff' }}>
                      {[
                        { label: 'Very Satisfied', count: podium.satisfactionBreakdown.verySatisfied, color: '#2385bd' },
                        { label: 'Satisfied', count: podium.satisfactionBreakdown.satisfied, color: '#3b82f6' },
                        { label: 'Neutral', count: podium.satisfactionBreakdown.neutral, color: '#f59e0b' },
                        { label: 'Dissatisfied', count: podium.satisfactionBreakdown.dissatisfied, color: '#ef4444' },
                        { label: 'Very Dissatisfied', count: podium.satisfactionBreakdown.veryDissatisfied, color: '#9a7120' }
                      ].map((rating, ratingIdx) => {
                        const percentage = total > 0 ? (rating.count / total) * 100 : 0;
                        return (
                          <div key={ratingIdx} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '120px' }}>
                              <span style={{ fontSize: '14px', fontWeight: '900', color: '#1f2937' }}>{rating.label}</span>
                            </div>
                            <div style={{ flex: 1, height: '24px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                              <div style={{
                                width: `${percentage}%`,
                                height: '100%',
                                background: `linear-gradient(to right, ${rating.color}, ${rating.color})`,
                                transition: 'width 0.3s'
                              }}></div>
                            </div>
                            <div style={{ width: '120px', textAlign: 'right' }}>
                              <span style={{ fontSize: '14px', fontWeight: '900', color: '#1f2937' }}>
                                {rating.count} ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Overall Satisfaction Score Display */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                      Overall Satisfaction Score
                    </h3>
                    <div style={{ border: '3px solid #2385bd', borderRadius: '8px', padding: '20px', background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, #ffffff 100%)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 4px 0' }}>
                            Satisfied + Very Satisfied
                          </p>
                          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                            {podium.satisfactionBreakdown.satisfied + podium.satisfactionBreakdown.verySatisfied} out of {total} responses
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '42px', fontWeight: '900', color: '#2385bd', margin: 0, lineHeight: '1' }}>
                            {podium.overallSatisfactionScore.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div style={{ height: '12px', background: '#f3f4f6', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${podium.overallSatisfactionScore}%`, height: '100%', background: 'linear-gradient(to right, #2385bd, #167cb4)' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Comparative Staff Performance Table */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#07111b', marginBottom: '12px', textTransform: 'uppercase' }}>
              Comparative Staff Performance by Kiosk
            </h2>
            <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(to right, #07111b, #0a4f7c)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Kiosk</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Location</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Contact Rate</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Interactions</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '900', color: '#ffffff', textTransform: 'uppercase' }}>Satisfaction</th>
                  </tr>
                </thead>
                <tbody>
                  {[...podiums].sort((a, b) => b.overallSatisfactionScore - a.overallSatisfactionScore).map((podium, idx) => (
                    <tr key={podium.id} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#07111b' }}>{podium.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>{podium.location}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#2385bd', textAlign: 'right' }}>{podium.staffContactRate.toFixed(1)}%</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#07111b', textAlign: 'right' }}>{podium.talkedToStaff}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '900', color: '#9a7120', textAlign: 'right' }}>{podium.overallSatisfactionScore.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Insights & Recommendations */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#07111b', marginBottom: '12px', textTransform: 'uppercase' }}>
              Key Insights & Recommendations
            </h2>

            <div style={{ borderLeft: '4px solid #2385bd', padding: '20px', backgroundColor: '#eff6ff', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#2385bd', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                ✅ High Performance Areas
              </h3>
              <ul style={{ fontSize: '14px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                <li><strong>Red Line</strong> leads with 97.8% satisfaction and 91.2% staff contact rate - excellent customer service model</li>
                <li><strong>Left Wing</strong> demonstrates strong performance with 94.5% satisfaction and 88.2% contact rate</li>
                <li><strong>Overall satisfaction</strong> is strong at {overall.overallSatisfactionScore.toFixed(1)}%, indicating positive customer experiences with staff</li>
                <li><strong>High staff engagement</strong> with {overall.overallContactRate.toFixed(1)}% of customers talking to staff members</li>
              </ul>
            </div>

            <div style={{ borderLeft: '4px solid #f59e0b', padding: '20px', backgroundColor: 'rgba(245,158,11,0.05)', borderRadius: '0 8px 8px 0', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#f59e0b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                ⚠️ Areas for Improvement
              </h3>
              <ul style={{ fontSize: '14px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                <li><strong>Right Wing</strong> shows lower staff contact rate (76.8%) and needs increased staff presence on the floor</li>
                <li><strong>Staff visibility</strong> should be improved at locations with lower contact rates to ensure customers can easily find help</li>
                <li><strong>Neutral and negative feedback</strong> exists at all locations - address specific pain points through training</li>
              </ul>
            </div>

            <div style={{ borderLeft: '4px solid #07111b', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '0 8px 8px 0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#07111b', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                📊 Recommended Actions
              </h3>
              <ol style={{ fontSize: '14px', lineHeight: '1.7', color: '#4b5563', margin: '0 0 0 20px', padding: 0 }}>
                <li><strong>Best Practice Sharing:</strong> Document Red Line's approach (97.8% satisfaction) and replicate across all kiosks</li>
                <li><strong>Staff Coverage:</strong> Increase floor presence at Right Wing and Blue Line during peak hours</li>
                <li><strong>Proactive Engagement:</strong> Train staff to initiate customer interactions rather than waiting to be approached</li>
                <li><strong>Follow-up on Negative Feedback:</strong> Review all dissatisfied responses and implement corrective measures</li>
                <li><strong>Recognition Program:</strong> Reward staff at high-performing kiosks to encourage continued excellence</li>
                <li><strong>Regular Monitoring:</strong> Track satisfaction scores weekly to identify trends and address issues quickly</li>
              </ol>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '2px solid #e5e7eb', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', margin: '0 0 4px 0' }}>
              NHL Shop NYC Flagship Store • Staff Satisfaction Report • Confidential
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
