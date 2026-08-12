"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { updateGenreAction } from "@/actions/adminAction/editGenre.action";

type Genre = {
  id: string;
  name: string;
  slug?: string;
};

type Props = {
  genre: Genre;
};

const EditGenre = ({ genre }: Props) => {
  const router = useRouter();
  const [name, setName] = useState(genre.name || "");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await updateGenreAction(genre.id, { name });

    setLoading(false);

    if (res.success) {
      setSuccessMsg("Genre updated successfully!");
      setTimeout(() => {
        router.push(`/genres/${genre.id}`);
        router.refresh();
      }, 1000);
    } else {
      setErrorMsg(res.message || "Failed to update genre");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm space-y-6 max-w-xl mx-auto"
    >
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900">Edit Genre</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Update the genre name. Slug will be updated automatically.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-50 text-green-600 text-sm rounded-xl border border-green-200">
          {successMsg}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Genre Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-indigo-600 bg-gray-50/50"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditGenre;
