"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchMediaAction } from "@/actions/publicAction/mediaContainer.action";

interface Movie {
  id: string;
  title: string;
  slug: string;
  type: string;
  access: string;
  releaseYear: number;
  posterUrl?: string;
  avgRating: number;
  ratingCount: number;
  createdAt?: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface MediaContainerProps {
  initialMovies: Movie[];
  initialMeta: PaginationMeta;
  currentSearch: string;
  currentSortBy: string;
  currentSortOrder: string;
}

export default function MediaContainer({
  initialMovies,
  initialMeta,
  currentSearch,
  currentSortBy,
  currentSortOrder,
}: MediaContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [sortBy, setSortBy] = useState(currentSortBy);
  const [sortOrder, setSortOrder] = useState(currentSortOrder);

  // ইউআরএল বা প্যারামিটার পরিবর্তনের সাথে সাথে ডেটা ফেচ করার লজিক
  const loadMedia = async (
    search: string,
    sort: string,
    order: string,
    pageNum: string,
  ) => {
    startTransition(async () => {
      const res = await fetchMediaAction({
        searchTerm: search,
        sortBy: sort,
        sortOrder: order,
        page: pageNum,
      });

      if (res.success) {
        setMovies(res.data);
        setMeta(res.meta);
      }
    });
  };

  // সার্চ বারে টাইপ করার সময় ডিবাউন্স করে ডেটা আপডেট করা
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchTerm.trim()) {
        params.set("searchTerm", searchTerm.trim());
      } else {
        params.delete("searchTerm");
      }

      params.set("page", "1");
      router.push(`?${params.toString()}`, { scroll: false });
      loadMedia(searchTerm, sortBy, sortOrder, "1");
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);

    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSortBy);
    params.set("sortOrder", newSortOrder);
    params.set("page", "1");

    router.push(`?${params.toString()}`, { scroll: false });
    loadMedia(searchTerm, newSortBy, newSortOrder, "1");
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    router.push(`?${params.toString()}`, { scroll: false });
    loadMedia(searchTerm, sortBy, sortOrder, newPage.toString());
  };

  return (
    <div className="space-y-6">
      {/* Search and Sorting Control Section */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <input
          type="text"
          placeholder="Search media by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full md:max-w-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <div className="flex gap-3 w-full md:w-auto items-center">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value, sortOrder)}
            className="border border-gray-300 px-3 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="releaseYear">Sort by Release Year</option>
            <option value="avgRating">Sort by Rating</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => handleSortChange(sortBy, e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Loading State Overlay */}
      {isPending && (
        <div className="text-center py-4 text-sm text-blue-600 font-medium animate-pulse">
          Loading media...
        </div>
      )}

      {/* Media Card Grid Section */}
      {movies.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg">
            No media found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/media/${movie.id}`}
              className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              {/* Poster & Badges Area */}
              <div className="relative w-full h-72 bg-gray-100 overflow-hidden">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-medium">
                    No Poster
                  </div>
                )}

                {/* Top Badges: Access & Type */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase">
                    {movie.type}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase ${
                      movie.access === "FREE"
                        ? "bg-green-600 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {movie.access}
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-yellow-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  ⭐ {movie.avgRating ? movie.avgRating.toFixed(1) : "0.0"}
                </div>
              </div>

              {/* Details Area */}
              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                    <span>{movie.releaseYear}</span>
                    <span>({movie.ratingCount} reviews)</span>
                  </div>
                  <h2 className="font-bold text-lg text-gray-800 line-clamp-1">
                    {movie.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Section */}
      {meta.totalPages > 1 && (
        <div className="flex gap-4 items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-6">
          <button
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={meta.page === 1 || isPending}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-gray-700">
            Page <span className="font-bold text-blue-600">{meta.page}</span> of{" "}
            {meta.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(meta.page + 1)}
            disabled={meta.page === meta.totalPages || isPending}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
