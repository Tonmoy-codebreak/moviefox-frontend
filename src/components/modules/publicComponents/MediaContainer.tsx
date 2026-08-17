"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchMediaAction } from "@/actions/publicAction/mediaContainer.action";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Loader2,
  Lock,
  Unlock,
  SearchX,
} from "lucide-react";

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

  // সার্চ বারে টাইপ করার সময় ডিবাউন্স করে ডেটা আপডেট করা
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

  // পেজিনেশন বাটনে কোন পেজ নম্বরগুলো দেখানো হবে তা ঠিক করার জন্য (শুধুই ইউআই রেন্ডারিং, কোনো ফেচ/লজিক নেই)
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const { page, totalPages } = meta;
    const window = 1;

    for (let p = 1; p <= totalPages; p++) {
      if (
        p === 1 ||
        p === totalPages ||
        (p >= page - window && p <= page + window)
      ) {
        pages.push(p);
      } else if (pages[pages.length - 1] !== "ellipsis") {
        pages.push("ellipsis");
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Search and Sorting Control Section */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-between items-stretch md:items-center bg-[#111720] p-4 rounded-xl border border-[#252E3A]">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F7885] pointer-events-none" />
          <input
            type="text"
            placeholder="Search titles…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161D27] border border-[#252E3A] pl-10 pr-4 py-2.5 rounded-lg text-sm text-[#F5F5F2] placeholder:text-[#6F7885] focus:outline-none focus:border-[#E5B84B] transition-colors"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value, sortOrder)}
              className="w-full appearance-none bg-[#161D27] border border-[#252E3A] pl-3.5 pr-9 py-2.5 rounded-lg text-sm text-[#F5F5F2] focus:outline-none focus:border-[#E5B84B] transition-colors cursor-pointer"
            >
              <option value="createdAt">Date added</option>
              <option value="title">Title</option>
              <option value="releaseYear">Release year</option>
              <option value="avgRating">Rating</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6F7885] pointer-events-none" />
          </div>

          <div className="relative flex-1 md:flex-none">
            <select
              value={sortOrder}
              onChange={(e) => handleSortChange(sortBy, e.target.value)}
              className="w-full appearance-none bg-[#161D27] border border-[#252E3A] pl-3.5 pr-9 py-2.5 rounded-lg text-sm text-[#F5F5F2] focus:outline-none focus:border-[#E5B84B] transition-colors cursor-pointer"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6F7885] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Loading State Overlay */}
      {isPending && (
        <div className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#8D96A3]">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E5B84B]" />
          Updating results…
        </div>
      )}

      {/* Media Card Grid Section */}
      {movies.length === 0 ? (
        <div className="flex flex-col items-center gap-3 text-center py-20 bg-[#111720] rounded-xl border border-[#252E3A]">
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#161D27] border border-[#252E3A]">
            <SearchX className="w-5 h-5 text-[#6F7885]" />
          </div>
          <div className="space-y-1">
            <p className="text-[#F5F5F2] text-sm font-semibold">
              No titles found
            </p>
            <p className="text-[#8D96A3] text-xs">
              Try a different search term or filter.
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 transition-opacity duration-200 ${
            isPending ? "opacity-50" : "opacity-100"
          }`}
        >
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/media/${movie.id}`}
              className="group flex flex-col rounded-xl overflow-hidden bg-[#161D27] border border-[#252E3A] hover:border-[#3A4553] transition-colors"
            >
              {/* Poster & Badges Area */}
              <div className="relative w-full aspect-[2/3] bg-[#111720] overflow-hidden">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#6F7885] text-xs font-medium text-center px-3">
                    No poster available
                  </div>
                )}

                {/* Bottom gradient for legibility */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                {/* Top Badges: Type & Access */}
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.06em] px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[#F5F5F2] border border-white/10">
                    {movie.type}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.06em] px-2 py-1 rounded-md border ${
                      movie.access === "FREE"
                        ? "bg-black/60 backdrop-blur-sm text-[#F5F5F2] border-white/10"
                        : "bg-[#E5B84B]/90 backdrop-blur-sm text-[#0B0F14] border-transparent"
                    }`}
                  >
                    {movie.access === "FREE" ? (
                      <Unlock className="w-2.5 h-2.5" />
                    ) : (
                      <Lock className="w-2.5 h-2.5" />
                    )}
                    {movie.access}
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 text-xs font-bold text-[#F5F5F2]">
                  <Star className="w-3.5 h-3.5 fill-[#E5B84B] text-[#E5B84B]" />
                  {movie.avgRating ? movie.avgRating.toFixed(1) : "0.0"}
                </div>
              </div>

              {/* Details Area */}
              <div className="p-3.5 space-y-1">
                <h2 className="font-semibold text-sm text-[#F5F5F2] group-hover:text-[#F2C963] transition-colors line-clamp-1">
                  {movie.title}
                </h2>
                <div className="flex justify-between items-center text-xs text-[#6F7885]">
                  <span>{movie.releaseYear}</span>
                  <span>{movie.ratingCount} reviews</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Section */}
      {meta.totalPages > 1 && (
        <div className="flex gap-1.5 items-center justify-center bg-[#111720] p-3 rounded-xl border border-[#252E3A] mt-6">
          <button
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={meta.page === 1 || isPending}
            className="inline-flex items-center justify-center w-9 h-9 text-[#A7AFBA] hover:text-[#F5F5F2] hover:bg-[#161D27] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {getPageNumbers().map((p, idx) =>
            p === "ellipsis" ? (
              <span
                key={`ellipsis-${idx}`}
                className="w-9 h-9 flex items-center justify-center text-[#6F7885] text-sm"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                disabled={isPending}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold transition-colors disabled:cursor-not-allowed ${
                  p === meta.page
                    ? "bg-[#E5B84B] text-[#0B0F14]"
                    : "text-[#A7AFBA] hover:text-[#F5F5F2] hover:bg-[#161D27]"
                }`}
              >
                {p}
              </button>
            ),
          )}

          <button
            onClick={() => handlePageChange(meta.page + 1)}
            disabled={meta.page === meta.totalPages || isPending}
            className="inline-flex items-center justify-center w-9 h-9 text-[#A7AFBA] hover:text-[#F5F5F2] hover:bg-[#161D27] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
