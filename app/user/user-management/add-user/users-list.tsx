'use client';

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

interface UserItem {
  id: string;
  username: string;
}

interface UsersListProps {
  id: number | string;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function UsersList({ id, value, onChange }: UsersListProps) {
  const { data } = useSWR<UserItem[]>(id ? `/api/user/${id}/get-users` : null, fetcher);


  return (
    <section>
      <div>
        <label className="block text-gray-500 text-sm font-medium mb-1">
          Select Users
        </label>

        <MultiSelect
          values={value}
          onValuesChange={onChange}
        >
          <MultiSelectTrigger className="w-full">
            <MultiSelectValue placeholder="Select users..." />
          </MultiSelectTrigger>

          <MultiSelectContent>
            <MultiSelectGroup>
              {data?.map((item,i) => (
                <MultiSelectItem key={i} value={String(item.id)}>
                  {item.username}
                </MultiSelectItem>
              ))}
            </MultiSelectGroup>
          </MultiSelectContent>
        </MultiSelect>
      </div>
    </section>
  );
}