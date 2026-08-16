"use client";

import React, { useState } from "react";
import { updateMediaInfoAction } from "@/actions/adminAction/editMediaInfo.action";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Type,
  Link2,
  FileText,
  Tag,
  X,
  Search,
  Film,
  ShieldCheck,
  CalendarDays,
  ImageIcon,
  PlayCircle,
  Cast,
  Sparkles,
  Radio,
  ArrowLeft,
  Save,
  Loader2,
} from "lucide-react";

type Genre = {
  id: string;
  name: string;
  slug: string;
};

type Media = {
  id: string | number;
  title?: string;
  slug?: string;
  description?: string;
  type?: string;
  access?: string;
  releaseYear?: number | string | null;
  posterUrl?: string;
  trailerUrl?: string;
  streamingUrl?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  genres?: { genre: Genre }[];
};

type Props = {
  media: Media;
  allGenres: Genre[];
};

const EditMediaInfo = ({ media, allGenres }: Props) => {
  const router = useRouter();
  const mediaId = String(media.id);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const initialGenreIds = media.genres?.map((g) => g.genre.id) || [];

  const [formData, setFormData] = useState({
    title: media.title || "",
    slug: media.slug || "",
    description: media.description || "",
    type: media.type || "",
    access: media.access || "",
    releaseYear: media.releaseYear || "",
    posterUrl: media.posterUrl || "",
    trailerUrl: media.trailerUrl || "",
    streamingUrl: media.streamingUrl || "",
    isPublished: media.isPublished ?? false,
    isFeatured: media.isFeatured ?? false,
    genreIds: initialGenreIds,
  });

  const [genreSearch, setGenreSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddGenre = (genreId: string) => {
    if (!formData.genreIds.includes(genreId)) {
      setFormData((prev) => ({
        ...prev,
        genreIds: [...prev.genreIds, genreId],
      }));
    }
    setGenreSearch("");
    setIsDropdownOpen(false);
  };

  const handleRemoveGenre = (genreId: string) => {
    setFormData((prev) => ({
      ...prev,
      genreIds: prev.genreIds.filter((id) => id !== genreId),
    }));
  };

  const filteredGenres = allGenres.filter(
    (genre) =>
      genre.name.toLowerCase().includes(genreSearch.toLowerCase()) &&
      !formData.genreIds.includes(genre.id),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      ...formData,
      releaseYear: formData.releaseYear ? Number(formData.releaseYear) : null,
    };

    const res = await updateMediaInfoAction(mediaId, payload);

    setLoading(false);

    if (res.success) {
      setSuccessMsg("Media updated successfully!");
      setTimeout(() => {
        router.push(`/allmedia/${media.id}`);
        router.refresh();
      }, 1000);
    } else {
      setErrorMsg(res.message || "Failed to update");
    }
  };

  // shared input styling — dark surface, subtle border, gold focus
  const inputClass =
    "w-full pl-10 pr-3.5 py-2.5 bg-[#0B0F14] border border-[#252E3A] rounded-lg text-sm text-[#F5F5F2] placeholder:text-[#6F7885] outline-none transition-colors focus:border-[#E5B84B] focus:shadow-[0_0_0_3px_rgba(229,184,75,0.12)]";
  const inputClassNoIcon =
    "w-full px-3.5 py-2.5 bg-[#0B0F14] border border-[#252E3A] rounded-lg text-sm text-[#F5F5F2] placeholder:text-[#6F7885] outline-none transition-colors focus:border-[#E5B84B] focus:shadow-[0_0_0_3px_rgba(229,184,75,0.12)]";
  const labelClass =
    "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#8D96A3] mb-1.5";

  return (
    <div className="min-h-screen bg-[#0B0F14]">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">
        {/* page heading — stable, doesn't move with form state */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs text-[#8D96A3] hover:text-[#E5B84B] transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft size={13} strokeWidth={2} />
            Back
          </button>
          <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-[#F5F5F2]">
            Edit Media
          </h1>
          <p className="text-sm text-[#6F7885] mt-1">
            Update the details for &ldquo;{media.title || "this title"}&rdquo;.
          </p>
        </div>

        {/* status banners — fixed slot above the form, doesn't shift layout below */}
        {(errorMsg || successMsg) && (
          <div className="mb-5">
            {errorMsg && (
              <div className="flex items-center gap-2.5 p-3.5 bg-[rgba(226,109,109,0.08)] border border-[rgba(226,109,109,0.3)] text-[#E26D6D] text-sm rounded-xl">
                <AlertTriangle
                  size={16}
                  strokeWidth={2}
                  className="flex-shrink-0"
                />
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="flex items-center gap-2.5 p-3.5 bg-[rgba(98,198,138,0.08)] border border-[rgba(98,198,138,0.3)] text-[#62C68A] text-sm rounded-xl">
                <CheckCircle2
                  size={16}
                  strokeWidth={2}
                  className="flex-shrink-0"
                />
                {successMsg}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ===== Basic info ===== */}
          <div className="bg-[#111720] border border-[#252E3A] rounded-2xl p-6 space-y-5">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8D96A3] flex items-center gap-1.5">
              <Film size={13} strokeWidth={2} />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>
                  <Type size={12} strokeWidth={2} />
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={inputClassNoIcon}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  <Link2 size={12} strokeWidth={2} />
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className={inputClassNoIcon}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  <FileText size={12} strokeWidth={2} />
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className={`${inputClassNoIcon} resize-none leading-relaxed`}
                  placeholder="Write media description..."
                />
              </div>
            </div>
          </div>

          {/* ===== Genres ===== */}
          <div className="bg-[#111720] border border-[#252E3A] rounded-2xl p-6 space-y-3">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8D96A3] flex items-center gap-1.5">
              <Tag size={13} strokeWidth={2} />
              Genres
            </h2>

            {/* selected genre pills */}
            <div className="flex flex-wrap gap-2 min-h-[46px] p-2.5 border border-[#252E3A] rounded-xl bg-[#0B0F14]">
              {formData.genreIds.length === 0 ? (
                <span className="text-xs text-[#6F7885] self-center px-1.5">
                  No genres selected yet. Search below to add.
                </span>
              ) : (
                formData.genreIds.map((id) => {
                  const genreObj = allGenres.find((g) => g.id === id);
                  if (!genreObj) return null;
                  return (
                    <span
                      key={genreObj.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1C2531] border border-[#303A47] text-[#F5F5F2] text-xs font-medium rounded-lg"
                    >
                      {genreObj.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveGenre(genreObj.id)}
                        className="text-[#8D96A3] hover:text-[#E26D6D] rounded-full p-0.5 transition-colors cursor-pointer"
                        title="Remove genre"
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                    </span>
                  );
                })
              )}
            </div>

            {/* genre search input and auto suggestion */}
            <div className="relative">
              <Search
                size={15}
                strokeWidth={2}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F7885] pointer-events-none"
              />
              <input
                type="text"
                placeholder="Type to search & add genres..."
                value={genreSearch}
                onChange={(e) => {
                  setGenreSearch(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className={inputClass}
              />

              {/* suggestion dropdown — absolutely positioned overlay, doesn't push layout */}
              {isDropdownOpen && genreSearch.trim() !== "" && (
                <div className="absolute z-20 w-full mt-1.5 bg-[#161D27] border border-[#252E3A] rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] max-h-48 overflow-y-auto">
                  {filteredGenres.length === 0 ? (
                    <div className="p-3.5 text-xs text-[#6F7885] text-center">
                      No matching genres found.
                    </div>
                  ) : (
                    filteredGenres.map((genre) => (
                      <div
                        key={genre.id}
                        onClick={() => handleAddGenre(genre.id)}
                        className="px-4 py-2.5 text-sm text-[#B8C0CA] hover:bg-[#1C2531] hover:text-[#F2C963] cursor-pointer transition-colors border-b border-[#1D2530] last:border-none"
                      >
                        {genre.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ===== Classification ===== */}
          <div className="bg-[#111720] border border-[#252E3A] rounded-2xl p-6 space-y-5">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8D96A3] flex items-center gap-1.5">
              <ShieldCheck size={13} strokeWidth={2} />
              Classification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>
                  <Cast size={12} strokeWidth={2} />
                  Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={inputClassNoIcon}
                  placeholder="movie / series"
                />
              </div>

              <div>
                <label className={labelClass}>
                  <ShieldCheck size={12} strokeWidth={2} />
                  Access
                </label>
                <input
                  type="text"
                  name="access"
                  value={formData.access}
                  onChange={handleChange}
                  className={inputClassNoIcon}
                  placeholder="free / premium"
                />
              </div>

              <div>
                <label className={labelClass}>
                  <CalendarDays size={12} strokeWidth={2} />
                  Release Year
                </label>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleChange}
                  className={inputClassNoIcon}
                />
              </div>
            </div>
          </div>

          {/* ===== Media links ===== */}
          <div className="bg-[#111720] border border-[#252E3A] rounded-2xl p-6 space-y-5">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8D96A3] flex items-center gap-1.5">
              <Link2 size={13} strokeWidth={2} />
              Media Links
            </h2>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className={labelClass}>
                  <ImageIcon size={12} strokeWidth={2} />
                  Poster URL
                </label>
                <input
                  type="text"
                  name="posterUrl"
                  value={formData.posterUrl}
                  onChange={handleChange}
                  className={inputClassNoIcon}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className={labelClass}>
                  <PlayCircle size={12} strokeWidth={2} />
                  Trailer URL
                </label>
                <input
                  type="text"
                  name="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={handleChange}
                  className={inputClassNoIcon}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className={labelClass}>
                  <Radio size={12} strokeWidth={2} />
                  Streaming URL
                </label>
                <input
                  type="text"
                  name="streamingUrl"
                  value={formData.streamingUrl}
                  onChange={handleChange}
                  className={inputClassNoIcon}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* ===== Visibility toggles ===== */}
          <div className="bg-[#111720] border border-[#252E3A] rounded-2xl p-6">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8D96A3] mb-4 flex items-center gap-1.5">
              <Sparkles size={13} strokeWidth={2} />
              Visibility
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-between gap-3 p-3.5 bg-[#0B0F14] border border-[#252E3A] rounded-xl cursor-pointer">
                <span className="text-sm font-medium text-[#F5F5F2]">
                  Is Published
                </span>
                <span className="relative inline-flex items-center flex-shrink-0">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <span className="h-[22px] w-[38px] rounded-full bg-[#252E3A] border border-[#3A4553] peer-checked:bg-[#E5B84B] peer-checked:border-[#E5B84B] transition-colors" />
                  <span className="absolute left-[3px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#A7AFBA] peer-checked:bg-[#0B0F14] peer-checked:translate-x-[16px] transition-transform" />
                </span>
              </label>

              <label className="flex items-center justify-between gap-3 p-3.5 bg-[#0B0F14] border border-[#252E3A] rounded-xl cursor-pointer">
                <span className="text-sm font-medium text-[#F5F5F2]">
                  Is Featured
                </span>
                <span className="relative inline-flex items-center flex-shrink-0">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <span className="h-[22px] w-[38px] rounded-full bg-[#252E3A] border border-[#3A4553] peer-checked:bg-[#E5B84B] peer-checked:border-[#E5B84B] transition-colors" />
                  <span className="absolute left-[3px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#A7AFBA] peer-checked:bg-[#0B0F14] peer-checked:translate-x-[16px] transition-transform" />
                </span>
              </label>
            </div>
          </div>

          {/* ===== Actions — sticky-feeling but stays in flow, always same position ===== */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 bg-transparent border border-[#3A4553] hover:bg-[#161D27] text-[#F5F5F2] rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5B84B] hover:bg-[#F2C963] text-[#0B0F14] rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={15}
                    strokeWidth={2.5}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={15} strokeWidth={2.5} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMediaInfo;
