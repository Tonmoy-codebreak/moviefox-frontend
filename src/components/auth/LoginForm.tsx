"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import API from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Film,
  AlertCircle,
  LogIn,
} from "lucide-react";

interface LoginFormProps {
  redirectTo?: string;
}

export default function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("Login Successful:", response.data);

      const token = response.data.token || response.data.data?.token;

      const userData = response.data.user || response.data.data?.user;

      if (token) {
        if (userData) {
          login(token, userData);
        } else {
          Cookies.set("token", token, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        }
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      let errorMessage = "Something went wrong during login.";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black px-8 pt-8 pb-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_yellow_0%,_transparent_60%)]"></div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400 rounded-2xl mb-4 shadow-lg">
              <Film className="w-7 h-7 text-gray-900" />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-gray-400 text-sm mt-1">
              Login to Moviefox to continue
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-8 py-8 bg-gray-900">
          {error && (
            <div className="mb-5 flex items-start gap-2 p-3 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                <Mail className="w-3.5 h-3.5 text-yellow-400" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                <Lock className="w-3.5 h-3.5 text-yellow-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-11 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-yellow-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Login
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
