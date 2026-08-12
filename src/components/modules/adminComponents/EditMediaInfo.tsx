"use client";

import React, { useState } from "react";
import { updateMediaInfoAction } from "@/actions/adminAction/editMediaInfo.action";
import { useRouter } from "next/navigation";

type Media = {
  id: string | number;
  title?: string;
  slug?: string;
  type?: string;
  access?: string;
  releaseYear?: number | string | null;
  posterUrl?: string;
  trailerUrl?: string;
  streamingUrl?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
};

type Props = {
  media: Media;
};

const EditMediaInfo = ({ media }: Props) => {
  const router = useRouter();
  const mediaId = String(media.id);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    title: media.title || "",
    slug: media.slug || "",
    type: media.type || "",
    access: media.access || "",
    releaseYear: media.releaseYear || "",
    posterUrl: media.posterUrl || "",
    trailerUrl: media.trailerUrl || "",
    streamingUrl: media.streamingUrl || "",
    isPublished: media.isPublished ?? false,
    isFeatured: media.isFeatured ?? false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

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
