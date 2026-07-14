import { HashRouter as Router, Routes, Route } from "react-router";
import { DateRangeProvider } from "@/app/contexts/DateRangeContext";
import { InventoryProvider } from "@/app/contexts/InventoryContext";
import { Sidebar } from "@/app/components/Sidebar";
import { Dashboard } from "@/app/components/Dashboard";
import { DashboardV2 } from "@/app/components/DashboardV2";
import { DashboardV3 } from "@/app/components/DashboardV3";
import { SettingsPage } from "@/app/pages/SettingsPage";
import { ReportsPage } from "@/app/pages/ReportsPage";
import { ReportViewPage } from "@/app/pages/ReportViewPage";
import { SurveyPage } from "@/app/pages/SurveyPage";
import { SurveyPageV2 } from "@/app/pages/SurveyPageV2";
import { StoreSurveyPage } from "@/app/pages/StoreSurveyPage";
import iceBg from "../imports/85f8180c-bb6f-4cd0-974f-41394de11f27__1_.jpg";

export default function App() {
  return (
    <Router>
      <DateRangeProvider>
        <InventoryProvider>
          <div className="size-full flex relative">
            {/* Ice rink background image */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                backgroundImage: `
                  linear-gradient(to bottom, rgba(240, 245, 250, 0.72), rgba(240, 245, 250, 0.78)),
                  url(${iceBg})
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />

            <div className="relative z-10 flex size-full">
              <Sidebar />
              <Routes>
                <Route path="/" element={<DashboardV2 />} />
                <Route path="/dashboard-v2" element={<Dashboard />} />
                <Route path="/dashboard-v3" element={<DashboardV3 />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/reports/:reportId" element={<ReportViewPage />} />
                <Route path="/survey" element={<SurveyPage />} />
                <Route path="/survey-v2" element={<SurveyPageV2 />} />
                <Route path="/store-survey" element={<StoreSurveyPage />} />
              </Routes>
            </div>
          </div>
        </InventoryProvider>
      </DateRangeProvider>
    </Router>
  );
}
