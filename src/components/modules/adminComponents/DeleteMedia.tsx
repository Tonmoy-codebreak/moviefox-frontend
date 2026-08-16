"use client";

import React, { useState } from "react";
import { softDeleteMedia } from "@/actions/adminAction/deleteMedia.action";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  mediaId: string;
};

const DeleteMedia = ({ mediaId }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to soft delete this media?")) return;

    setLoading(true);
    try {
      const res = await softDeleteMedia(mediaId);

      if (res.success) {
        alert(res.message || "Media deleted successfully");
        router.push("/allmedia"); // ডিলিট হওয়ার পর পেজ রিডাইরেক্ট হবে
        router.refresh();
      } else {
        alert(res.message || "Failed to delete media");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      <span>{loading ? "Deleting..." : "Delete Media"}</span>
    </button>
  );
};

export default DeleteMedia;
