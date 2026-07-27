import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue
} from "@/components/ui/multi-select";

import { fetcher } from "@/lib/fetcherSwr";
import useSWR from "swr";
import React from "react";

interface User {
    id: string | number;
    name: string;
}

interface IncomingProps {
    id: string | number;
    domain?: string | number;
    assign: User[];
    setAssign: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function UserNamesDropDown({
    id,
    domain,
    assign,
    setAssign
}: IncomingProps) {

    const { data } = useSWR(
        `/api/${id}/inquiry/view/${domain}/assign-name`,
        fetcher
    );

    const userNames: User[] = data?.members || [];

    return (
        <section>
            <div className="flex items-center border rounded-md h-10">
                <MultiSelect
                    values={assign.map((u) => String(u.id))}
                    onValuesChange={(ids) => {
                        const selectedUsers = userNames.filter((u) =>
                            ids.includes(String(u.id))
                        );

                        setAssign(selectedUsers);
                    }}
                    single
                >
                    <MultiSelectTrigger className="w-full border-0 shadow-none h-full px-3">
                        <MultiSelectValue placeholder="select name..." />
                    </MultiSelectTrigger>

                    <MultiSelectContent>
                        <MultiSelectGroup>
                            {userNames.map((item) => (
                                <MultiSelectItem
                                    key={item.id}
                                    value={String(item.id)}
                                >
                                    {item.name}
                                </MultiSelectItem>
                            ))}
                        </MultiSelectGroup>
                    </MultiSelectContent>
                </MultiSelect>
            </div>
        </section>
    );
}