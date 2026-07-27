
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "@/components/ui/multi-select";
import { fetcher } from "@/lib/fetcherSwr";
import useSWR from "swr";

type Member = {
    id: number;
    name: string;
    type: string;
};

type AssignValue = {
    id: number;
    name: string;
    type: string;
} | null;

type Props = {
    value: AssignValue;
    onChange: (value: AssignValue) => void;
    domainId: string | number;
    placeholder?: string;
    className?: string;
};

export default function AssignToDropDown({ value, onChange , domainId, placeholder = "Assign To...", className }: Props) {

    const { data } = useSWR(`/api/sub-user/inquiry/view/${domainId}/assign-names`, fetcher);

    const selectedValues = value ? [JSON.stringify({ id: value.id, name: value.name, type: value.type })] : [];

    const handleChange = (newValues: string[]) => {
        if (newValues.length === 0) {
            onChange(null);
        } else {
            const parsed: AssignValue = JSON.parse(newValues[0]);
            onChange(parsed);
        }
    };

    return (
        <MultiSelect values={selectedValues} onValuesChange={handleChange} single>
            <MultiSelectTrigger className={`w-full h-10 ${className ?? ""}`}>
                <MultiSelectValue placeholder={placeholder} />
            </MultiSelectTrigger>
            <MultiSelectContent>
                <MultiSelectGroup>
                    {data?.members?.map((item: Member, i: number) => (
                        <MultiSelectItem
                            key={i}
                            value={JSON.stringify({ id: item.id, name: item.name, type: item.type })}
                        >
                            {item.name}
                        </MultiSelectItem>
                    ))}
                </MultiSelectGroup>
            </MultiSelectContent>
        </MultiSelect>
    );
}