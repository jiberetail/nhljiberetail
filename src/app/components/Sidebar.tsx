import { Home, FileText, Settings, ClipboardList } from "lucide-react";
import { Link, useLocation } from "react-router";
import nhlLogo from "../../imports/NHL-league-logo.png";
import jibeLogo from "../../imports/white_trans_retail.png";
import sidebarPattern from "../../imports/nhl-faceted-sidebar-pattern.png";

export function Sidebar() {
  const location = useLocation();

  return (
    <div
      className="relative w-36 flex flex-col overflow-hidden border-r border-white/10"
      style={{
        background: "linear-gradient(to bottom, #000000 0%, #4a4a4a 60%, #a8a8a8 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${sidebarPattern})`,
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          mixBlendMode: "soft-light",
          opacity: 0.78,
          filter: "contrast(1.14) brightness(0.94)",
        }}
      />

      {/* Top Logo Section — Jibe Logo */}
      <div className="relative z-10 px-3 py-5 flex items-center justify-center">
        <img src={jibeLogo} alt="Jibe Retail" style={{ width: '181%', maxWidth: 'none' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 px-2 py-5">
        <div className="space-y-1">
          <Link
            to="/"
            className={`flex items-center gap-2 px-2 py-2.5 rounded transition-colors text-sm ${
              location.pathname === "/"
                ? "text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link
            to="/reports"
            className={`flex items-center gap-2 px-2 py-2.5 rounded transition-colors text-sm ${
              location.pathname === "/reports"
                ? "text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <FileText size={18} />
            <span>Reports</span>
          </Link>
          <Link
            to="/settings"
            className={`flex items-center gap-2 px-2 py-2.5 rounded transition-colors text-sm ${
              location.pathname === "/settings"
                ? "text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Settings size={18} />
            <span>Kiosks</span>
          </Link>
          <Link
            to="/store-survey"
            className={`flex items-center gap-2 px-2 py-2.5 rounded transition-colors text-sm ${
              location.pathname === "/store-survey"
                ? "text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <ClipboardList size={18} />
            <span>Store Survey</span>
          </Link>
        </div>
      </nav>

      {/* Footer — NHL Logo */}
      <div className="relative z-10 px-3 py-4 flex items-center justify-center">
        <img src={nhlLogo} alt="NHL" className="w-20 mx-auto" />
      </div>
    </div>
  );
}
