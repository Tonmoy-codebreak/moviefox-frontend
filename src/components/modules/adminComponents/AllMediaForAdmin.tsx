"use client";

import { getAdminAllMedia } from "@/actions/adminAction/allMediaForAdmin.action";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Film,
  Clapperboard,
  Tag,
  Calendar,
  ImageOff,
  Loader2,
  Inbox,
} from "lucide-react";

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
    <div className="min-h-screen bg-[#0B0F14] p-6 md:p-10 space-y-8">
      {/* header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-[#F5F5F2]">
          All Media
        </h1>
        <p className="text-sm text-[#6F7885]">
          Manage and review every title in your library.
        </p>
      </div>

      {/* toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[#111720] border border-[#252E3A] rounded-xl p-4">
        {/* search */}
        <div className="relative w-full md:w-1/3">
          <Search
            size={16}
            strokeWidth={2}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F7885] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111720] border border-[#252E3A] rounded-lg text-sm text-[#F5F5F2] placeholder:text-[#6F7885] outline-none transition-colors focus:border-[#E5B84B] focus:shadow-[0_0_0_3px_rgba(229,184,75,0.12)]"
          />
        </div>

        {/* controls */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative">
            <Clapperboard
              size={15}
              strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F7885] pointer-events-none"
            />
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="appearance-none pl-8 pr-8 py-2.5 border border-[#252E3A] rounded-lg text-sm bg-[#111720] text-[#F5F5F2] outline-none transition-colors focus:border-[#E5B84B] cursor-pointer hover:bg-[#161D27]"
            >
              <option value="">All Types</option>
              <option value="movie">Movie</option>
              <option value="series">Series</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 border border-[#252E3A] rounded-lg text-sm bg-[#111720] text-[#F5F5F2] outline-none transition-colors focus:border-[#E5B84B] cursor-pointer hover:bg-[#161D27]"
            >
              <option value="createdAt">Date Added</option>
              <option value="title">Title</option>
            </select>
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#3A4553] rounded-lg text-sm text-[#F5F5F2] font-medium bg-transparent hover:bg-[#161D27] transition-colors cursor-pointer"
          >
            {sortOrder === "asc" ? (
              <ArrowUp size={15} strokeWidth={2} className="text-[#A7AFBA]" />
            ) : (
              <ArrowDown size={15} strokeWidth={2} className="text-[#A7AFBA]" />
            )}
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
      </div>

      {/* media list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-[#6F7885]">
          <Loader2
            size={22}
            strokeWidth={2}
            className="animate-spin text-[#E5B84B]"
          />
          <span className="text-sm">Loading media...</span>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 bg-[#111720] border border-[#252E3A] rounded-xl">
          <Inbox size={26} strokeWidth={1.5} className="text-[#6F7885]" />
          <span className="text-sm text-[#8D96A3]">No media found.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {mediaList.map((media: MediaItem) => {
            const imageSrc = media.posterUrl || media.image || "";

            const renderGenres = () => {
              if (
                !media.genre ||
                (Array.isArray(media.genre) && media.genre.length === 0) ||
                media.genre === ""
              ) {
                return <span className="text-[#6F7885]">None</span>;
              }
              if (Array.isArray(media.genre)) {
                return media.genre.join(", ");
              }
              return media.genre;
            };

            return (
              <Link
                key={media.id}
                href={`/allmedia/${media.id}`}
                className="group p-4 bg-[#161D27] border border-[#252E3A] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-200 hover:bg-[#1C2531] hover:border-[#3A4553]"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-20 rounded-lg border border-[#252E3A] bg-[#0B0F14] overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={media.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <ImageOff
                        size={18}
                        strokeWidth={1.5}
                        className="text-[#6F7885]"
                      />
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <h3 className="font-semibold text-[#F5F5F2] text-base transition-colors group-hover:text-[#F2C963] truncate">
                      {media.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#A7AFBA]">
                      <span className="inline-flex items-center gap-1.5">
                        <Film
                          size={12}
                          strokeWidth={2}
                          className="text-[#8D96A3]"
                        />
                        <strong className="uppercase tracking-wide text-[#E5B84B] font-semibold">
                          {media.type || "N/A"}
                        </strong>
                      </span>
                      {media.slug && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="text-[#6F7885]">•</span>
                          <code className="bg-[#1C2531] border border-[#252E3A] px-1.5 py-0.5 rounded text-[#A7AFBA] text-[11px]">
                            {media.slug}
                          </code>
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-[#A7AFBA]">
                      <Tag
                        size={12}
                        strokeWidth={2}
                        className="text-[#8D96A3] mt-0.5"
                      />
                      <span>
                        <span className="text-[#6F7885]">Genre: </span>
                        {renderGenres()}
                      </span>
                    </div>

                    {media.tags && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {Array.isArray(media.tags) ? (
                          media.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 bg-[#1C2531] text-[#B8C0CA] border border-[#303A47] rounded-full font-medium"
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 bg-[#1C2531] text-[#B8C0CA] border border-[#303A47] rounded-full font-medium">
                            #{media.tags}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 bg-[#1C2531] border border-[#252E3A] text-[#A7AFBA] rounded-full font-medium self-end sm:self-center whitespace-nowrap">
                  <Calendar
                    size={12}
                    strokeWidth={2}
                    className="text-[#6F7885]"
                  />
                  {media.createdAt
                    ? new Date(media.createdAt).toLocaleDateString()
                    : "—"}
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
