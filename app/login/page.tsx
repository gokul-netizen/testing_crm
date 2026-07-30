"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtp, setIsOtp] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtpVerify, setShowOtpVerify] = useState(false);
  const [sixDigitsOtp, setSixDigitsOtp] = useState("");

  const router = useRouter();
  const otpRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid username or password ❌");
      } else if (data.success) {
        const { userType } = data.user;

        if (userType === "AdminUser") {
          router.replace(`/user`);
        } else if (userType === "User") {
          router.replace(`/sub-user`);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtp = async () => {
    if (phoneNumber.trim().length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    const res = await fetch(`/api/user-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
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
    const res = await fetch(`/api/user-otp/${phoneNumber}`, {
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

    if (data.type === "AdminUser") {
      router.replace(`/user`);
    } else if (data.type === "User") {
      router.replace(`/sub-user`);
    }
  };

  return (
    <div className="flex bg-white min-h-screen w-full overflow-hidden">

      <div className="hidden md:block flex-1 h-screen relative bg-black">
        <video
          src="/loginVideo.mp4"
          autoPlay
          muted
          loop
          playsInline

          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Login Form */}
      <div className="w-full md:w-[450px] lg:w-[500px] h-screen bg-white flex justify-center items-center flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!isOtp) {
              handleLogin(e);
            } else if (showOtpVerify) {
              handleVerifyOtp();
            } else {
              handleOtp();
            }
          }}
          className="w-[350px] space-y-4 mx-4"
        >
          <h2 className="text-2xl md:text-3xl text-gray-700 mt-2">
            Welcome to Mars Web User Side!{" "}
            <motion.span
              className="inline-block origin-[70%_70%]"
              animate={{
                rotate: [0, 20, -15, 20, -10, 15, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            >
              👋
            </motion.span>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full border border-purple-400 text-gray-700 rounded-xl px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-purple-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border text-gray-600 border-purple-400 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                  value={password}
                  placeholder="Enter password"
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

              {error && (
                <p className="text-red-600 mt-2 text-sm font-medium">{error}</p>
              )}

              <button
                type="submit"
                className={`w-full bg-[#7367f0] text-white py-2 rounded-xl hover:bg-purple-500 transition flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Sign in"}
              </button>
            </>
          ) : (
            <div>
              <div className="space-y-5">
                <p className="text-gray-700 text-lg text-center font-bold">
                  Login Through OTP
                </p>

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
                <div className="mt-4">
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