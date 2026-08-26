"use client";

import {
  getAdminOverviewAction,
  OverviewStatsData,
} from "@/actions/adminAction/adminOverview.action";
import React, { useEffect, useState } from "react";
import {
  Users,
  Film,
  MessageSquare,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const AdminOverview = () => {
  const [stats, setStats] = useState<OverviewStatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const res = await getAdminOverviewAction();
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        setError(res.error || "Something went wrong");
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium animate-pulse">
            Loading dashboard statistics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800/80 p-6 md:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 size-64 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold">
              <Sparkles className="size-3.5" />
              System Overview & Analytics
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, Admin 👋
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Here is what’s happening across your platform today. Monitor user
              activities, manage media contents, and review submissions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/addnewmedia"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-semibold text-sm transition-all shadow-lg shadow-yellow-400/10"
            >
              <span>Add New Media</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users Card */}
        <div className="group relative p-6 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">
              Total Users
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
              <Users className="size-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-tight">
              {stats?.users.total || 0}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
              <span className="inline-block size-1.5 rounded-full bg-indigo-400" />
              Registered platform accounts
            </p>
          </div>
        </div>

        {/* Total Media Card */}
        <div className="group relative p-6 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">
              Total Media
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
              <Film className="size-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-tight">
              {stats?.media.total || 0}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
              <span className="inline-block size-1.5 rounded-full bg-blue-400" />
              {stats?.media.published || 0} currently published
            </p>
          </div>
        </div>

        {/* Total Reviews Card */}
        <div className="group relative p-6 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">
              Total Reviews
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="size-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-tight">
              {stats?.reviews.total || 0}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
              <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
              Submitted by audience
            </p>
          </div>
        </div>

        {/* Pending Reviews Card */}
        <div className="group relative p-6 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-amber-500/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-400">
              Pending Reviews
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="size-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-tight">
              {stats?.reviews.pending || 0}
            </h2>
            <p className="text-xs text-amber-400/90 flex items-center gap-1.5 pt-1 font-medium">
              <span className="inline-block size-1.5 rounded-full bg-amber-400 animate-pulse" />
              Requires admin approval
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
