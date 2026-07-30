'use client';

import DateRangeFilter from "@/app/components/DateBasedSearch";
import { fetcher } from "@/lib/fetcherSwr";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";



interface SearchData {
    searchData: any[];
    setSearchData: React.Dispatch<React.SetStateAction<any[]>>;
     setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
    
}

export default function Search({
    searchData,
    setSearchData,
    setOpenSearch

}: SearchData) {
    const { data, error, isLoading } = useSWR(`/api/user/search`, fetcher);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [branch, setBranch] = useState<string[]>([]);
    const [value, setValue] = useState("");


    const params = useParams();
    const domain_id = params.domainId;


    const branchOptions = Array.isArray(data) && data.length > 0
        ? Object.keys(data[0])
        : [];

    const handleReset = () => {
        setFromDate("");
        setToDate("");
        setBranch([]);
        setValue("");
        setSearchData([]);
    };

    const handleApply = async () => {

        const params = new URLSearchParams({
            from: fromDate,
            to: toDate,
            field: branch[0] || "",
            value,
        });

        const response = await fetch(`/api/sub-user/search/${domain_id}?${params.toString()}`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();

        if (data.length === 0) {
            toast.error("Matching data not found");
            setOpenSearch(true)
            return;
        }

        setSearchData(data);
        setOpenSearch(false);

    };

    if (isLoading) return <div>Loading options...</div>;
    if (error) return <div>Failed to load search parameters.</div>;

    return (
        <section>
            <DateRangeFilter
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                branch={branch}
                setBranch={setBranch}
                branchOptions={branchOptions}
                value={value}
                setValue={setValue}
                onApply={handleApply}
                onReset={handleReset}
            />
        </section>
    );
}