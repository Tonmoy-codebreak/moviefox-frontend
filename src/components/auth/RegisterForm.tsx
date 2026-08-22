"use client";

import { registerAction } from "@/actions/publicAction/registerForm.action";
import Link from "next/link";
import { useActionState, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Film,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-black via-[#E23636] to-[#F5C518]" />

        <div className="p-8">
          {/* Header */}
          <div className="mb-7 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black mb-4 shadow-sm">
              <Film className="size-5 text-[#F5C518]" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm mt-1.5">
              Sign up to start managing your watchlist and media.
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            {/* Name */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                <User className="size-3.5 text-[#E23636]" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E23636] focus:bg-white focus:ring-4 focus:ring-[#E23636]/10 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                <Mail className="size-3.5 text-[#E23636]" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E23636] focus:bg-white focus:ring-4 focus:ring-[#E23636]/10 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                <Lock className="size-3.5 text-[#E23636]" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E23636] focus:bg-white focus:ring-4 focus:ring-[#E23636]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#E23636] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5 ml-0.5">
                Use at least 8 characters for a stronger password.
              </p>
            </div>

            {/* Status message */}
            {state?.message && (
              <div
                className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium ${
                  state.success
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-[#E23636] border border-red-200"
                }`}
              >
                {state.success ? (
                  <CheckCircle2 className="size-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="size-4 flex-shrink-0" />
                )}
                <span>{state.message}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 bg-black hover:bg-[#E23636] text-white font-bold rounded-xl transition-all text-sm shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-gray-100" />
              <span className="text-[11px] text-gray-400 font-medium">
                ALREADY A MEMBER?
              </span>
              <span className="h-px flex-1 bg-gray-100" />
            </div>

            <Link
              href="/login"
              className="w-full flex items-center justify-center py-3 border-2 border-gray-200 hover:border-black hover:bg-black text-gray-700 hover:text-white font-semibold rounded-xl transition-all text-sm"
            >
              Login to your account
            </Link>
          </form>
        </div>
      </div>

      {/* Trust footer */}
      <p className="text-center text-[11px] text-gray-400 mt-5">
        By signing up, you agree to Moviefox&apos;s{" "}
        <span className="text-gray-600 font-medium">Terms</span> and{" "}
        <span className="text-gray-600 font-medium">Privacy Policy</span>.
      </p>
    </div>
  );
}
