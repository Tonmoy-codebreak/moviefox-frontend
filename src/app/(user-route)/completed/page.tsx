import RemoveFromCompleted from "@/components/modules/userComponents/RemoveFromCompleted";
import { getWithAuth } from "@/lib/api-server";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  Trophy,
  Film,
  Calendar,
  Star,
  ArrowRight,
  Compass,
  RotateCcw,
} from "lucide-react";

interface CompletedMediaItem {
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

export default async function CompletedPage() {
  let completedList: CompletedMediaItem[] = [];

  try {
    const result = await getWithAuth("/completedmedia/my-list");
    completedList = result?.data || [];
  } catch (error) {
    console.error("Completed media fetch error:", error);
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto p-6 max-w-6xl space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-2xl px-7 py-9">
          {/* Decorative glows */}
          <div className="absolute -top-14 right-10 w-52 h-52 bg-[#F5C518]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-44 h-44 bg-[#E23636]/10 rounded-full blur-3xl" />
          {/* Faint trophy watermark */}
          <Trophy className="absolute -right-6 -bottom-6 size-40 text-white/[0.03] rotate-12" />

          <div className="relative flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#F5C518]/10 border border-[#F5C518]/30 text-[#F5C518] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <Trophy className="size-3" />
                Your achievements
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Completed Media
              </h1>
              <div className="h-[3px] w-10 bg-[#E23636] rounded-full mt-3 mb-3" />
              <p className="text-white/50 text-sm max-w-md">
                Everything you&apos;ve finished watching, tracked and celebrated
                in one place.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                <div className="flex items-center justify-center size-10 rounded-xl bg-[#F5C518]/15">
                  <CheckCircle2 className="size-5 text-[#F5C518]" />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-white leading-none">
                    {completedList.length}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-white/40">
                    Titles finished
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {completedList.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.03] border border-white/10 rounded-2xl space-y-5">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center">
              <Trophy className="size-7 text-white/25" />
            </div>
            <div className="space-y-1.5">
              <p className="text-white font-bold text-xl">
                No completed titles yet
              </p>
              <p className="text-white/40 text-sm max-w-xs mx-auto">
                Finish watching something and it&apos;ll land here as part of
                your history.
              </p>
            </div>
            <Link
              href="/media"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E23636] hover:bg-[#c92c2c] text-white font-semibold rounded-xl transition-colors text-sm"
            >
              <Compass className="size-4 text-[#F5C518]" />
              Explore media
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <>
            <p className="flex items-center gap-1.5 text-xs text-white/30 -mt-2">
              <RotateCcw className="size-3" />
              Tap or hover a title to flip it and see details
            </p>

            {/* Flip-card wall — pure CSS 3D flip, no JS, no event handlers */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {completedList.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-[2/3] [perspective:1200px]"
                >
                  <input
                    type="checkbox"
                    id={`flip-${item.id}`}
                    className="peer sr-only"
                  />

                  <div className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-700 ease-out peer-checked:[transform:rotateY(180deg)] md:group-hover:[transform:rotateY(180deg)]">
                    {/* FRONT — poster face. Entirely a label so tapping (mobile) flips it. */}
                    <label
                      htmlFor={`flip-${item.id}`}
                      className="absolute inset-0 block rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] cursor-pointer [backface-visibility:hidden]"
                    >
                      {item.media.posterUrl ? (
                        <img
                          src={item.media.posterUrl}
                          alt={item.media.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/20">
                          <Film className="size-8" />
                          <span className="text-xs font-medium">No poster</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                      {/* Watched stamp */}
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#F5C518] text-black text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm">
                        <CheckCircle2 className="size-3" />
                        Watched
                      </div>

                      {typeof item.media.avgRating === "number" && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur px-2 py-1">
                          <Star className="size-3 fill-[#F5C518] text-[#F5C518]" />
                          <span className="text-[10px] font-bold text-white">
                            {item.media.avgRating.toFixed(1)}
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3">
                        <h2 className="font-bold text-white text-sm line-clamp-2 leading-snug drop-shadow">
                          {item.media.title}
                        </h2>
                        <span className="flex items-center gap-1 text-[11px] text-white/60 mt-1">
                          <Calendar className="size-2.5" />
                          {item.media.releaseYear}
                        </span>
                      </div>
                    </label>

                    {/* BACK — details face. NOT a label, so buttons/links inside work normally. */}
                    <div className="absolute inset-0 rounded-2xl border border-[#F5C518]/30 bg-[#0d0d0d] p-4 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center justify-center size-9 rounded-xl bg-[#F5C518]/15">
                            <Trophy className="size-4 text-[#F5C518]" />
                          </div>
                          {/* Small dedicated flip-back control (mobile) */}
                          <label
                            htmlFor={`flip-${item.id}`}
                            className="p-1.5 -m-1.5 rounded-full text-white/30 hover:text-white hover:bg-white/10 cursor-pointer transition-colors md:hidden"
                            title="Flip back"
                          >
                            <RotateCcw className="size-3.5" />
                          </label>
                        </div>
                        <h3 className="font-bold text-white text-sm leading-snug line-clamp-3">
                          {item.media.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-white/10 text-white/70">
                            {item.media.type}
                          </span>
                          <span className="text-[11px] text-white/40">
                            {item.media.releaseYear}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <Link
                          href={`/media/${item.media.id}`}
                          className="inline-flex items-center justify-center gap-1.5 py-2 text-center border border-white/15 hover:border-white/30 hover:bg-white/10 text-white/80 hover:text-white font-semibold rounded-lg transition-colors text-xs"
                        >
                          Details
                          <ArrowRight className="size-3" />
                        </Link>
                        <RemoveFromCompleted mediaId={item.media.id} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
