import { useNavigate, useParams, useSearchParams } from "react-router";
import { ArrowLeft, Download, Mail } from "lucide-react";
import { ExecutiveReport } from "@/app/components/ExecutiveReport";
import { OutOfStockReport } from "@/app/components/OutOfStockReport";
import { AbandonedSurveyReport } from "@/app/components/AbandonedSurveyReport";
import { PodiumActivityReport } from "@/app/components/PodiumActivityReport";
import { StaffSatisfactionReport } from "@/app/components/StaffSatisfactionReport";
import { ROIReport } from "@/app/components/ROIReport";
import { NhlPageShell } from "@/app/components/NhlPageShell";
import jibeRetailLogo from "../../imports/jibe-retail-official-logo.png";

export function ReportViewPage() {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [searchParams] = useSearchParams();

  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");

  const dateRange = {
    from: fromDate ? new Date(fromDate) : new Date(),
    to: toDate ? new Date(toDate) : new Date(),
  };

  const handleDownload = () => {
    const downloadButton = document.querySelector('[data-report-download]') as HTMLButtonElement;
    if (downloadButton) {
      downloadButton.click();
    }
  };

  const handleEmail = () => {
    const emailButton = document.querySelector('[data-report-email]') as HTMLButtonElement;
    if (emailButton) {
      emailButton.click();
    }
  };

  const renderReport = () => {
    switch (reportId) {
      case "executive":
        return <ExecutiveReport dateRange={dateRange} onClose={() => {}} isModal={false} />;
      case "outofstock":
        return <OutOfStockReport dateRange={dateRange} onClose={() => {}} isModal={false} />;
      case "abandoned":
        return <AbandonedSurveyReport dateRange={dateRange} onClose={() => {}} isModal={false} />;
      case "podium":
        return <PodiumActivityReport dateRange={dateRange} onClose={() => {}} isModal={false} />;
      case "satisfaction":
        return <StaffSatisfactionReport dateRange={dateRange} onClose={() => {}} isModal={false} />;
      case "roi":
        return <ROIReport dateRange={dateRange} onClose={() => {}} isModal={false} />;
      default:
        return <div className="text-center text-gray-600 py-12">Report not found</div>;
    }
  };

  return (
    <NhlPageShell>
      {/* Back to Reports Button */}
      <div className="sticky top-0 z-10 bg-[#07111b]/95 backdrop-blur-xl border-b border-[#e2c36b]/60 shadow-2xl">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/reports")}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#e2c36b]/75 bg-black/30 text-[#f4dc91] rounded-lg hover:bg-[#e2c36b] hover:text-[#07111b] transition-all shadow-md hover:shadow-lg font-bold text-sm"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              <span>Back to Reports</span>
            </button>
            <div className="bg-white/95 border border-[#e2c36b]/60 rounded-lg px-2.5 py-1 shadow-lg">
              <img src={jibeRetailLogo} alt="Jibe Retail" className="h-9 w-auto object-contain" />
            </div>
          </div>

          {/* Download and Email Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleEmail}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#d8dde2] text-[#07111b] border border-white/70 rounded-lg hover:bg-white transition-all shadow-md hover:shadow-lg font-bold text-sm"
            >
              <Mail size={16} strokeWidth={2.5} />
              <span>Email</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0a4f7c] to-[#2385bd] text-white rounded-lg hover:from-[#167cb4] hover:to-[#36a1d5] transition-all shadow-md hover:shadow-lg font-bold text-sm"
            >
              <Download size={16} strokeWidth={2.5} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-[1040px] px-6 pb-10">
        {renderReport()}
      </div>
    </NhlPageShell>
  );
}
