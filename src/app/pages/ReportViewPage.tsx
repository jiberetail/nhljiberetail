import { useNavigate, useParams, useSearchParams } from "react-router";
import { ArrowLeft, Download, Mail } from "lucide-react";
import { ExecutiveReport } from "@/app/components/ExecutiveReport";
import { OutOfStockReport } from "@/app/components/OutOfStockReport";
import { AbandonedSurveyReport } from "@/app/components/AbandonedSurveyReport";
import { PodiumActivityReport } from "@/app/components/PodiumActivityReport";
import { StaffSatisfactionReport } from "@/app/components/StaffSatisfactionReport";
import { ROIReport } from "@/app/components/ROIReport";

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
    <main className="flex-1 overflow-y-auto">
      {/* Back to Reports Button */}
      <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/reports")}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#041e42] to-[#0a2f5f] text-white rounded-lg hover:from-[#BC0022] hover:to-[#d4002a] transition-all shadow-md hover:shadow-lg font-bold text-sm"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            <span>Back to Reports</span>
          </button>

          {/* Download and Email Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleEmail}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#041e42] border-2 border-[#041e42] rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg font-bold text-sm"
            >
              <Mail size={16} strokeWidth={2.5} />
              <span>Email</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#041e42] to-[#0a2f5f] text-white rounded-lg hover:from-[#BC0022] hover:to-[#d4002a] transition-all shadow-md hover:shadow-lg font-bold text-sm"
            >
              <Download size={16} strokeWidth={2.5} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-[900px] ml-6">
        {renderReport()}
      </div>
    </main>
  );
}