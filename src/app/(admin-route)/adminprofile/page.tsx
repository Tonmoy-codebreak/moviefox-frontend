"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

const AdminProfile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-1 items-center justify-center p-6 bg-gray-50 min-h-screen">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 bg-gray-900 text-white flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold uppercase">
            {user?.name ? user.name.substring(0, 2) : "AD"}
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {user?.name || "Admin User"}
            </h2>
            <p className="text-sm text-gray-400">
              {user?.email || "admin@gmail.com"}
            </p>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-500">Full Name</span>
            <span className="text-sm font-semibold text-gray-800">
              {user?.name || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-500">
              Email Address
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {user?.email || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-500">
              Account Role
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 uppercase">
              {user?.role || "ADMIN"}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-gray-500">
              Joined Date
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Footer / Logout Button */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
