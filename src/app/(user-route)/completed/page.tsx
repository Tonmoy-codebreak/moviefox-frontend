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
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="container mx-auto p-6 max-w-6xl space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-black rounded-2xl px-7 py-9">
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
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Trophy className="size-7 text-gray-300" />
            </div>
            <div className="space-y-1.5">
              <p className="text-gray-900 font-bold text-xl">
                No completed titles yet
              </p>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Finish watching something and it'll land here as part of your
                history.
              </p>
            </div>
            <Link
              href="/media"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-[#E23636] text-white font-semibold rounded-xl transition-colors text-sm"
            >
              <Compass className="size-4 text-[#F5C518]" />
              Explore media
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {completedList.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Completed corner ribbon */}
                <div className="absolute top-3 left-0 z-10 flex items-center gap-1 bg-[#F5C518] text-black text-[10px] font-bold uppercase tracking-wide pl-2.5 pr-3 py-1 rounded-r-full shadow-sm">
                  <CheckCircle2 className="size-3" />
                  Watched
                </div>

                <div>
                  <div className="relative w-full h-72 bg-gray-100 overflow-hidden">
                    {item.media.posterUrl ? (
                      <img
                        src={item.media.posterUrl}
                        alt={item.media.title}
                        className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-100 text-gray-300">
                        <Film className="size-8" />
                        <span className="text-xs font-medium">No poster</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {typeof item.media.avgRating === "number" && (
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/80 backdrop-blur px-2.5 py-1 shadow-sm">
                        <Star className="size-3 fill-[#F5C518] text-[#F5C518]" />
                        <span className="text-[11px] font-bold text-white">
                          {item.media.avgRating.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {item.media.type && (
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-white/90 text-black shadow-sm">
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
                <div className="p-4 pt-3 border-t border-gray-50 flex items-center gap-2">
                  <Link
                    href={`/media/${item.media.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-center border border-gray-200 hover:border-black hover:bg-black hover:text-white text-gray-700 font-semibold rounded-lg transition-colors text-sm"
                  >
                    Details
                    <ArrowRight className="size-3.5" />
                  </Link>
                  <div className="flex-1">
                    <RemoveFromCompleted mediaId={item.media.id} />
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
