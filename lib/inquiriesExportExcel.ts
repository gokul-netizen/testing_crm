import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { toast } from "sonner";
import * as XLSX from "xlsx-js-style";

dayjs.extend(utc);
dayjs.extend(timezone);

interface FollowUpItem {
    followUpStatus?: string;
    remarks?: string;
    createdAt?: string;
    date?: string;
    time?: string;
}

interface InquiryItem {
    name?: string;
    companyName?: string;
    phone?: string | number;
    phoneSecondary?: string | number;
    email?: string;
    service?: string;
    source?: string;
    followUpStatus?: string;
    _count: { followups: number }
    followups?: FollowUpItem[];
    [key: string]: unknown;
}

const getCurrentIST = () => {
    return dayjs().tz("Asia/Kolkata").format("DD-MM-YYYY_HH-mm-ss");
};

export const ExportInquiryData = (data: InquiryItem[]) => {
    try {
        if (!data || !Array.isArray(data) || data.length === 0) {
            toast.error("No data available to export");
            return;
        }

        const exportData = data.map((item, index) => {

            const followUp: FollowUpItem | null = Array.isArray(item.followups) && item.followups.length > 0
                ? item.followups[0]
                : (typeof item.followups === "object" && item.followups !== null)
                    ? (item.followups as FollowUpItem)
                    : null;

            return {
                "S.No": index + 1,
                Name: String(item.name ?? ""),
                "Company Name": String(item.companyName ?? ""),
                Phone: item.phone ? String(item.phone) : "",
                "Secondary Phone": item.phoneSecondary ? String(item.phoneSecondary) : "",
                Email: String(item.email ?? ""),
                Service: String(item.service ?? ""),
                Source: String(item.source ?? ""),
                "Follow Up Status": String(
                    followUp?.followUpStatus ?? item.followUpStatus ?? ""
                ),
                "Follow up count": item._count?.followups ?? "",
                "Created At": String(dayjs.utc(followUp?.createdAt).format("DD-MM-YYYY : hh:mm A")) ? String(dayjs.utc(followUp?.createdAt).format("DD-MM-YYYY : hh:mm A")) : "",
                Remarks: String(followUp?.remarks ?? ""),
                "Follow Up Date": followUp?.date ? String(followUp.date) : "",
                "Follow Up Time": followUp?.time ? String(followUp.time) : "",
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);

        const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            const cell = worksheet[cellAddress];

            if (cell) {
                cell.s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "7367F0" } },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "D1D5DB" } },
                        bottom: { style: "thin", color: { rgb: "D1D5DB" } },
                        left: { style: "thin", color: { rgb: "D1D5DB" } },
                        right: { style: "thin", color: { rgb: "D1D5DB" } },
                    },
                };
            }
        }


        if (exportData.length > 0) {
            const columnWidths = Object.keys(exportData[0]).map((key) => {
                const maxLength = Math.max(
                    key.length,
                    ...exportData.map((row) => {
                        const value = row[key as keyof typeof row];
                        return value ? String(value).length : 0;
                    })
                );

                return {
                    wch: Math.min(Math.max(maxLength + 3, 12), 40),
                };
            });
            worksheet["!cols"] = columnWidths;
        }

        worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inquiries");

        const fileName = `Inquiry_Export_${getCurrentIST()}.xlsx`;
        XLSX.writeFile(workbook, fileName);

        toast.success("Inquiry data exported successfully");
    } catch (error) {
        console.error("Export inquiry error:", error);
        toast.error("Failed to export inquiry data");
    }
};