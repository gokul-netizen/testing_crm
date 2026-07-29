
type Props = {
  open: boolean;
  startDate: string;
  endDate: string;
  setStartDate: (v: any) => void;
  setEndDate: (v: any) => void;
  onClose: () => void;
};

export default function AdvancedSearchDrawer({
  open,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onClose,
}: Props) {
  return (
    <div
      className={`fixed top-0 right-0 h-full  bg-white shadow-2xl transition-transform duration-300 z-1000`}
      style={{
        width: "400px",
        transform: open ? "translateX(0)" : "translateX(100%)",
      }}
    >
      <div className="p-6 border-b flex items-center ml-4 lg:ml-0 justify-between">
        <h2 className="text-xl font-semibold text-gray-700">
          Advanced Search
        </h2>

        <button
          onClick={onClose}
          className="text-gray-500 text-lg cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="p-6 flex flex-col gap-5  mx-4 lg:mx-0">
        <div>
          <label className="text-gray-600 text-sm">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border p-2 mt-1 rounded focus:ring-2  focus:ring-[#7367f0] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-gray-600 text-sm">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border p-2 mt-1 rounded focus:ring-2  focus:ring-[#7367f0] focus:outline-none"
          />
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-[#7367f0] text-white rounded-md mt-4 cursor-pointer"
        >
          Search
        </button>
      </div>
    </div>
  );
}
