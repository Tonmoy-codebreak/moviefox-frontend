"use client";

import React, { useEffect, useState, useTransition } from "react";
import { getUserDetailsForAdminAction } from "@/actions/adminAction/userDetailsForAdmin.action";

type Props = {
  params: {
    id: string;
  };
};

type UserReview = {
  id: string;
  rating: number;
  content?: string;
  review?: string;
  createdAt?: string;
  media: {
    id: string;
    title: string;
    slug: string;
    posterUrl?: string;
  };
};

type UserMediaItem = {
  media: {
    id: string;
    title: string;
    slug: string;
    posterUrl?: string;
  };
};

const UserDetailsForAdmin = ({ params }: Props) => {
  const userId = params.id;
  const [isPending, startTransition] = useTransition();
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    reviews: UserReview[];
    watchlists: UserMediaItem[];
    completedMedia: UserMediaItem[];
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // ট্যাব কন্ট্রোল
  const [activeTab, setActiveTab] = useState<
    "overview" | "reviews" | "watchlist" | "completed"
  >("overview");

  useEffect(() => {
    startTransition(async () => {
      const res = await getUserDetailsForAdminAction(userId);
      if (res.success) {
        setUserData(res.data);
      } else {
        setErrorMsg(res.message || "Something went wrong");
      }
    });
  }, [userId]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-sm text-gray-500 animate-pulse">
          Loading user details...
        </p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl max-w-4xl mx-auto my-6 text-sm">
        {errorMsg}
      </div>
    );
  }

  if (!userData) return null;

  const {
    name,
    email,
    role,
    createdAt,
    updatedAt,
    reviews = [],
    watchlists = [],
    completedMedia = [],
  } = userData;

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* প্রোফাইল হেডার কার্ড */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 font-bold text-2xl rounded-2xl flex items-center justify-center">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{name || "N/A"}</h1>
            <p className="text-sm text-gray-500">{email || "N/A"}</p>
            <span
              className={`inline-block mt-2 px-2.5 py-0.5 text-xs font-semibold rounded-md ${
                role === "ADMIN"
                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              {role || "USER"}
            </span>
          </div>
        </div>

        {/* স্ট্যাটস কাউন্ট */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="bg-gray-50 border p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500">Reviews</p>
            <p className="text-lg font-bold text-gray-900">{reviews.length}</p>
          </div>
          <div className="bg-gray-50 border p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500">Watchlist</p>
            <p className="text-lg font-bold text-gray-900">
              {watchlists.length}
            </p>
          </div>
          <div className="bg-gray-50 border p-3 rounded-xl text-center">
            <p className="text-xs text-gray-500">Completed</p>
            <p className="text-lg font-bold text-gray-900">
              {completedMedia.length}
            </p>
          </div>
        </div>
      </div>

      {/* নেভিগেশন ট্যাব */}
      <div className="flex border-b gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "overview"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Overview & Details
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "reviews"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Reviews Posted ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab("watchlist")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "watchlist"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Watchlist ({watchlists.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "completed"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Completed Movies ({completedMedia.length})
        </button>
      </div>

      {/* ট্যাবের ভেতরে কন্টেন্ট ডিসপ্লে */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Account Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-xl border">
                <span className="text-gray-400 block text-xs">User ID</span>
                <span className="font-medium text-gray-800">{userId}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border">
                <span className="text-gray-400 block text-xs">Joined Date</span>
                <span className="font-medium text-gray-800">
                  {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border">
                <span className="text-gray-400 block text-xs">Status</span>
                <span className="font-medium text-gray-800">Active</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border">
                <span className="text-gray-400 block text-xs">
                  Last Updated
                </span>
                <span className="font-medium text-gray-800">
                  {updatedAt ? new Date(updatedAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Reviews Posted
            </h3>
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">
                No reviews posted by this user yet.
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review: UserReview, idx: number) => (
                  <div
                    key={review.id || idx}
                    className="p-4 border rounded-xl bg-gray-50/50 space-y-3"
                  >
                    {/* মুভির নাম এবং রেটিং */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3">
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wider block">
                          Reviewed Movie / Series
                        </span>
                        <h4 className="font-bold text-base text-gray-900">
                          {review?.media?.title || "Unknown Title"}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md border border-amber-200">
                          ⭐ {review?.rating || 0} / 5
                        </span>
                        {review?.createdAt && (
                          <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ইউজারের লেখা রিভিউ কমেন্ট */}
                    <div className="space-y-1">
                      <span className="text-xs text-gray-400 block">
                        Review Content
                      </span>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-100">
                        {review?.content ||
                          review?.review ||
                          "No text provided for this review."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "watchlist" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Watchlisted Movies
            </h3>
            {watchlists.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">
                Watchlist is empty.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {watchlists.map((item: UserMediaItem, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 border rounded-xl bg-gray-50/50 flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {item?.media?.title || "Movie Name"}
                    </span>
                    <span className="text-xs text-gray-400">Watchlist</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Completed Movies
            </h3>
            {completedMedia.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">
                No completed movies found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {completedMedia.map((item: UserMediaItem, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 border rounded-xl bg-gray-50/50 flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {item?.media?.title || "Movie Name"}
                    </span>
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsForAdmin;
