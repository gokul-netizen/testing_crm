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

type Domain = {
  id: number;
  domainName: string;
};

type UserDomainResponse = {
  id: number;
  name: string;
  inquiryDomain: Domain | null;  
};

interface DomainListProps {
  id: number | string;
  value: number | null;  
  onChange: (value: number | null) => void;
}

export default function DomainList({ id, value, onChange }: DomainListProps) {
  const { data, isLoading } = useSWR<UserDomainResponse>(
    id ? `/api/user/${id}/get-domain` : null,
    fetcher
  );

  const availableOptions: Domain[] = data?.inquiryDomain ? [data.inquiryDomain] : [];

  return (
    <section>
      <div>
        <label className="block text-gray-500 text-sm font-medium mb-1">
          Select Domains
        </label>

        <MultiSelect
      
          values={value !== null ? [String(value)] : []}
          onValuesChange={(vals: string[]) => { const firstSelection = vals.length > 0 ? Number(vals[0]) : null;
            onChange(firstSelection);
        }}
          single

        >
          <MultiSelectTrigger className="w-full">
            <MultiSelectValue placeholder={isLoading ? "Loading..." : "Select domains..."} />
          </MultiSelectTrigger>

          <MultiSelectContent>
            <MultiSelectGroup>
              {availableOptions.length > 0 ? (
                availableOptions.map((domain) => (
                  <MultiSelectItem
                    key={domain.id}
                    value={String(domain.id)}
                  >
                    {domain.domainName}
                  </MultiSelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-400">No domains available</div>
              )}
            </MultiSelectGroup>
          </MultiSelectContent>
        </MultiSelect>
      </div>
    </section>
  );
}