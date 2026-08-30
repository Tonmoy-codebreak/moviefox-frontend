import { getWithAuth } from "@/lib/api-server";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bookmark,
  Star,
  Calendar,
  ArrowRight,
  Film,
  Sparkles,
  ChevronDown,
  PlayCircle,
} from "lucide-react";
import RemoveFromWatchlist from "@/components/modules/userComponents/RemoveFromWatchlist";

interface WatchlistItem {
  id: string;
  media: {
    id: string;
    title: string;
    slug: string;
    type: string;
    access: string;
    releaseYear: number;
    posterUrl?: string;
    avgRating: number;
  };
  createdAt: string;
}

export default async function WatchlistPage() {
  let watchlist: WatchlistItem[] = [];

  try {
    const result = await getWithAuth("/watchlist/my-watchlist");
    watchlist = result?.data || [];
  } catch (error) {
    console.error("Watchlist fetch error:", error);
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto p-6 max-w-5xl space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-2xl px-7 py-9">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E23636]/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-[#F5C518]/5 rounded-full blur-3xl" />

          <div className="relative flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#E23636]/10 border border-[#E23636]/30 text-[#E23636] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <Bookmark className="size-3" />
                Your collection
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                My Watchlist
              </h1>
              <div className="h-[3px] w-10 bg-[#E23636] rounded-full mt-3 mb-3" />
              <p className="text-white/50 text-sm max-w-md">
                Everything you&apos;ve saved to watch later, all in one place.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-4 min-w-[100px]">
                <span className="text-3xl font-bold text-[#F5C518] leading-none">
                  {watchlist.length}
                </span>
                <span className="text-[11px] uppercase tracking-wide text-white/40 mt-1.5">
                  Saved title{watchlist.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.03] border border-white/10 rounded-2xl space-y-5">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center">
              <Bookmark className="size-7 text-white/30" />
            </div>
            <div className="space-y-1.5">
              <p className="text-white font-bold text-xl">
                Your watchlist is empty
              </p>
              <p className="text-white/40 text-sm max-w-xs mx-auto">
                Save titles you&apos;re excited about and they&apos;ll show up
                right here, ready when you are.
              </p>
            </div>
            <Link
              href="/media"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E23636] hover:bg-[#c92c2c] text-white font-semibold rounded-lg transition-colors text-sm"
            >
              <Sparkles className="size-4 text-[#F5C518]" />
              Explore media
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          /* Ranked list — CSS-only expand/collapse per row, no JS needed */
          <div className="space-y-3">
            {watchlist.map((item, index) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-[#F5C518]/30 transition-colors"
              >
                {/* Giant ghost rank number */}
                <span className="pointer-events-none select-none absolute -left-2 top-1/2 -translate-y-1/2 text-[6rem] sm:text-[7rem] font-black leading-none text-white/[0.04] italic">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <input
                  type="checkbox"
                  id={`expand-${item.id}`}
                  className="peer sr-only"
                />

                <label
                  htmlFor={`expand-${item.id}`}
                  className="relative z-10 flex items-center gap-4 sm:gap-5 p-3 sm:p-4 cursor-pointer select-none"
                >
                  {/* Poster thumbnail */}
                  <div className="relative w-16 h-24 sm:w-20 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-white/5 shadow-lg">
                    {item.media.posterUrl ? (
                      <img
                        src={item.media.posterUrl}
                        alt={item.media.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <Film className="size-6" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayCircle className="size-6 text-white/90" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-white text-base sm:text-lg line-clamp-1 group-hover:text-[#F5C518] transition-colors">
                      {item.media.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-white/40">
                        <Calendar className="size-3" />
                        {item.media.releaseYear}
                      </span>
                      {item.media.type && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-white/10 text-white/70">
                          {item.media.type}
                        </span>
                      )}
                      {typeof item.media.avgRating === "number" && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-white/70">
                          <Star className="size-3 fill-[#F5C518] text-[#F5C518]" />
                          {item.media.avgRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expand chevron */}
                  <ChevronDown className="size-5 text-white/30 flex-shrink-0 transition-transform duration-300 peer-checked:rotate-180 group-hover:text-white/60" />
                </label>

                {/* Smoothly expanding action panel — CSS grid-rows trick, no JS */}
                <div className="relative z-10 grid grid-rows-[0fr] peer-checked:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                  <div className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 px-4 sm:px-5 pb-4 pt-1 border-t border-white/10 mx-3 sm:mx-4">
                      <Link
                        href={`/media/${item.media.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-center border border-white/15 hover:border-white/30 hover:bg-white/10 text-white/80 hover:text-white font-semibold rounded-lg transition-colors text-sm"
                      >
                        More details
                        <ArrowRight className="size-3.5" />
                      </Link>
                      <div className="flex-1">
                        <RemoveFromWatchlist mediaId={item.media.id} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
