"use client";

import React, { useEffect, useState, useTransition } from "react";

import { Check, Trash2, Loader2, AlertCircle } from "lucide-react";
import {
  approveReviewAction,
  deleteReviewAction,
  getPendingReviewsAction,
} from "@/actions/adminAction/showPendingReviews.action";

type ReviewUser = {
  id: string;
  name: string;
  email: string;
};

type ReviewMedia = {
  id: string;
  title: string;
  slug: string;
};

type PendingReview = {
  id: string;
  rating: number;
  content?: string;
  review?: string;
  createdAt?: string;
  user: ReviewUser;
  media: ReviewMedia;
};

const ShowPendingReviews = () => {
  const [isPending, startTransition] = useTransition();
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  //   fetching pending review
  const fetchReviews = () => {
    startTransition(async () => {
      setErrorMsg("");
      const res = await getPendingReviewsAction();
      if (res.success) {
        setReviews(res.data);
      } else {
        setErrorMsg(res.message);
      }
    });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  //  approve review handler
  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await approveReviewAction(id);
    setActionLoadingId(null);

    if (res.success) {
      setSuccessMsg(res.message);
      setReviews((prev) => prev.filter((item) => item.id !== id));
    } else {
      setErrorMsg(res.message);
    }
  };

  //   delete review handler
  const handleDelete = async (id: string) => {
    setActionLoadingId(id);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await deleteReviewAction(id);
    setActionLoadingId(null);

    if (res.success) {
      setSuccessMsg(res.message);
      setReviews((prev) => prev.filter((item) => item.id !== id));
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pending Reviews</h1>
          <p className="text-xs text-gray-500">
            Approve or reject user reviews before publishing.
          </p>
        </div>
        <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-full">
          Total: {reviews.length}
        </span>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-200">
          <span>{successMsg}</span>
        </div>
      )}

      {isPending && reviews.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-2xl">
          <p className="text-sm text-gray-400">No pending reviews found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((item) => {
            const isLoading = actionLoadingId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white border rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                      Movie / Series
                    </span>
                    <h3 className="font-bold text-gray-900">
                      {item.media?.title || "Unknown Title"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md border border-amber-200">
                      ⭐ {item.rating} / 5
                    </span>
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <span className="text-xs text-gray-400 block">
                    Review Content
                  </span>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border">
                    {item.content || item.review || "No text provided."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
                  <div className="text-xs text-gray-500">
                    By:{" "}
                    <strong className="text-gray-800">{item.user?.name}</strong>{" "}
                    ({item.user?.email})
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleApprove(item.id)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      Confirm / Approve
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShowPendingReviews;
