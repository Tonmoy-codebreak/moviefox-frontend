"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Movie {
  id: string;
  title: string;
  description?: string;
  poster?: string;
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
  meta: PaginationMeta;
  currentSearch: string;
  currentSortBy: string;
  currentSortOrder: string;
}

export default function MediaContainer({
  initialMovies,
  meta,
  currentSearch,
  currentSortBy,
  currentSortOrder,
}: MediaContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [sortBy, setSortBy] = useState(currentSortBy);
  const [sortOrder, setSortOrder] = useState(currentSortOrder);

  const movies = initialMovies;

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchTerm.trim()) {
        params.set("searchTerm", searchTerm.trim());
      } else {
        params.delete("searchTerm");
      }

      params.set("page", "1");
      router.push(`?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, router, searchParams]);

  //   Sorting option
  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);

    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSortBy);
    params.set("sortOrder", newSortOrder);
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  // Pagination handler
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
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

      {/* Movie Poster Card Grid Section */}
      {movies.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg">
            No media found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-medium">
                    No Poster
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <h2 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                    {movie.title}
                  </h2>
                  <p className="text-gray-600 text-xs line-clamp-2">
                    {movie.description ||
                      "No description available for this media item."}
                  </p>
                </div>

                {movie.createdAt && (
                  <span className="text-[11px] text-gray-400 mt-4 block">
                    Added:{" "}
                    {new Date(movie.createdAt).toISOString().split("T")[0]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Section */}
      {meta.totalPages > 1 && (
        <div className="flex gap-4 items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-6">
          <button
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={meta.page === 1}
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
            disabled={meta.page === meta.totalPages}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
