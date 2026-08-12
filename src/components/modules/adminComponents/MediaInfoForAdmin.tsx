import React from "react";
import Link from "next/link";
import { getSingleMediaForAdmin } from "@/actions/adminAction/mediaInfoForAdmin.action";

type Props = {
  id: string;
};

const MediaInfoForAdmin = async ({ id }: Props) => {
  const res = await getSingleMediaForAdmin(id);

  if (!res.success || !res.data) {
    return (
      <div className="p-6 text-red-500 bg-red-50 border border-red-200 rounded-xl">
        Failed to load media: {res.message}
      </div>
    );
  }

  const media = res.data;
  const imageSrc =
    media.posterUrl || "https://placehold.co/300x450?text=No+Poster";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Header with Edit Button */}
      <div className="flex justify-between items-center bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
            {media.type || "N/A"}
          </span>
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full ml-2">
            {media.access || "N/A"}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            {media.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Slug:{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
              {media.slug || "N/A"}
            </code>
          </p>
        </div>

        <Link
          href={`/allmedia/${media.id}/edit`}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          ✏️ Edit Media
        </Link>
      </div>

      {/* Poster & Main Info Section */}
      <div className="flex flex-col md:flex-row gap-6 bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
        <div className="w-full md:w-1/3 flex-shrink-0">
          <img
            src={imageSrc}
            alt={media.title || "Media Poster"}
            className="w-full h-80 object-cover rounded-xl border bg-gray-100 shadow-sm"
          />
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-sm">
            <div>
              <span className="text-gray-400 block text-xs">Release Year</span>
              <span className="font-semibold text-gray-700">
                {media.releaseYear || "N/A"}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block text-xs">Is Published</span>
              <span
                className={`font-semibold ${media.isPublished ? "text-green-600" : "text-amber-600"}`}
              >
                {String(media.isPublished ?? "N/A")}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block text-xs">Is Featured</span>
              <span className="font-semibold text-gray-700">
                {String(media.isFeatured ?? "N/A")}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs">Description</span>
              <span className="font-semibold text-gray-700">
                {String(media.description ?? "N/A")}
              </span>
            </div>
          </div>

          {/* rating review count */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t text-center">
            <div className="bg-gray-50 p-3 rounded-xl border">
              <span className="text-gray-400 block text-xs">Avg Rating</span>
              <span className="font-bold text-lg text-indigo-600">
                {media.avgRating ?? 0} ⭐
              </span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border">
              <span className="text-gray-400 block text-xs">Rating Count</span>
              <span className="font-bold text-lg text-gray-800">
                {media.ratingCount ?? 0}
              </span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border">
              <span className="text-gray-400 block text-xs">Review Count</span>
              <span className="font-bold text-lg text-gray-800">
                {media.reviewCount ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* url section */}
      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Streaming & Links
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 border rounded-xl">
            <span className="text-gray-400 block text-xs font-semibold uppercase">
              Trailer URL
            </span>
            {media.trailerUrl ? (
              <a
                href={media.trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline break-all text-xs font-medium"
              >
                {media.trailerUrl}
              </a>
            ) : (
              <span className="text-gray-400 text-xs">Not Available</span>
            )}
          </div>

          <div className="p-3 bg-gray-50 border rounded-xl">
            <span className="text-gray-400 block text-xs font-semibold uppercase">
              Streaming URL
            </span>
            {media.streamingUrl ? (
              <a
                href={media.streamingUrl}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline break-all text-xs font-medium"
              >
                {media.streamingUrl}
              </a>
            ) : (
              <span className="text-gray-400 text-xs">Not Available</span>
            )}
          </div>
        </div>
      </div>

      {/* Extra media info */}
      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Extra Media Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400 block text-xs">Media ID</span>
            <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded block mt-1">
              {media.id}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-xs">Created At</span>
            <span className="font-medium text-gray-700 block mt-1">
              {media.createdAt
                ? new Date(media.createdAt).toLocaleString()
                : "N/A"}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-xs">Updated At</span>
            <span className="font-medium text-gray-700 block mt-1">
              {media.updatedAt
                ? new Date(media.updatedAt).toLocaleString()
                : "N/A"}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-xs">Deleted At</span>
            <span className="font-medium text-red-500 block mt-1">
              {media.deletedAt
                ? new Date(media.deletedAt).toLocaleString()
                : "Active (Null)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaInfoForAdmin;
