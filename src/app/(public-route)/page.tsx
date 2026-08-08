"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/lib/api";

// Interface Section---------------------
interface MediaItem {
  id: string;
  title: string;
  poster?: string;
  releaseYear?: number;
  genre?: string;
  createdAt: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function HomePage() {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  // Axios (API) call
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const response = await API.get("/media", {
          params: {
            page,
            limit: 10,
            sortBy,
            sortOrder,
            ...(searchTerm && { searchTerm }),
          },
        });

        const result = response.data;
        setMovies(result.data || []);
        if (result.meta) {
          setMeta(result.meta);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchMovies();
    }, 300);

    return () => clearTimeout(timer);
  }, [page, searchTerm, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Banner */}
      <div className="w-full bg-red-600 py-12 mb-8 shadow-lg">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-white tracking-wider">
          Welcome to Moviefox
        </h1>
        <p className="text-center text-white/90 mt-2 text-base">
          Explore your favorite movies, watchlists, and latest releases.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* সার্চ এবং সোর্টিং কন্ট্রোল প্যানেল */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-card p-4 rounded-lg border border-border shadow-sm">
          {/* সার্চ ইনপুট */}
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search movies by title..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* সোর্টিং ড্রপডাউন */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-sm text-muted-foreground">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="createdAt">Latest Added</option>
              <option value="title">Title (A-Z)</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* লোডিং এবং এরর হ্যান্ডলিং */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <p className="text-lg text-muted-foreground animate-pulse">
              Loading movies...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md text-center">
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <p className="text-center text-muted-foreground py-10">
            No movies found.
          </p>
        )}

        {/* মুভি গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="border border-border rounded-lg overflow-hidden shadow-md bg-card hover:shadow-xl transition duration-300 flex flex-col"
            >
              <div className="w-full h-56 bg-muted flex items-center justify-center text-muted-foreground font-medium">
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>No Poster</span>
                )}
              </div>

              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <h3
                    className="font-bold text-lg truncate"
                    title={movie.title}
                  >
                    {movie.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Added: {new Date(movie.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <Link
                  href={`/mediadetails?id=${movie.id}`}
                  className="mt-4 block text-center bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-95 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* পেজিনেশন কন্ট্রোলস */}
        {!loading && meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm font-medium">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, meta.totalPages))
              }
              disabled={page === meta.totalPages}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
