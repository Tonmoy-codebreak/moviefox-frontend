"use client";

import {
  getAdminOverviewAction,
  OverviewStatsData,
} from "@/actions/adminAction/adminOverview.action";
import React, { useEffect, useState } from "react";

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
      <div className="flex justify-center items-center h-64 text-slate-400">
        <p className="animate-pulse">Loading dashboard statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white tracking-wide">
        Dashboard Overview
      </h1>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users Card */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <p className="text-sm font-medium text-slate-400">Total Users</p>
          <h2 className="text-3xl font-extrabold text-indigo-400">
            {stats?.users.total || 0}
          </h2>
          <p className="text-xs text-slate-500">Registered platform accounts</p>
        </div>

        {/* Total Media Card */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <p className="text-sm font-medium text-slate-400">Total Media</p>
          <h2 className="text-3xl font-extrabold text-blue-400">
            {stats?.media.total || 0}
          </h2>
          <p className="text-xs text-slate-500">
            {stats?.media.published || 0} currently published
          </p>
        </div>

        {/* Total Reviews Card */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <p className="text-sm font-medium text-slate-400">Total Reviews</p>
          <h2 className="text-3xl font-extrabold text-emerald-400">
            {stats?.reviews.total || 0}
          </h2>
          <p className="text-xs text-slate-500">Submitted by audience</p>
        </div>

        {/* Pending Reviews Card */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <p className="text-sm font-medium text-slate-400">Pending Reviews</p>
          <h2 className="text-3xl font-extrabold text-amber-400">
            {stats?.reviews.pending || 0}
          </h2>
          <p className="text-xs text-amber-400/80">Requires admin approval</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
