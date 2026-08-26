"use client";

import React, { useState } from "react";
import { addNewMediaAction } from "@/actions/adminAction/addNewMedia.action";
import { useRouter } from "next/navigation";
import {
  Film,
  Tag,
  Link2,
  Settings2,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Star,
  Calendar,
  ArrowLeft,
  Loader2,
  Ticket,
  ListChecks,
} from "lucide-react";

type Genre = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  allGenres: Genre[];
};

const AddNewMedia = ({ allGenres }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    type: "MOVIE",
    access: "FREE",
    releaseYear: "",
    posterUrl: "",
    trailerUrl: "",
    streamingUrl: "",
    isPublished: false,
    isFeatured: false,
    genreIds: [] as string[],
  });

  const [genreSearch, setGenreSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Tracks whether the current posterUrl failed to load, so we can show a
  // fallback instead of a blank box — resets whenever the URL changes.
  const [posterBroken, setPosterBroken] = useState(false);

  // --- purely presentational: completion meter, derived only ---
  const completionFields = [
    formData.title.trim() !== "",
    formData.slug.trim() !== "",
    formData.description.trim() !== "",
    formData.posterUrl.trim() !== "",
    formData.releaseYear !== "",
    formData.genreIds.length > 0,
  ];
  const completionPercent = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100,
  );

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

    if (name === "posterUrl") {
      setPosterBroken(false);
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
      releaseYear: formData.releaseYear
        ? Number(formData.releaseYear)
        : undefined,
      description:
        formData.description.trim() === "" ? undefined : formData.description,
      posterUrl:
        formData.posterUrl.trim() === "" ? undefined : formData.posterUrl,
      trailerUrl:
        formData.trailerUrl.trim() === "" ? undefined : formData.trailerUrl,
      streamingUrl:
        formData.streamingUrl.trim() === "" ? undefined : formData.streamingUrl,
    };

    const res = await addNewMediaAction(payload);

    setLoading(false);

    if (res.success) {
      setSuccessMsg("Media created successfully!");
      setTimeout(() => {
        router.push("/allmedia");
        router.refresh();
      }, 1000);
    } else {
      setErrorMsg(res.message || "Failed to create media");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50">
      {/* Sticky top bar — contained within this component's own area, not viewport-fixed */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center justify-center size-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Add New Media
              </h1>
              <p className="text-xs text-gray-400">
                Create a new title for your catalog
              </p>
            </div>
          </div>

          {/* Completion ring */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="relative size-10 flex-shrink-0">
              <svg className="size-10 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="#F5C518"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${completionPercent * 0.974} 1000`}
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-700">
                {completionPercent}%
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-gray-700">Profile ready</p>
              <p className="text-[11px] text-gray-400">
                {completionPercent === 100
                  ? "Looking complete!"
                  : "Fill in more details"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-[#E23636] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="size-4 text-[#F5C518]" />
                  Create Media
                </>
              )}
            </button>
          </div>
        </div>

        {/* Alerts */}
        {(errorMsg || successMsg) && (
          <div className="px-6 pb-3">
            {errorMsg && (
              <div className="flex items-center gap-2 text-sm font-medium text-[#E23636] bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertCircle className="size-4 flex-shrink-0" />
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <CheckCircle2 className="size-4 flex-shrink-0" />
                {successMsg}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column - all form fields, including visibility settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center size-8 rounded-lg bg-[#F5C518]/15">
                <Film className="size-4 text-[#F5C518]" />
              </div>
              <h2 className="font-bold text-gray-900">Basic Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. The Last Horizon"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E23636] focus:bg-white focus:ring-4 focus:ring-[#E23636]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g. the-last-horizon"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E23636] focus:bg-white focus:ring-4 focus:ring-[#E23636]/10 transition-all font-mono"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Used in the URL — lowercase, hyphen-separated.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Description
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {formData.description.length} chars
                  </span>
                </div>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a short synopsis for this title..."
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E23636] focus:bg-white focus:ring-4 focus:ring-[#E23636]/10 transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* Media Details */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center size-8 rounded-lg bg-[#F5C518]/15">
                <Settings2 className="size-4 text-[#F5C518]" />
              </div>
              <h2 className="font-bold text-gray-900">Media Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-[#E23636] focus:bg-white focus:ring-4 focus:ring-[#E23636]/10 transition-all cursor-pointer"
                >
                  <option value="MOVIE">Movie</option>
                  <option value="SERIES">Series</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Access
                </label>
                <select
                  name="access"
                  value={formData.access}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-[#E23636] focus:bg-white focus:ring-4 focus:ring-[#E23636]/10 transition-all cursor-pointer"
                >
                  <option value="FREE">Free</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  <Calendar className="size-3" />
                  Release Year
                </label>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleChange}
                  placeholder="2026"
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E23636] focus:bg-white focus:ring-4 focus:ring-[#E23636]/10 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Genres */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center size-8 rounded-lg bg-[#F5C518]/15">
                <Tag className="size-4 text-[#F5C518]" />
              </div>
              <h2 className="font-bold text-gray-900">Genres</h2>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-gray-50 border-2 border-gray-200 rounded-xl mb-3">
              {formData.genreIds.length === 0 ? (
                <span className="text-sm text-gray-400 py-1">
                  No genres selected yet — search below to add.
                </span>
              ) : (
                formData.genreIds.map((id) => {
                  const genreObj = allGenres.find((g) => g.id === id);
                  if (!genreObj) return null;
                  return (
                    <span
                      key={genreObj.id}
                      className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-black text-white text-xs font-semibold rounded-full"
                    >
                      {genreObj.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveGenre(genreObj.id)}
                        className="flex items-center justify-center size-4 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  );
                })
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search genres to add..."
                value={genreSearch}
                onChange={(e) => {
                  setGenreSearch(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E23636] focus:bg-white focus:ring-4 focus:ring-[#E23636]/10 transition-all"
              />

              {isDropdownOpen && genreSearch.trim() !== "" && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredGenres.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400">
                      No matching genres found.
                    </div>
                  ) : (
                    filteredGenres.map((genre) => (
                      <div
                        key={genre.id}
                        onClick={() => handleAddGenre(genre.id)}
                        className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center gap-2"
                      >
                        <Tag className="size-3.5 text-gray-300" />
                        {genre.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Media Links */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center size-8 rounded-lg bg-[#F5C518]/15">
                <Link2 className="size-4 text-[#F5C518]" />
              </div>
              <h2 className="font-bold text-gray-900">Media Links</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Poster URL
                </label>
                <input
                  type="text"
                  name="posterUrl"
                  value={formData.posterUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E23636] focus:bg-white focus:ring-4 focus:ring-[#E23636]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Trailer URL
                </label>
                <input
                  type="text"
                  name="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E23636] focus:bg-white focus:ring-4 focus:ring-[#E23636]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Streaming URL
                </label>
                <input
                  type="text"
                  name="streamingUrl"
                  value={formData.streamingUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E23636] focus:bg-white focus:ring-4 focus:ring-[#E23636]/10 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Visibility Settings — moved into the left column so nothing competes with the sticky preview */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center size-8 rounded-lg bg-[#F5C518]/15">
                <ListChecks className="size-4 text-[#F5C518]" />
              </div>
              <h2 className="font-bold text-gray-900">Visibility</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center justify-between gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Published
                  </p>
                  <p className="text-xs text-gray-400">Visible to users</p>
                </div>
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#E23636] transition-colors" />
                  <div className="absolute top-0.5 left-0.5 size-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                </div>
              </label>

              <label className="flex items-center justify-between gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Featured
                  </p>
                  <p className="text-xs text-gray-400">Highlight on homepage</p>
                </div>
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#F5C518] transition-colors" />
                  <div className="absolute top-0.5 left-0.5 size-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right column - ONLY the ticket preview. Nothing else shares this column. */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="flex items-center gap-2 mb-4">
            <Ticket className="size-4 text-[#F5C518]" />
            <h2 className="font-bold text-gray-900">Ticket Preview</h2>
          </div>

          <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Poster half */}
            <div className="relative w-full aspect-[3/2] bg-gray-100 overflow-hidden">
              {formData.posterUrl && !posterBroken ? (
                <img
                  key={formData.posterUrl}
                  src={formData.posterUrl}
                  alt="Poster preview"
                  className="w-full h-full object-cover"
                  onError={() => setPosterBroken(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                  <Film className="size-10" />
                  <span className="text-xs font-medium text-center px-4">
                    {formData.posterUrl
                      ? "Couldn't load this image"
                      : "Poster preview"}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

              {formData.access === "PREMIUM" && (
                <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-[#F5C518] text-black shadow-sm">
                  <Star className="size-2.5 fill-black" />
                  Premium
                </span>
              )}

              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="font-extrabold text-white text-lg leading-tight line-clamp-1 drop-shadow">
                  {formData.title || "Untitled title"}
                </h3>
              </div>
            </div>

            {/* Perforated divider */}
            <div className="relative h-0 border-t-2 border-dashed border-gray-200">
              <span className="absolute -left-3 -top-3 size-6 rounded-full bg-gray-50 border border-gray-200" />
              <span className="absolute -right-3 -top-3 size-6 rounded-full bg-gray-50 border border-gray-200" />
            </div>

            {/* Ticket stub info */}
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-semibold uppercase tracking-wide">
                  Format
                </span>
                <span className="font-bold text-gray-800">{formData.type}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-semibold uppercase tracking-wide">
                  Year
                </span>
                <span className="font-bold text-gray-800">
                  {formData.releaseYear || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-semibold uppercase tracking-wide">
                  Access
                </span>
                <span
                  className={`font-bold ${
                    formData.access === "PREMIUM"
                      ? "text-[#E23636]"
                      : "text-green-600"
                  }`}
                >
                  {formData.access}
                </span>
              </div>

              {formData.genreIds.length > 0 && (
                <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1.5">
                  {formData.genreIds.map((id) => {
                    const g = allGenres.find((x) => x.id === id);
                    return g ? (
                      <span
                        key={id}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                      >
                        {g.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddNewMedia;
