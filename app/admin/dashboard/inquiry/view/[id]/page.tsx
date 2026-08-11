"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import DataTable from "./Table";
import SpinnerCircle4 from "@/components/spinner-10";
import { exportExcelDataInquiry } from "@/lib/export-excel-data";
import { exportPfd } from "@/lib/export-pdf";


export default function Page() {

    const params = useParams();
    const id = params.id;
    const { data, error, isLoading } = useSWR(`/api/admin/inquiries/view/${id}`, fetcher);


    if (isLoading)
        return <SpinnerCircle4 />;

    if (error)
        return <p className="p-8 text-red-500">Failed to load data.</p>;

    if (!data)
        return <p className="p-8 text-gray-600">No data found.</p>;


    const pdfData = data?.data ?? [];

    const allKeys = Array.from(
        new Set(
            pdfData.flatMap((item: any) =>
                item.response?.body?.map((f: any) => f.key) || []
            )
        )
    );


    const rows = pdfData.map((item: any) => {
        const row: any[] = [];

        allKeys.forEach(key => {
            const found = item.response?.body?.find((f: any) => f.key === key);
            row.push(found ? found.value : "");
        });

        return row;
    });


    return (
        <section>
            <div className="p-6">
                <DataTable
                    title="Records List"
                    data={data?.data ?? []}
                    onEdit={(item) => console.log("Edit", item)}
                    onDelete={(item) => console.log("Delete", item)}
                    OnExcel={() => exportExcelDataInquiry(data?.data ?? [])}
                    onPdf={() => exportPfd(allKeys, rows, "Inquiries List")}
                    onAdd={() => console.log("Add new domain")}
                    domainId={(Number(id))}
                    
                />
            </div>
        </section>
    )
}