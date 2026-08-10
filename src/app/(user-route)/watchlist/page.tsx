import { getWithAuth } from "@/lib/api-server";
import Link from "next/link";
import { redirect } from "next/navigation";
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

const RIFT = ["#E23636", "#1687E8", "#FFD447", "#6C3FC5", "#F2298A"];

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
    <main className="min-h-screen bg-[#111111]">
      <div className="halftone-bg pointer-events-none fixed inset-0 opacity-[0.05]" />

      <div className="relative container mx-auto p-6 max-w-6xl space-y-6">
        <div className="relative bg-[#1a1a1a] p-6 rounded-2xl border-2 border-black shadow-[5px_5px_0_0_#1687E8] flex justify-between items-center overflow-hidden">
          <div className="rift-seam absolute inset-x-0 top-0 h-[3px]" />
          <div>
            <h1 className="rift-text text-3xl font-extrabold tracking-tight">
              My Watchlist
            </h1>
            <p className="text-[#F5F1E8]/50 text-sm mt-1">
              Manage your saved watchlist.
            </p>
          </div>
          <div className="comic-chip">Total Saved: {watchlist.length}</div>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-20 bg-[#1a1a1a] rounded-2xl border-2 border-black shadow-[5px_5px_0_0_#F2298A] space-y-4">
            <p className="text-[#F5F1E8]/60 text-lg">
              Your watchlist is currently empty.
            </p>
            <Link
              href="/media"
              className="comic-btn comic-btn--pink inline-block"
            >
              Explore media
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map((item, index) => {
              const accent = RIFT[index % RIFT.length];
              return (
                <div
                  key={item.id}
                  style={{ ["--card-shadow" as string]: accent }}
                  className="watchlist-card group bg-[#1a1a1a] border-2 border-black rounded-xl overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1"
                >
                  <div>
                    <div className="relative w-full h-72 bg-[#0d0d0d] overflow-hidden">
                      {item.media.posterUrl ? (
                        <img
                          src={item.media.posterUrl}
                          alt={item.media.title}
                          className="w-full h-full object-cover grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#151515] text-[#F5F1E8]/30 text-sm">
                          No poster
                        </div>
                      )}
                      <div className="halftone-card pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                      {typeof item.media.avgRating === "number" && (
                        <div
                          className="absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black text-[11px] font-extrabold text-[#111111]"
                          style={{ backgroundColor: "#FFD447" }}
                        >
                          {item.media.avgRating.toFixed(1)}
                        </div>
                      )}

                      {item.media.type && (
                        <span
                          className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border-2 border-black text-[#111111]"
                          style={{ backgroundColor: accent }}
                        >
                          {item.media.type}
                        </span>
                      )}
                    </div>

                    <div className="p-4 pb-2">
                      <h2 className="font-bold text-lg text-[#F5F1E8] line-clamp-1">
                        {item.media.title}
                      </h2>
                      <span className="text-xs text-[#F5F1E8]/40">
                        {item.media.releaseYear}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="p-4 pt-2 border-t border-white/10 flex items-center gap-2">
                    <Link
                      href={`/media/${item.media.id}`}
                      className="comic-btn comic-btn--outline flex-1 text-center"
                    >
                      More
                    </Link>
                    <div className="flex-1">
                      <RemoveFromWatchlist mediaId={item.media.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .rift-seam {
          background: linear-gradient(90deg, #E23636, #FFD447, #1687E8, #6C3FC5, #F2298A, #E23636);
          background-size: 200% 100%;
          animation: riftShift 8s linear infinite;
        }
        .rift-text {
          background: linear-gradient(90deg, #E23636, #F2298A, #6C3FC5, #1687E8, #FFD447);
          background-size: 250% auto;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: riftShift 6s ease-in-out infinite;
        }
        @keyframes riftShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .halftone-bg {
          background-image: radial-gradient(rgba(245, 241, 232, 0.9) 1px, transparent 1px);
          background-size: 16px 16px;
        }
        .halftone-card {
          background-image: radial-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 1px);
          background-size: 8px 8px;
        }
        .comic-chip {
          background: #FFD447;
          color: #111111;
          font-weight: 800;
          font-size: 13px;
          padding: 8px 16px;
          border-radius: 10px;
          border: 2px solid #111111;
          box-shadow: 3px 3px 0 0 #E23636;
        }
        .watchlist-card {
          box-shadow: 4px 4px 0 0 var(--card-shadow, #1687E8);
        }
        .watchlist-card:hover {
          box-shadow: 6px 6px 0 0 var(--card-shadow, #1687E8);
        }
        .comic-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.04em;
          padding: 8px 14px;
          border-radius: 8px;
          border: 2px solid #111111;
          box-shadow: 3px 3px 0 0 var(--comic-shadow, #1687E8);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          text-decoration: none;
        }
        .comic-btn:hover {
          transform: translate(-1px, -1px);
          box-shadow: 4px 4px 0 0 var(--comic-shadow, #1687E8);
        }
        .comic-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 0 var(--comic-shadow, #1687E8);
        }
        .comic-btn--pink {
          background: #F2298A;
          color: #F5F1E8;
          --comic-shadow: #6C3FC5;
        }
        .comic-btn--outline {
          background: #F5F1E8;
          color: #111111;
          --comic-shadow: #E23636;
        }
      `}</style>
    </main>
  );
}
