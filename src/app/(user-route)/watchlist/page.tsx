import { getWithAuth } from "@/lib/api-server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark, Star, Calendar, ArrowRight, Film } from "lucide-react";
import RemoveFromWatchlist from "@/components/RemoveFromWatchlist";

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
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="container mx-auto p-6 max-w-6xl space-y-8">
        {/* Header */}
        <div className="bg-black rounded-2xl px-7 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              My Watchlist
            </h1>
            <div className="h-[3px] w-10 bg-[#E23636] rounded-full mt-3 mb-3" />
            <p className="text-white/50 text-sm">
              Manage your saved watchlist.
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-3xl font-bold text-[#F5C518]">
              {watchlist.length}
            </span>
            <span className="text-xs uppercase tracking-wide text-white/40">
              Saved titles
            </span>
          </div>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 space-y-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
              <Bookmark className="size-6 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-gray-900 font-semibold text-lg">
                Your watchlist is empty
              </p>
              <p className="text-gray-500 text-sm">
                Titles you save will show up here.
              </p>
            </div>
            <Link
              href="/media"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-[#E23636] text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Explore media
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map((item) => (
              <div
                key={item.id}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div>
                  <div className="relative w-full h-72 bg-gray-100 overflow-hidden">
                    {item.media.posterUrl ? (
                      <img
                        src={item.media.posterUrl}
                        alt={item.media.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-100 text-gray-300">
                        <Film className="size-8" />
                        <span className="text-xs font-medium">No poster</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {typeof item.media.avgRating === "number" && (
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/80 backdrop-blur px-2 py-1">
                        <Star className="size-3 fill-[#F5C518] text-[#F5C518]" />
                        <span className="text-[11px] font-bold text-white">
                          {item.media.avgRating.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {item.media.type && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-white/90 text-black">
                        {item.media.type}
                      </span>
                    )}
                  </div>

                  <div className="p-4 pb-2">
                    <h2 className="font-bold text-base text-gray-900 line-clamp-1">
                      {item.media.title}
                    </h2>
                    <span className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Calendar className="size-3" />
                      {item.media.releaseYear}
                    </span>
                  </div>
                </div>

                {/* Action Buttons Footer */}
                <div className="p-4 pt-2 border-t border-gray-100 flex items-center gap-2">
                  <Link
                    href={`/media/${item.media.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-center border border-gray-200 hover:border-black hover:bg-black hover:text-white text-gray-700 font-semibold rounded-lg transition-colors text-sm"
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
