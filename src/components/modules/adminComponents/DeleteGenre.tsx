"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteGenreAction } from "@/actions/adminAction/deleteGenre.action";

type Props = {
  genreId: string;
  genreName: string;
};

const DeleteGenre = ({ genreId, genreName }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setErrorMsg("");

    const res = await deleteGenreAction(genreId);

    setLoading(false);

    if (res.success) {
      router.replace("/genres");
    } else {
      setErrorMsg(res.message || "Failed to delete genre");
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white p-6 border border-red-100 rounded-2xl shadow-sm space-y-4 max-w-xl mx-auto">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-red-600">Delete Genre</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Permanently remove this genre from the database.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
          {errorMsg}
        </div>
      )}

      {!showConfirm ? (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-600">
            Want to delete{" "}
            <strong className="text-gray-900">{genreName}</strong>?
          </span>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            Delete Genre
          </button>
        </div>
      ) : (
        <div className="p-4 bg-red-50/50 border border-red-200 rounded-xl space-y-3">
          <p className="text-xs font-semibold text-red-700">
            Are you sure you want to delete &quot;{genreName}&quot;? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteGenre;
