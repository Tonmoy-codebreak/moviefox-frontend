"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addGenreAction } from "@/actions/adminAction/addGenre.action";
import {
  Tag,
  Hash,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Film,
} from "lucide-react";

const AddGenre = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await addGenreAction({ name });

    setLoading(false);

    if (res.success) {
      setSuccessMsg("Genre created successfully!");
      setName("");
      setTimeout(() => {
        router.push("/genres");
        router.refresh();
      }, 1000);
    } else {
      setErrorMsg(res.message || "Failed to create genre");
    }
  };

  // Purely presentational: mirrors the backend's expected slugification so
  // the admin can see exactly what URL/slug this genre will get before saving.
  const slugPreview = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return (
    <div className="max-w-xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden"
      >
        {/* Decorative header */}
        <div className="relative px-6 pt-6 pb-5 border-b border-white/10 overflow-hidden">
          <Tag className="absolute -right-4 -top-4 size-28 text-white/[0.03] rotate-12" />
          <div className="relative flex items-center gap-3">
            <div className="flex items-center justify-center size-11 rounded-xl bg-[#F5C518]/15">
              <Tag className="size-5 text-[#F5C518]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add New Genre</h2>
              <p className="text-xs text-white/40 mt-0.5">
                Create a genre for movies or series — the slug is generated
                automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-[#E23636]/10 border border-[#E23636]/30 text-[#ff6b6b] text-sm rounded-xl">
              <AlertCircle className="size-4 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl">
              <CheckCircle2 className="size-4 flex-shrink-0" />
              {successMsg}
            </div>
          )}

          {/* Name input */}
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-wide mb-1.5">
              Genre Name
            </label>
            <div className="relative">
              <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/25" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Science Fiction, Action"
                className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border-2 border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E23636] focus:bg-white/[0.06] focus:ring-4 focus:ring-[#E23636]/10 transition-all"
                required
              />
            </div>
          </div>

          {/* Live preview */}
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">
              Live preview
            </p>

            {/* How it'll appear as a genre chip elsewhere in the app */}
            <div className="flex items-center gap-2">
              <Film className="size-3.5 text-white/20 flex-shrink-0" />
              {name.trim() ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5C518] text-black text-xs font-bold rounded-full">
                  {name.trim()}
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1.5 bg-white/5 text-white/25 text-xs font-medium rounded-full border border-dashed border-white/10">
                  Genre chip preview
                </span>
              )}
            </div>

            {/* Slug preview */}
            <div className="flex items-center gap-2 text-xs">
              <Hash className="size-3.5 text-white/20 flex-shrink-0" />
              <code className="text-white/50 font-mono">
                /genres/
                <span
                  className={
                    slugPreview ? "text-[#F5C518]" : "text-white/20 italic"
                  }
                >
                  {slugPreview || "your-genre-slug"}
                </span>
              </code>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 py-5 border-t border-white/10 bg-white/[0.02]">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-5 py-2.5 text-white/60 hover:bg-white/5 hover:text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E23636] hover:bg-[#c92c2c] text-white rounded-xl text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="size-4 text-[#F5C518]" />
                Create Genre
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGenre;
