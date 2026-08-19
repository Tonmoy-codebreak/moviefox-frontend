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
    <main className="min-h-screen">
      <div className="container mx-auto p-6 max-w-6xl space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-black rounded-2xl px-7 py-9">
          {/* Decorative accent */}
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
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 space-y-5">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Bookmark className="size-7 text-gray-400" />
            </div>
            <div className="space-y-1.5">
              <p className="text-gray-900 font-bold text-xl">
                Your watchlist is empty
              </p>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Save titles you&apos;re excited about and they&apos;ll show up
                right here, ready when you are.
              </p>
            </div>
            <Link
              href="/media"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-[#E23636] text-white font-semibold rounded-lg transition-colors text-sm"
            >
              <Sparkles className="size-4 text-[#F5C518]" />
              Explore media
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map((item) => (
              <div
                key={item.id}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#E23636]/40 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <div className="relative w-full h-72 bg-gray-100 overflow-hidden">
                    {item.media.posterUrl ? (
                      <img
                        src={item.media.posterUrl}
                        alt={item.media.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-100 text-gray-300">
                        <Film className="size-8" />
                        <span className="text-xs font-medium">No poster</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {typeof item.media.avgRating === "number" && (
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/80 backdrop-blur px-2.5 py-1 shadow-sm">
                        <Star className="size-3 fill-[#F5C518] text-[#F5C518]" />
                        <span className="text-[11px] font-bold text-white">
                          {item.media.avgRating.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {item.media.type && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-white/90 text-black shadow-sm">
                        {item.media.type}
                      </span>
                    )}
                  </div>

                  <div className="p-4 pb-2">
                    <h2 className="font-bold text-base text-gray-900 line-clamp-1">
                      {item.media.title}
                    </h2>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5">
                      <Calendar className="size-3" />
                      {item.media.releaseYear}
                    </span>
                  </div>
                </div>

                {/* Action Buttons Footer */}
                <div className="p-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                  <Link
                    href={`/media/${item.media.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-center border border-gray-200 hover:border-black hover:bg-black hover:text-white text-gray-700 font-semibold rounded-lg transition-colors text-sm"
                  >
                    More
                    <ArrowRight className="size-3.5" />
                  </Link>
                  <div className="flex-1">
                    <RemoveFromWatchlist mediaId={item.media.id} />
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
