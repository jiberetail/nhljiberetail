import { jsPDF } from "jspdf";

type ExportReportPdfOptions = {
  element: HTMLElement;
  title: string;
  fileName: string;
};

function normalizeReportText(value: string) {
  return value
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2022\u00b7]/g, "-")
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, "")
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function exportReportPdf({ element, title, fileName }: ExportReportPdfOptions) {
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 16;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  const bodyLines = normalizeReportText(element.innerText);
  let y = 20;

  const addPageHeader = () => {
    pdf.setFillColor(4, 30, 66);
    pdf.rect(0, 0, pageWidth, 10, "F");
    pdf.setDrawColor(188, 0, 34);
    pdf.setLineWidth(1.2);
    pdf.line(margin, 14, pageWidth - margin, 14);
    y = 22;
  };

  addPageHeader();
  pdf.setTextColor(4, 30, 66);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text(title, margin, y);
  y += 9;

  pdf.setTextColor(31, 41, 55);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);

  for (const sourceLine of bodyLines) {
    const wrappedLines = pdf.splitTextToSize(sourceLine, contentWidth) as string[];

    for (const line of wrappedLines) {
      if (y > pageHeight - 18) {
        pdf.addPage();
        addPageHeader();
        pdf.setTextColor(31, 41, 55);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9.5);
      }

      pdf.text(line, margin, y);
      y += 4.6;
    }

    y += 1.2;
  }

  const pageCount = pdf.getNumberOfPages();
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    pdf.setPage(pageNumber);
    pdf.setDrawColor(209, 213, 219);
    pdf.setLineWidth(0.25);
    pdf.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);
    pdf.setTextColor(107, 114, 128);
    pdf.setFontSize(8);
    pdf.text("NHL Shop NYC - Jibe Retail", margin, pageHeight - 6);
    pdf.text(`${pageNumber} / ${pageCount}`, pageWidth - margin, pageHeight - 6, { align: "right" });
  }

  pdf.save(fileName);
}
