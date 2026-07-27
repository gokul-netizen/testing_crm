import { toast } from "sonner";
import * as XLSX from "xlsx-js-style";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);


const getCurrentIST = () => {
    return dayjs().tz("Asia/Kolkata").format("DD-MM-YYYY_HH-mm-ss");
};



export const exportExcelData = (data: Record<string, any>[]) => {
    try {
        if (data.length === 0) {
            toast.error("No data is there to export");
            return;
        }

        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
        XLSX.writeFile(wb, "myExcel.xlsx");

    } catch (error) {
        toast.error("Failed to export")
    }
}

export const exportExcelDataInquiry = (data: Record<string, any>[]) => {
    try {
        if (!data.length) {
            toast.error("No data is there to export");
            return;
        }

        const keys = new Set(
            data.flatMap((item: any) => item.response.body?.map((f: any) => f.key))
        );

        const domainName = data[0].response.Domain_Name;

        const excelData = data.map((item, index) => {

            const obj: any = { "S.No": index + 1 };
            keys.forEach(k => (obj[k as string] = ""));
            item.response.body?.forEach((f: any) => (obj[f.key] = f.value));
            return obj;

        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData, { skipHeader: true });

        const headers = ["S.No", ...Array.from(keys)];


        XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
        XLSX.utils.sheet_add_json(ws, excelData, { skipHeader: true, origin: "A2" });

        headers.forEach((h, i) => {
            const cell = XLSX.utils.encode_cell({ r: 0, c: i });
            if (!ws[cell]) ws[cell] = { t: "s", v: h };
            ws[cell].s = {
                font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
                fill: { fgColor: { rgb: "2F75B5" } },
                alignment: { horizontal: "center", vertical: "center" }
            };
        });


        ws["!cols"] = headers.map(h => ({ wch: Math.max(h.length + 5, 20) }));

        ws["!rows"] = [{ hpt: 20 }];

        XLSX.utils.book_append_sheet(wb, ws, "sheet1");
        XLSX.writeFile(wb, `${domainName} ${getCurrentIST()}.xlsx`);

    } catch (error) {
        console.error("Excel export failed:", error);
        toast.error("Failed to export");
    }
};


export const userExcelData = (data: Record<string, any>[] , title : string) => {
    try {
        
        const result = data.map((item: any, index: number) => ({
            Slno: index + 1,
            Name : item.inquiry?.name,
            Phone : item.inquiry?.phone,
            Email : item.inquiry?.email,
            Status : item.followUpStatus,
            Date : item.date,
            Time : item.time,
            Remarks : item.remarks,
            Added_on : dayjs.utc(item.createdAt).format("DD-MM-YYYY hh:mm A"),
        }));

        if(result.length === 0){
            toast.error("No data is there to export");
            return;
        }

        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(result);

        const headerStyle = {
            font: {
                bold: true,         
                sz: 12,
                color: { rgb: "FFFFFF" }, 
            },
            fill: {
                fgColor: { rgb: "4472C4" },  
            },
            alignment: {
                horizontal: "center",
                vertical: "center",
            },
        };

        const headers = Object.keys(result[0]);

        headers.forEach((_, colIndex) => {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
            if (ws[cellAddress]) {
                ws[cellAddress].s = headerStyle;
            }
        });

        ws["!cols"] = headers.map(() => ({ wch: 18 }));

        XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
        XLSX.writeFile(wb,  `${title} ${dayjs().format("DD-MM-YYYY hh:mm A")}.xlsx`);

    } catch (error) {
        toast.error("Failed to export")
    }
}