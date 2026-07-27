"use client";

import Link from "next/link";



type Props = {

  otp : string;
  onChangeOtp: (otp: string) => void;
  onSubmit: () => void;
  backUrl : string;

}




export default function VerifyOtp({otp , onChangeOtp , onSubmit , backUrl} : Props) {
  return ( 
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-3xl text-gray-700 mb-2">
          Verify OTP
        </h2>

        <p className="text-gray-600 mb-6">
          Enter the 6-digit verification code sent to your what's app number.
        </p>

        <section className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e)=> onChangeOtp(e.target.value)}

              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="w-full border border-purple-400 text-gray-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
            type="button"
            onClick={onSubmit}

            className="w-full bg-[#7367f0] cursor-pointer text-white py-2 rounded-xl hover:bg-purple-500 transition"
          >
            Verify OTP
          </button>

            <Link

            href={backUrl}

            className="w-full bg-blue-500 flex justify-center cursor-pointer text-white py-2 rounded-xl hover:bg-blue-600 transition"
          >
           Go Back
          </Link>
          </div>
        </section>
      </div>
    </div>
  );
}