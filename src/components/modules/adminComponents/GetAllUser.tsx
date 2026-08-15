"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getAllUsersAction } from "@/actions/adminAction/getAllUser.action";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

const GetAllUser = () => {
  const router = useRouter();

  const [usersGrouped, setUsersGrouped] = useState<Record<string, User[]>>({});
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // ফিল্টার স্টেটসমূহ
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  // আলাদা করা মাস এবং বছর ফিল্টার স্টেট
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

  // ডাটা ফিল্টার করার লজিক (Tab, Month, Year এবং Search অনুযায়ী)
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

      // ২. বছর ফিল্টার চেক
      if (selectedYear && groupYear !== selectedYear) {
        return;
      }

      // ৩. রোল (Tab) এবং সার্চ ফিল্টার অনুযায়ী ইউজার ফিল্টার করা
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

  // ১২ মাসের ড্রপডাউন অপশন লিস্ট
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

  return (
    <div className="bg-white p-6 border rounded-2xl shadow-sm space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          All Users Management
        </h1>

        {/* Role wise user display section */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "ALL"
                ? "bg-white shadow-sm text-indigo-600"
                : "text-gray-600"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setActiveTab("ADMIN")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "ADMIN"
                ? "bg-white shadow-sm text-purple-600"
                : "text-gray-600"
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => setActiveTab("USER")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "USER"
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-600"
            }`}
          >
            Regular Users
          </button>
        </div>
      </div>

      {/* Search section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Search by Name
          </label>
          <input
            type="text"
            placeholder="Type name..."
            value={searchName}
            onChange={handleNameSearchChange}
            className="w-full p-2.5 border rounded-xl text-sm focus:outline-indigo-600 bg-gray-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Search by Email
          </label>
          <input
            type="text"
            placeholder="Type email..."
            value={searchEmail}
            onChange={handleEmailSearchChange}
            className="w-full p-2.5 border rounded-xl text-sm focus:outline-indigo-600 bg-gray-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Filter by Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-2.5 border rounded-xl text-sm focus:outline-indigo-600 bg-gray-50/50 cursor-pointer"
          >
            <option value="">All Months</option>
            {monthsList.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Filter by Year
          </label>
          <input
            type="number"
            placeholder="e.g. 2026"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-2.5 border rounded-xl text-sm focus:outline-indigo-600 bg-gray-50/50"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">
          {errorMsg}
        </div>
      )}

      {isPending && (
        <div className="text-center py-6 text-sm text-gray-500">
          Loading users...
        </div>
      )}

      {/* display user list */}
      {!isPending && Object.keys(finalGroupedData).length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm border border-dashed rounded-xl">
          No users match your applied filters.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(finalGroupedData).map(([monthYear, users]) => (
            <div key={monthYear} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">
                {monthYear} ({users.length})
              </h2>

              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Joined Date</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm text-gray-700">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="p-3 font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="p-3 text-gray-600">{user.email}</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                              user.role === "ADMIN"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => router.push(`/allusers/${user.id}`)}
                            className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination section */}
      <div className="flex justify-between items-center pt-4 border-t text-sm text-gray-600">
        <div>
          Showing page <span className="font-semibold">{meta.page}</span> of{" "}
          <span className="font-semibold">{meta.totalPages}</span> (Total
          fetched: {meta.total})
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fetchUsers(searchName, searchEmail, meta.page - 1)}
            disabled={meta.page <= 1 || isPending}
            className="px-4 py-2 border rounded-xl hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>
          <button
            onClick={() => fetchUsers(searchName, searchEmail, meta.page + 1)}
            disabled={meta.page >= meta.totalPages || isPending}
            className="px-4 py-2 border rounded-xl hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetAllUser;
