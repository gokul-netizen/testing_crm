"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaRegEye,
  FaEyeSlash,
} from "react-icons/fa";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtp, setIsOtp] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtpVerify, setShowOtpVerify] = useState(false);
  const [sixDigitsOtp, setSixDigitsOtp] = useState("");

  const router = useRouter();
  const otpRef = useRef<HTMLInputElement>(null);


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong ❌");
        return;
      }


      if (data.success && data.user) {

        router.replace(`/admin/dashboard`);

      }

    } catch (err: any) {

      setError(err.message || "Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtp = async () => {


    if (phoneNumber.trim().length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    const res = await fetch(`/api/admin-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNumber }),
    });

    const data = await res.json();



    if (!res.ok) {
      toast.error(data.message || "Internal Issues while sending OTP");
      return;
    }

    toast.success(data.message);
    setShowOtpVerify(true);
    setTimeout(() => {
      otpRef.current?.focus();
    }, 0);


  };

  const handleVerifyOtp = async () => {

    const res = await fetch(`/api/admin-otp/${phoneNumber}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: sixDigitsOtp }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Internal Issues while sending OTP");
      return;
    }

    toast.success(data.message);
    router.replace(`/admin/dashboard`);

  };

  return (
    <div className="flex flex-col items-center  justify-center md:flex-row  bg-white ">
      {/* Left Side Image */}
      <div className="w-[100%] hidden md:flex flex-col items-center justify-center bg-[#F8F7FA] relative h-[100vh]">
        <div className="relative w-full h-[80vh] flex justify-center items-center">
          <Image
            src="/image.png"
            alt="Character"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>


      <div className="w-full bg-white flex justify-center items-center ">
        <form
          onSubmit={(e) => {
            if (isOtp) {
              e.preventDefault();

              if (showOtpVerify) {
                handleVerifyOtp();
              } else {
                handleOtp();
              }
            } else {
              handleLogin(e);
            }
          }}
          className="w-[350px] space-y-4 mt-30 mx-4 md:mx-0 md:mt-0"
        >
          <h2 className="text-2xl md:text-3xl text-gray-700 mt-2">
            Welcome to Mars Web! Admin Side👋
          </h2>
          <p className="text-gray-600 mb-6 md:text-xl">
            Please sign-in to your account and start the adventure
          </p>

          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setIsOtp(false)}
              className={`flex-1 py-2.5 rounded-xl font-medium transition ${!isOtp
                ? "bg-[#7367f0] text-white"
                : "border border-[#7367f0] text-[#7367f0] hover:bg-[#7367f0] hover:text-white"
                }`}
            >
              Password
            </button>

            <button
              type="button"
              onClick={() => setIsOtp(true)}
              className={`flex-1 py-2.5 rounded-xl font-medium transition ${isOtp
                ? "bg-[#7367f0] text-white"
                : "border border-[#7367f0] text-[#7367f0] hover:bg-[#7367f0] hover:text-white"
                }`}
            >
              OTP
            </button>
          </div>

          {!isOtp ? (
            <>
              {/* Username */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                autoComplete="username"
                placeholder="Enter username"
                className="w-full border border-purple-400 text-gray-700 rounded-xl px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-purple-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              {/* Password */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="************"
                  className="w-full border border-purple-400 text-gray-600 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <span
                  className="absolute right-3 top-2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaRegEye />}
                </span>
              </div>

              {error && <p className="text-red-600 mt-2">{error}</p>}

              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center space-x-2 text-gray-700 text-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span>Remember me</span>
                </label>

                <Link
                  href="/admin/forgot-password"
                  className="text-[#7367f0] hover:underline text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className={`w-full bg-[#7367f0]  cursor-pointer text-white py-2 rounded-xl hover:bg-purple-500 transition flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </>
          ) : (
            <div>

              <div className="space-y-5">
                <p className="text-gray-700 text-lg text-center font-bold"> Login Through OTP</p>


                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>

                <input
                  type="text"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border border-purple-400 text-gray-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />

              </div>

              {showOtpVerify && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP
                  </label>

                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                     ref={otpRef}
                    maxLength={6}
                    value={sixDigitsOtp}
                    onChange={(e) => setSixDigitsOtp(e.target.value)}
                    className="w-full border border-purple-400 text-gray-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              {!showOtpVerify ? (
                <button
                  type="submit"

                  className="w-full bg-[#7367f0] text-white py-2 my-4 rounded-xl cursor-pointer"
                >
                  Send OTP
                </button>
              ) : (
                <>
                  <button
                    type="submit"

                    className="w-full bg-[#7367f0] text-white py-2 my-4 rounded-xl cursor-pointer"
                  >
                    Verify OTP
                  </button>

                  <button
                    type="button"
                    onClick={handleOtp}
                    className="w-full bg-[#7367f0] text-white py-2 rounded-xl cursor-pointer"
                  >
                    Resend OTP
                  </button>
                </>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}


 