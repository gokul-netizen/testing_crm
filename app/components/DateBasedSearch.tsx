"use client";

import { Button } from "@/components/ui/button";
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "@/components/ui/multi-select";

interface DateRangeFilterProps {
  fromDate: string;
  toDate: string;
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
  onApply: () => void;
  onReset?: () => void;
  className?: string;
  branch?: string[];
  branchOptions?: string[];
  setBranch?: (values: string[]) => void;
  value?: string;
  setValue?: (val: string) => void;

}

export default function DateRangeFilter({
  fromDate,
  toDate,
  branch,
  setBranch,
  value,
  setValue,
  setFromDate,
  setToDate,
  branchOptions = [],
  onApply,
  onReset,
  className = "",
}: DateRangeFilterProps) {

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setBranch?.([]);
    setValue?.("")
    if (onReset) onReset();
  };


  return (
    <div className={`flex flex-col   gap-4 ${className}`}>

      {
        branchOptions?.length > 0 && (
          <div>
            <label className="text-gray-700 mb-1 text-sm">Select Field</label>
            <MultiSelect values={branch} onValuesChange={setBranch} single>
              <MultiSelectTrigger className="w-full border-1 shadow-none h-full px-3">
                <MultiSelectValue placeholder="Select Field..." />
              </MultiSelectTrigger>

              <MultiSelectContent>
                <MultiSelectGroup>
                  {branchOptions?.map((item: string, index: number) => (
                    <MultiSelectItem key={index} value={item}>
                      {item}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-1 text-sm">Value</label>
              <input
                type="text"
                className="border rounded-md p-2"
                placeholder="Enter the value..."
                value={value}
                onChange={(e) => setValue?.(e.target.value)}
              />
            </div>
          </div>
        )
      }

      <div className="flex flex-col">
        <label className="text-gray-700 mb-1 text-sm">From Date</label>
        <input
          type="date"
          className="border rounded-md p-2"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </div>


      <div className="flex flex-col">
        <label className="text-gray-700 mb-1 text-sm">To Date</label>
        <input
          type="date"
          className="border rounded-md p-2"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>


      <div className="flex gap-2 mt-2 sm:mt-0">
        <Button className="bg-[#7367f0] text-white cursor-pointer" onClick={onApply}>
          Apply
        </Button>

        <Button
          variant="outline"
          className="text-gray-700 border-gray-300 hover:bg-gray-100 cursor-pointer"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
