import { ReactNode } from "react";
import { X, Download } from "lucide-react";

type ReportWrapperProps = {
  children: ReactNode;
  isModal?: boolean;
  onClose: () => void;
  onDownload: () => void;
};

export function ReportWrapper({ children, isModal = true, onClose, onDownload }: ReportWrapperProps) {
  if (!isModal) {
    // Render as a page (no modal overlay)
    return (
      <div className="w-full py-6">
        <div className="sticky top-[73px] z-10 bg-white border-b-2 border-gray-200 shadow-sm mb-6">
          <div className="px-6 py-4 flex justify-end">
            <button
              onClick={onDownload}
              data-report-download
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#041e42] to-[#0a2f5f] text-white rounded-lg hover:from-[#BC0022] hover:to-[#d4002a] transition-all shadow-md hover:shadow-lg font-bold text-sm"
            >
              <Download size={16} strokeWidth={2.5} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
        <div className="px-6">{children}</div>
      </div>
    );
  }

  // Render as a modal
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
          onClick={onDownload}
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
        {children}
      </div>
    </div>
  );
}
