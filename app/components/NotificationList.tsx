import dayjs from 'dayjs';
import { useState } from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface NotificationData {
  date: string;
  time: string;
  remarks: string;
  followUpStatus: string;
  inquiry: {
    id: string,
    name: string
  }
}

interface NotificationDropdownProps {
  data: {
    data: NotificationData[];
  };

  isLoading: boolean;
  error: any;

}

export default function NotificationDropdown({
  data,
  isLoading,
  error,
}: NotificationDropdownProps) {

  const [showMore, setShowMore] = useState(false);

  const inquiryData = data?.data || [];

  const displayedNotifications = showMore
    ? inquiryData
    : inquiryData.slice(0, 5);

  if (isLoading) {
    return (
      <div className="w-[380px] bg-white rounded-lg shadow-xl border border-gray-200 p-6 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[380px] bg-white rounded-lg shadow-xl border border-gray-200 p-6 text-center text-red-500 font-medium">
        Failed to load notifications
      </div>
    );
  }

  return (
    
    <div className=" w-[260px]  md:w-[380px] bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden font-sans  z-[9999] relative">
      <div className="flex items-center justify-between p-4 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-[#4b465c] text-lg">Notification</h3>
          <span className="bg-[#eeedfd] text-[#7367f0] text-xs font-medium px-2 py-0.5 rounded">
            {inquiryData.length} New
          </span>
        </div>

        <button className="text-[#4b465c] hover:opacity-70 transition-opacity">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002 2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>


      <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
        {displayedNotifications.length > 0 ? (
          displayedNotifications.map((item: NotificationData) => (
            <div
              key={item.inquiry.id}
              className="flex gap-3 p-4 border-b-1  border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors relative"
            >

              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f8f7fa] flex items-center justify-center text-[#7367f0] font-medium overflow-hidden">
                {item.inquiry.name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <div className="flex justify-between items-start">
                  <p className="text-[15px] font-medium text-[#4b465c] truncate">
                    {item.inquiry.name}
                  </p>

                  <span className="w-2 h-2 bg-[#7367f0] rounded-full mt-1.5 flex-shrink-0"></span>
                </div>

                <p className="text-[14px] text-[#8e8a9a] leading-tight mt-0.5">
                  {item.followUpStatus}
                </p>

                <p className="text-[13px] text-[#b4b2bb] mt-1.5">
                  {item.date} {item.time}
                </p>

                <p className="text-[13px] text-[#b4b2bb] mt-1.5">
                  {item.remarks.length > 100
                    ? `${item.remarks.slice(0, 100)}...`
                    : item.remarks}
                </p>


              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-gray-400 italic">
            No Notifications
          </div>
        )}
      </div>

      {/* Footer Button */}
      <div className="p-4">
        <button
          onClick={() => setShowMore(!showMore)}
          className="w-full bg-[#7367f0] hover:bg-[#685dd8] text-white text-[15px] font-medium py-2.5 rounded-md transition-all shadow-md shadow-indigo-100"
        >
          {showMore ? "View less notifications" : "View all notifications"}
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dbdade;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c9c8ce;
        }
      `}</style>
    </div>
  );
}