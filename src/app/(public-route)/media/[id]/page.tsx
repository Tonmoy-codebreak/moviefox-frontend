import API from "@/lib/api";
import { notFound } from "next/navigation";

interface MediaItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  access: string;
  releaseYear: number;
  posterUrl?: string;
  trailerUrl?: string;
  streamingUrl?: string;
  avgRating: number;
  ratingCount: number;
  reviewCount: number;
  isFeatured: boolean;
  createdAt: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MediaDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let media: MediaItem | null = null;

  try {
    const response = await API.get(`/media/${id}`);
    media = response.data?.data || response.data;
  } catch (error) {
    notFound();
  }

  if (!media) {
    notFound();
  }

  return (
    <main className="container mx-auto p-6 max-w-5xl">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8 space-y-8">
        {/* Top Section: Poster & Core Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="relative w-full h-[400px] bg-gray-100 rounded-xl overflow-hidden shadow-md">
            {media.posterUrl ? (
              <img
                src={media.posterUrl}
                alt={media.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-medium">
                No Poster Available
              </div>
            )}
          </div>

          {/* Details & Metadata */}
          <div className="md:col-span-2 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                  {media.type}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${media.access === "FREE" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {media.access} Access
                </span>
                {media.isFeatured && (
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                {media.title}
              </h1>
              <p className="text-gray-500 font-medium text-lg">
                Release Year:{" "}
                <span className="text-gray-800">{media.releaseYear}</span>
              </p>
            </div>

            {/* Ratings Summary Box */}
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center gap-6">
              <div>
                <div className="text-3xl font-black text-gray-900 flex items-center gap-1">
                  ⭐ {media.avgRating.toFixed(1)}{" "}
                  <span className="text-sm font-normal text-gray-400">/ 5</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {media.ratingCount} Ratings • {media.reviewCount} Reviews
                </div>
              </div>
            </div>

            {/* Action Links (Trailer & Streaming) */}
            <div className="flex flex-wrap gap-4 pt-2">
              {media.trailerUrl && (
                <a
                  href={media.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors text-sm shadow-sm"
                >
                  Watch Trailer 🎬
                </a>
              )}
              {media.streamingUrl && (
                <a
                  href={media.streamingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm shadow-sm"
                >
                  Stream Now 🚀
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="border-t pt-4 flex justify-between items-center text-xs text-gray-400">
          <span>Slug: {media.slug}</span>
          <span>
            Added on: {new Date(media.createdAt).toISOString().split("T")[0]}
          </span>
        </div>
      </div>
    </main>
  );
}
