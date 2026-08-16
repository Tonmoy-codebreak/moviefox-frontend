"use client";

import React, { useEffect, useState } from "react";
import {
  getSoftDeletedMedia,
  restoreMedia,
  permanentDeleteMedia,
} from "@/actions/adminAction/restoreDeletedMedia.action";
import { Trash2, RotateCcw, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";

type Media = {
  id: string;
  title?: string;
  type?: string;
  posterUrl?: string;
  deletedAt?: string | Date;
};

const RestoreDeletedMedia = () => {
  const [deletedMediaList, setDeletedMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const router = useRouter();

  // পেজ লোড হওয়ার সময় একবার ডাটা ফেচ করার জন্য
  useEffect(() => {
    let isMounted = true;

    const loadTrash = async () => {
      setLoading(true);
      const res = await getSoftDeletedMedia();
      if (isMounted) {
        if (res.success) {
          setDeletedMediaList(res.data);
        }
        setLoading(false);
      }
    };

    loadTrash();

    return () => {
      isMounted = false;
    };
  }, []);

  // সার্চ হ্যান্ডলার (সার্চ বাটনে ক্লিক করলে বা ফর্ম সাবমিট হলে কাজ করবে)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const query = searchTerm
      ? `?searchTerm=${encodeURIComponent(searchTerm)}`
      : "";
    const res = await getSoftDeletedMedia(query);

    if (res.success) {
      setDeletedMediaList(res.data);
    }
    setLoading(false);
  };

  // রিস্টোর হ্যান্ডলার
  const handleRestore = async (id: string) => {
    if (!confirm("Are you sure you want to restore this media?")) return;

    setActionLoadingId(id);
    const res = await restoreMedia(id);

    if (res.success) {
      alert(res.message);
      setDeletedMediaList((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    } else {
      alert(res.message);
    }
    setActionLoadingId(null);
  };

  // পার্মানেন্ট ডিলিট হ্যান্ডলার
  const handlePermanentDelete = async (id: string) => {
    if (
      !confirm(
        "WARNING: This action is irreversible! Do you want to permanently delete this media?",
      )
    )
      return;

    setActionLoadingId(id);
    const res = await permanentDeleteMedia(id);

    if (res.success) {
      alert(res.message);
      setDeletedMediaList((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    } else {
      alert(res.message);
    }
    setActionLoadingId(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Recycle Bin (Trash)
          </h1>
          <p className="text-sm text-gray-400">
            Manage soft-deleted media. You can restore them or delete them
            permanently.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Content List */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : deletedMediaList.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No deleted media found in the trash.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {deletedMediaList.map((media) => {
              const isActionProcessing = actionLoadingId === media.id;
              const imageSrc =
                media.posterUrl ||
                "https://placehold.co/100x150?text=No+Poster";

              return (
                <div
                  key={media.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={imageSrc}
                      alt={media.title}
                      className="w-12 h-16 object-cover rounded-lg border bg-gray-100 flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800 text-base">
                        {media.title || "Untitled Media"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {media.type || "N/A"}
                        </span>
                        <span className="text-xs text-red-500">
                          Deleted on:{" "}
                          {media.deletedAt
                            ? new Date(media.deletedAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Restore & Permanent Delete) */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {/* Restore Button */}
                    <button
                      type="button"
                      onClick={() => handleRestore(media.id)}
                      disabled={isActionProcessing}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 border border-emerald-200"
                    >
                      {isActionProcessing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5" />
                      )}
                      <span>Restore</span>
                    </button>

                    {/* Permanent Delete Button */}
                    <button
                      type="button"
                      onClick={() => handlePermanentDelete(media.id)}
                      disabled={isActionProcessing}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 border border-red-200"
                    >
                      {isActionProcessing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Delete Forever</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestoreDeletedMedia;
