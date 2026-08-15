"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { updateGenreAction } from "@/actions/adminAction/editGenre.action";
import {
  Tag,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

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
      <div className="flex items-start gap-3 border-b pb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Edit Genre</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Update the genre name. Slug will be updated automatically.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-start gap-2 p-3 bg-green-50 text-green-600 text-sm rounded-xl border border-green-200">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Genre Name
          </label>
          <div className="relative">
            <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Science Fiction"
              className="w-full p-3 pl-9 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 bg-gray-50/50 transition-colors"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EditGenre;
