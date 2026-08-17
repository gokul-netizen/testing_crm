import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "@/components/ui/multi-select";
import { fetcher } from "@/lib/fetcherSwr";
import useSWR from "swr";


type Props = {
    value: string[];
    onChange: (val: string[]) => void;
    domainId: string | number;
    userId : string | number;
}

export default function SerivceDropDown({ value, onChange, domainId , userId }: Props) {

    const { data } = useSWR(`/api/user/service`, fetcher);

    const servicehandling = (newValues: string[]) => {
        onChange(newValues);

    }

    return (
        <section>
            <div>
                <label className="text-sm text-gray-500 font-medium">Select Service</label>
                <MultiSelect values={value} onValuesChange={servicehandling} >
                    <MultiSelectTrigger className="w-full">
                        <MultiSelectValue placeholder="Select service..." />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                        <MultiSelectGroup>
                            {data?.map((item: any, index: number) => (
                                <MultiSelectItem key={index} value={item.service}>
                                    {item.service}
                                </MultiSelectItem>
                            ))}
                        </MultiSelectGroup>
                    </MultiSelectContent>
                </MultiSelect>
            </div>
        </section>
    )
}