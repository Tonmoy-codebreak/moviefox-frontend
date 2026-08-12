"use client";

import { registerAction } from "@/actions/publicAction/registerForm.action";
import Link from "next/link";
import { useActionState } from "react";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Create Account
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Sign up to start managing your watchlist and media.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="name@example.com"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>

        {state?.message && (
          <div
            className={`p-3 rounded-xl text-xs font-medium text-center ${
              state.success
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? "Creating account..." : "Register 🚀"}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
