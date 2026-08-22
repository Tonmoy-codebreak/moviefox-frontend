import RegisterForm from "@/components/auth/RegisterForm";
import { Film, Star, Sparkles } from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="min-h-screen w-full flex bg-white">
      {/* Left: Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Cinema seats"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlays for readability + brand tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-[#E23636]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-10 w-56 h-56 bg-[#F5C518]/10 rounded-full blur-3xl" />

        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg border border-white/10">
              <Film className="w-5 h-5 text-[#F5C518]" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Moviefox
            </span>
          </div>

          <div className="space-y-5 max-w-md">
            <div className="inline-flex items-center gap-2 bg-[#E23636]/15 border border-[#E23636]/40 text-[#F5C518] text-xs font-semibold px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Join thousands of movie lovers
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Your next favorite <br /> film is waiting.
            </h2>
          </div>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gray-50 relative">
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Mobile-only brand mark */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <Film className="w-4.5 h-4.5 text-[#F5C518]" />
            </div>
            <span className="text-gray-900 font-bold text-lg tracking-tight">
              Moviefox
            </span>
          </div>

          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
