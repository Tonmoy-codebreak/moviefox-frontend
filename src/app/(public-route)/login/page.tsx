import LoginForm from "@/components/auth/LoginForm";
import React from "react";
import { Film, Sparkles } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex bg-gray-950">
      {/* Left: Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1615986201152-7686a4867f30?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Cinema"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-gray-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-950/60" />

        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg">
              <Film className="w-5 h-5 text-gray-900" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Moviefox
            </span>
          </div>

          <div className="space-y-4 max-w-md">
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Unlimited streaming
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Every story, <br /> ready when you are.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sign in to pick up where you left off and explore thousands of
              titles curated just for you.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Subtle background accent for mobile / narrow screens */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-gray-900 to-gray-950" />

        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Mobile-only brand mark */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Film className="w-4.5 h-4.5 text-gray-900" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Moviefox
            </span>
          </div>

          <div className="w-full max-w-md text-center mb-2">
            <h1 className="text-3xl font-bold text-white mb-1">Log in</h1>
            <p className="text-gray-400 text-sm">
              Welcome back, we missed you.
            </p>
          </div>

          <div className="w-full flex justify-center mt-6">
            <LoginForm />
          </div>

          <p className="text-gray-500 text-xs mt-8 text-center">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
