"use client";

import React, { useState } from "react";
import { updateMediaInfoAction } from "@/actions/adminAction/editMediaInfo.action";
import { useRouter } from "next/navigation";

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

  // ইনিশিয়ালি মিডিয়ার সাথে যে জেনারগুলো যুক্ত আছে তাদের আইডিগুলো নেওয়া
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

  // জেনার সার্চ এবং ড্রপডাউন ওপেন/ক্লোজ স্টেট
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

  // জেনার যোগ করার ফাংশন
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

  // জেনার রিমুভ করার ফাংশন
  const handleRemoveGenre = (genreId: string) => {
    setFormData((prev) => ({
      ...prev,
      genreIds: prev.genreIds.filter((id) => id !== genreId),
    }));
  };

  // সার্চ কুয়েরি অনুযায়ী জেনার ফিল্টার করা (যেগুলো অলরেডি সিলেক্টেড সেগুলো বাদ দিয়ে)
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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 border rounded-2xl shadow-sm space-y-6"
    >
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3 bg-green-50 text-green-600 text-sm rounded-xl">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl text-sm focus:outline-indigo-600"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl text-sm focus:outline-indigo-600"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl text-sm focus:outline-indigo-600"
            placeholder="Write media description..."
          />
        </div>

        {/* --- আধুনিক জেনার সার্চ ও ট্যাগ সিস্টেম --- */}
        <div className="md:col-span-2 space-y-3 relative">
          <label className="block text-xs font-semibold uppercase text-gray-500">
            Genres
          </label>

          {/* সিলেক্টেড জেনার ট্যাগগুলো (পিলস উইথ ক্রস আইকন) */}
          <div className="flex flex-wrap gap-2 min-h-[42px] p-2 border rounded-xl bg-gray-50/50">
            {formData.genreIds.length === 0 ? (
              <span className="text-xs text-gray-400 self-center px-2">
                No genres selected yet. Search below to add.
              </span>
            ) : (
              formData.genreIds.map((id) => {
                const genreObj = allGenres.find((g) => g.id === id);
                if (!genreObj) return null;
                return (
                  <span
                    key={genreObj.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium rounded-lg shadow-2xs"
                  >
                    {genreObj.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(genreObj.id)}
                      className="text-indigo-500 hover:text-red-600 hover:bg-indigo-100 rounded-full p-0.5 transition-colors cursor-pointer"
                      title="Remove genre"
                    >
                      ✕
                    </button>
                  </span>
                );
              })
            )}
          </div>

          {/* জেনার সার্চ ইনপুট এবং অটো-সাজেশন ড্রপডাউন */}
          <div className="relative">
            <input
              type="text"
              placeholder="Type to search & add genres..."
              value={genreSearch}
              onChange={(e) => {
                setGenreSearch(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full p-3 border rounded-xl text-sm focus:outline-indigo-600 bg-white"
            />

            {/* সাজেশন ড্রপডাউন লিস্ট */}
            {isDropdownOpen && genreSearch.trim() !== "" && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredGenres.length === 0 ? (
                  <div className="p-3 text-xs text-gray-400 text-center">
                    No matching genres found.
                  </div>
                ) : (
                  filteredGenres.map((genre) => (
                    <div
                      key={genre.id}
                      onClick={() => handleAddGenre(genre.id)}
                      className="px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors border-b border-gray-50 last:border-none"
                    >
                      {genre.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        {/* ------------------------------------- */}

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Type
          </label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl text-sm focus:outline-indigo-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Access
          </label>
          <input
            type="text"
            name="access"
            value={formData.access}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl text-sm focus:outline-indigo-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Release Year
          </label>
          <input
            type="number"
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl text-sm focus:outline-indigo-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Poster URL
          </label>
          <input
            type="text"
            name="posterUrl"
            value={formData.posterUrl}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl text-sm focus:outline-indigo-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Trailer URL
          </label>
          <input
            type="text"
            name="trailerUrl"
            value={formData.trailerUrl}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl text-sm focus:outline-indigo-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
            Streaming URL
          </label>
          <input
            type="text"
            name="streamingUrl"
            value={formData.streamingUrl}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl text-sm focus:outline-indigo-600"
          />
        </div>
      </div>

      <div className="flex gap-6 pt-4 border-t">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="w-4 h-4 accent-indigo-600"
          />
          Is Published
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="w-4 h-4 accent-indigo-600"
          />
          Is Featured
        </label>
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

export default EditMediaInfo;
