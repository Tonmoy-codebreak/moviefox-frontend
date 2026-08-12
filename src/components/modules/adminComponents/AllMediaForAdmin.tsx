"use client";

import { getAdminAllMedia } from "@/actions/adminAction/allMediaForAdmin.action";
import Link from "next/link"; // 👈 লিংকের জন্য ইমপোর্ট
import React, { useEffect, useState } from "react";

type MediaItem = {
  id: string | number;
  title: string;
  type?: string;
  posterUrl?: string;
  image?: string;
  slug?: string;
  genre?: string[] | string;
  tags?: string[] | string;
  createdAt?: string;
};

const AllMediaForAdmin = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchMedia = async () => {
    setLoading(true);
    const res = await getAdminAllMedia({
      page: "1",
      limit: "10",
      searchTerm,
      sortBy,
      sortOrder,
    });

    if (res.success) {
      let data = res.data;

      if (mediaType) {
        data = data.filter(
          (item: MediaItem) =>
            item.type?.toLowerCase() === mediaType.toLowerCase(),
        );
      }

      setMediaList(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMedia();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, mediaType, sortBy, sortOrder]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">All Media (Admin)</h1>

      {/* সার্চবার এবং ফিল্টার */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          >
            <option value="createdAt">Date Added</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-4 py-2 border rounded-lg text-sm bg-gray-50 hover:bg-gray-100 font-medium transition-colors cursor-pointer"
          >
            {sortOrder === "asc" ? "Ascending (↑)" : "Descending (↓)"}
          </button>
        </div>
      </div>

      {/* মিডিয়া লিস্ট */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading media...</div>
      ) : mediaList.length === 0 ? (
        <div className="text-center py-10 text-gray-400 bg-white border rounded-xl">
          No media found.
        </div>
      ) : (
        <div className="space-y-3">
          {mediaList.map((media: MediaItem) => {
            const imageSrc =
              media.posterUrl ||
              media.image ||
              "https://placehold.co/100x150?text=No+Image";

            const renderGenres = () => {
              if (
                !media.genre ||
                (Array.isArray(media.genre) && media.genre.length === 0) ||
                media.genre === ""
              ) {
                return <span className="text-gray-400">None</span>;
              }
              if (Array.isArray(media.genre)) {
                return media.genre.join(", ");
              }
              return media.genre;
            };

            return (
              /* 👈 লিংকের মাধ্যমে ডাইনামিক পেজে রিডাইরেক্ট করা হচ্ছে */
              <Link
                key={media.id}
                href={`/allmedia/${media.id}`}
                className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md hover:border-indigo-300 block"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={imageSrc}
                    alt={media.title}
                    className="w-14 h-20 object-cover rounded-lg border bg-gray-100 flex-shrink-0"
                  />

                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-800 text-base hover:text-indigo-600 transition-colors">
                      {media.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>
                        Type:{" "}
                        <strong className="uppercase text-indigo-600">
                          {media.type || "N/A"}
                        </strong>
                      </span>
                      {media.slug && (
                        <span>
                          • Slug:{" "}
                          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                            {media.slug}
                          </code>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-600">
                      <span className="font-medium text-gray-500">Genre: </span>
                      {renderGenres()}
                    </div>

                    {media.tags && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {Array.isArray(media.tags) ? (
                          media.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-medium"
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-medium">
                            #{media.tags}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium self-end sm:self-center">
                  {media.createdAt
                    ? new Date(media.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllMediaForAdmin;
