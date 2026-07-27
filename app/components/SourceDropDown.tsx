import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "@/components/ui/multi-select";
import { fetcher } from "@/lib/fetcherSwr";
import { toast } from "sonner";
import useSWR from "swr";

type Props = {
    value : string[];
    onChange : (val : string[])=> void;
}


export default function SourceDropDown({ value, onChange }: Props) {
     

    const { data } = useSWR(`/api/source`, fetcher);

    const sourcehandling = (newValues: string[]) => {
        if (newValues.length > 1) {
            toast.error("You cannot select more than one source");
            return;
        }
        onChange(newValues);  
    }

    return (
        <section>
            <div>
                <label className="text-sm text-gray-500 font-medium">Select Source</label>
                <MultiSelect values={value} onValuesChange={sourcehandling} single>
                    <MultiSelectTrigger className="w-full">
                        <MultiSelectValue placeholder="Select Source..." />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                        <MultiSelectGroup>
                            {data?.map((item: any, index: number) => (
                                <MultiSelectItem key={index} value={item.source}>
                                    {item.source}
                                </MultiSelectItem>
                            ))}
                        </MultiSelectGroup>
                    </MultiSelectContent>
                </MultiSelect>
            </div>
        </section>
    )
}