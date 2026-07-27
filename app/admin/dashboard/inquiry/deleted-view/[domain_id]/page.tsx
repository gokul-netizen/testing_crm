'use client';
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";
import DataTable from "./data-table";



export default function Page(){

    const params = useParams();
        
        const id = params.domain_id;

        const { data, error, isLoading } = useSWR(`/api/admin-deleted/view/${id}`, fetcher);
        if (isLoading)
            return <p className="p-8 text-gray-600">Loading…</p>;
    
        if (error)
            return <p className="p-8 text-red-500">Failed to load data.</p>;
    
        if (!data)
            return <p className="p-8 text-gray-600">No data found.</p>;

         

    return(
        <section>
            <div className="p-6">
                           <DataTable
                               title="Deleted View List"
                               data={data?.data ?? []}
                               onEdit={(item) => console.log("Edit", item)}
                               onDelete={(item) => console.log("Delete", item)}
                           />
           
                       </div>
        </section>
    )
}