import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export function exportPfd(columns:any, rows: any[][], title: string) {
  try {
    if (!columns || columns.length === 0) {
      return toast.error("No data to export");
    }

    const doc = new jsPDF({
      orientation: "landscape",    
      unit: "mm",
      format: [500, 300]
    });

    doc.setFontSize(12);
    doc.text(title, 14, 15);

    autoTable(doc, {
      startY: 25,               
      head: [columns],
      body: rows,

      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak",
      },

      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 9,
      },

      pageBreak: "auto",           
      rowPageBreak: "auto",
      tableWidth: "auto",
    });

    doc.save("inquiry.pdf");

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
}
