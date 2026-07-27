import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "@/components/ui/multi-select";
import { fetcher } from "@/lib/fetcherSwr";
import { toast } from "sonner";
import useSWR from "swr";



type AssignValue = {
  id: number;
  name: string;
  type: string;
};

type Props = {
    value: string[];
    onChange: (val: AssignValue  | null) => void;
     
};


export default function AssignToDropDown({ value, onChange }: Props) {

    const { data } = useSWR(`/api/user/get-users`, fetcher);

    const sourcehandling = (newValues: string[]) => {
        if (newValues.length > 1) {
            toast.error("You cannot select more than one source");
            return;
        }

        if (newValues.length === 0) {
            onChange(null);
        } else {
            const parsed = JSON.parse(newValues[0]);
            onChange(parsed);
        }
    };

    return (
        <section>
            <div>
                <label className="text-sm text-gray-500 font-medium">Assign to</label>
                <MultiSelect values={value} onValuesChange={sourcehandling} single>
                    <MultiSelectTrigger className="w-full">
                        <MultiSelectValue placeholder="select name..." />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                        <MultiSelectGroup>
                            {data?.map((item: { username: string, id: number , type : string }, index: number) => (
                                <MultiSelectItem key={index} value={JSON.stringify({id : item.id , name: item.username , type : item.type})}>
                                    {item.username}
                                </MultiSelectItem>
                            ))}
                        </MultiSelectGroup>
                    </MultiSelectContent>
                </MultiSelect>
            </div>
        </section>
    )
}