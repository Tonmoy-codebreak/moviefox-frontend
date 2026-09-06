"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getAllUsersAction } from "@/actions/adminAction/getAllUser.action";
import {
  Search,
  Mail,
  Users,
  ShieldCheck,
  Calendar,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  UserX,
  Filter,
  X,
} from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

const AVATAR_PALETTE = [
  "bg-[#E23636]/20 text-[#ff6b6b]",
  "bg-[#F5C518]/20 text-[#F5C518]",
  "bg-blue-500/20 text-blue-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-purple-500/20 text-purple-400",
];

const getAvatarStyle = (name: string) => {
  const idx = name.charCodeAt(0) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx];
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const GetAllUser = () => {
  const router = useRouter();

  const [usersGrouped, setUsersGrouped] = useState<Record<string, User[]>>({});
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [activeTab, setActiveTab] = useState<"ALL" | "ADMIN" | "USER">("ALL");

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const fetchUsers = (name = "", email = "", page = 1) => {
    startTransition(async () => {
      setErrorMsg("");
      const querySearch = name ? name : email;

      const res = await getAllUsersAction({
        searchTerm: querySearch,
        page,
        limit: 10,
      });

      if (res.success) {
        setUsersGrouped(res.data || {});
        if (res.meta) setMeta(res.meta);
      } else {
        setErrorMsg(res.message || "Something went wrong");
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleNameSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchName(value);
    setSearchEmail("");
    fetchUsers(value, "", 1);
  };

  const handleEmailSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchEmail(value);
    setSearchName("");
    fetchUsers("", value, 1);
  };

  const getFilteredGroups = () => {
    const filteredGroups: Record<string, User[]> = {};

    Object.entries(usersGrouped).forEach(([monthYear, users]) => {
      const [groupMonth, groupYear] = monthYear.split(" ");

      // ১. মাস ফিল্টার চেক
      if (
        selectedMonth &&
        groupMonth.toLowerCase() !== selectedMonth.toLowerCase()
      ) {
        return;
      }

      if (selectedYear && groupYear !== selectedYear) {
        return;
      }

      const filteredUsers = users.filter((user) => {
        const matchesTab =
          activeTab === "ALL" ||
          (activeTab === "ADMIN" && user.role === "ADMIN") ||
          (activeTab === "USER" && user.role !== "ADMIN");

        const matchesName = user.name
          .toLowerCase()
          .includes(searchName.toLowerCase());
        const matchesEmail = user.email
          .toLowerCase()
          .includes(searchEmail.toLowerCase());

        return matchesTab && matchesName && matchesEmail;
      });

      if (filteredUsers.length > 0) {
        filteredGroups[monthYear] = filteredUsers;
      }
    });

    return filteredGroups;
  };

  const finalGroupedData = getFilteredGroups();

  const monthsList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const totalVisible = Object.values(finalGroupedData).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  const hasActiveFilters =
    searchName ||
    searchEmail ||
    selectedMonth ||
    selectedYear ||
    activeTab !== "ALL";

  const clearFilters = () => {
    setSearchName("");
    setSearchEmail("");
    setSelectedMonth("");
    setSelectedYear("");
    setActiveTab("ALL");
    fetchUsers("", "", 1);
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl max-w-6xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-[#F5C518]/15">
            <Users className="size-5 text-[#F5C518]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              All Users Management
            </h1>
            <p className="text-xs text-white/40">
              {meta.total} total user{meta.total !== 1 ? "s" : ""} registered
            </p>
          </div>
        </div>

        {/* Role segmented control */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {(["ALL", "ADMIN", "USER"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-[#F5C518] text-black shadow-sm"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab === "ALL"
                ? "All Users"
                : tab === "ADMIN"
                  ? "Admins"
                  : "Regular"}
            </button>
          ))}
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="p-6 border-b border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/30" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={handleNameSearchChange}
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.04] border-2 border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E23636] focus:bg-white/[0.06] focus:ring-4 focus:ring-[#E23636]/10 transition-all"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/30" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={handleEmailSearchChange}
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.04] border-2 border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E23636] focus:bg-white/[0.06] focus:ring-4 focus:ring-[#E23636]/10 transition-all"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/30 pointer-events-none" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.04] border-2 border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E23636] focus:bg-white/[0.06] focus:ring-4 focus:ring-[#E23636]/10 transition-all cursor-pointer appearance-none [&>option]:bg-black [&>option]:text-white"
            >
              <option value="">All Months</option>
              {monthsList.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/30" />
            <input
              type="number"
              placeholder="Filter by year..."
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-white/[0.04] border-2 border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E23636] focus:bg-white/[0.06] focus:ring-4 focus:ring-[#E23636]/10 transition-all"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/40">
              Showing{" "}
              <span className="font-bold text-white">{totalVisible}</span>{" "}
              matching result{totalVisible !== 1 ? "s" : ""}
            </p>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#F5C518] hover:text-[#ffd84d] transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-[#E23636]/10 border border-[#E23636]/30 text-[#ff6b6b] text-sm rounded-xl">
            <AlertCircle className="size-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Skeleton loading state */}
        {isPending && (
          <div className="space-y-3 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-xl"
              >
                <div className="size-10 rounded-full bg-white/10 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 bg-white/10 rounded" />
                  <div className="h-2.5 w-1/2 bg-white/5 rounded" />
                </div>
                <div className="h-7 w-16 bg-white/10 rounded-lg flex-shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isPending && Object.keys(finalGroupedData).length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl space-y-3">
            <div className="mx-auto size-14 rounded-2xl bg-white/5 flex items-center justify-center">
              <UserX className="size-6 text-white/25" />
            </div>
            <div>
              <p className="text-white font-semibold">No users found</p>
              <p className="text-white/40 text-sm mt-0.5">
                Try adjusting your search or filters.
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F5C518] hover:text-[#ffd84d] transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Grouped user list */}
        {!isPending && Object.keys(finalGroupedData).length > 0 && (
          <div className="space-y-8">
            {Object.entries(finalGroupedData).map(([monthYear, users]) => (
              <div key={monthYear} className="space-y-3">
                <div className="flex items-center gap-2 sticky top-0 z-10 py-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5C518] bg-[#F5C518]/10 border border-[#F5C518]/20 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                    <Calendar className="size-3" />
                    {monthYear}
                  </h2>
                  <span className="text-xs text-white/30">
                    {users.length} user{users.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Desktop table */}
                <div className="hidden md:block overflow-hidden border border-white/10 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/[0.04] text-[11px] uppercase tracking-wide text-white/40 border-b border-white/10">
                      <tr>
                        <th className="p-3 font-semibold">User</th>
                        <th className="p-3 font-semibold">Role</th>
                        <th className="p-3 font-semibold">Joined</th>
                        <th className="p-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="group hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex items-center justify-center size-9 rounded-full text-xs font-bold flex-shrink-0 ${getAvatarStyle(
                                  user.name,
                                )}`}
                              >
                                {getInitials(user.name)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-white text-sm truncate">
                                  {user.name}
                                </p>
                                <p className="text-white/40 text-xs truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-md ${
                                user.role === "ADMIN"
                                  ? "bg-[#F5C518]/15 text-[#F5C518] border border-[#F5C518]/30"
                                  : "bg-white/5 text-white/60 border border-white/10"
                              }`}
                            >
                              {user.role === "ADMIN" && (
                                <ShieldCheck className="size-3" />
                              )}
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3 text-white/50 text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() =>
                                router.push(`/allusers/${user.id}`)
                              }
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white/5 text-white/70 border border-white/10 rounded-lg hover:bg-[#F5C518] hover:text-black hover:border-[#F5C518] transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                            >
                              Details
                              <ChevronRight className="size-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-2">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => router.push(`/allusers/${user.id}`)}
                      className="w-full flex items-center gap-3 p-3.5 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.05] transition-colors text-left cursor-pointer"
                    >
                      <div
                        className={`flex items-center justify-center size-10 rounded-full text-xs font-bold flex-shrink-0 ${getAvatarStyle(
                          user.name,
                        )}`}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">
                          {user.name}
                        </p>
                        <p className="text-white/40 text-xs truncate">
                          {user.email}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md flex-shrink-0 ${
                          user.role === "ADMIN"
                            ? "bg-[#F5C518]/15 text-[#F5C518]"
                            : "bg-white/5 text-white/50"
                        }`}
                      >
                        {user.role}
                      </span>
                      <ChevronRight className="size-4 text-white/20 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-6 border-t border-white/10 text-sm text-white/50">
        <div>
          Page <span className="font-bold text-white">{meta.page}</span> of{" "}
          <span className="font-bold text-white">{meta.totalPages}</span>
          <span className="text-white/30"> · {meta.total} total</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fetchUsers(searchName, searchEmail, meta.page - 1)}
            disabled={meta.page <= 1 || isPending}
            className="flex items-center gap-1 px-4 py-2 border border-white/10 text-white/70 rounded-xl hover:bg-white/5 hover:border-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-3.5" />
            Previous
          </button>
          <button
            onClick={() => fetchUsers(searchName, searchEmail, meta.page + 1)}
            disabled={meta.page >= meta.totalPages || isPending}
            className="flex items-center gap-1 px-4 py-2 border border-white/10 text-white/70 rounded-xl hover:bg-white/5 hover:border-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          >
            Next
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetAllUser;
