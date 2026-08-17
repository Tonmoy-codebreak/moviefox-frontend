import AddToCompleted from "@/components/modules/userComponents/AddToCompleted";
import AddToWatchlist from "@/components/modules/userComponents/AddToWatchlist";
import ShowAllReview from "@/components/modules/publicComponents/ShowAllReview";
import API from "@/lib/api";
import { notFound } from "next/navigation";
import WriteReview from "@/components/modules/userComponents/WriteReview";
import { cookies } from "next/headers";
import axios from "axios";
import {
  Play,
  ExternalLink,
  Star,
  Sparkles,
  CalendarDays,
  Clapperboard,
  Lock,
  Unlock,
  Users,
  MessageSquareText,
  Hash,
} from "lucide-react";

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
  let hasUserReviewed = false;
  let currentUserId: string | null = null;

  try {
    const response = await API.get(`/media/${id}`);
    media = response.data?.data || response.data;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

      const myReviewsRes = await axios
        .get(`${BASE_URL}/review/my-reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch(() => null);

      const userReviews = myReviewsRes?.data?.data || myReviewsRes?.data || [];

      if (userReviews.length > 0) {
        currentUserId =
          userReviews[0].userId || userReviews[0].user?.id || null;
      }

      hasUserReviewed = userReviews.some(
        (review: { mediaId?: string; media?: { id: string } }) =>
          review.mediaId === id || review.media?.id === id,
      );
    }
  } catch (error) {
    notFound();
  }

  if (!media) {
    notFound();
  }

  const addedDate = new Date(media.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#0B0F14]">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-[#252E3A]">
        {media.posterUrl && (
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src={media.posterUrl}
              alt=""
              className="w-full h-full object-cover scale-110 blur-3xl opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14]/60 via-[#0B0F14]/85 to-[#0B0F14]" />
          </div>
        )}

        <div className="relative container mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-end">
            {/* Poster */}
            <div className="w-40 sm:w-48 md:w-full mx-auto md:mx-0 aspect-[2/3] rounded-xl overflow-hidden border border-[#252E3A] bg-[#161D27] shadow-2xl shadow-black/40">
              {media.posterUrl ? (
                <img
                  src={media.posterUrl}
                  alt={media.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#6F7885] text-xs font-medium text-center px-3">
                  No poster available
                </div>
              )}
            </div>

            {/* Title & meta */}
            <div className="text-center md:text-left space-y-4">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#161D27] border border-[#252E3A] text-[#A7AFBA]">
                  <Clapperboard className="w-3 h-3" />
                  {media.type}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md border ${
                    media.access === "FREE"
                      ? "bg-[#161D27] border-[#252E3A] text-[#A7AFBA]"
                      : "bg-[#E5B84B]/10 border-[#E5B84B]/30 text-[#E5B84B]"
                  }`}
                >
                  {media.access === "FREE" ? (
                    <Unlock className="w-3 h-3" />
                  ) : (
                    <Lock className="w-3 h-3" />
                  )}
                  {media.access} access
                </span>
                {media.isFeatured && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md bg-[#E5B84B]/10 border border-[#E5B84B]/30 text-[#E5B84B]">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F5F5F2] tracking-tight text-balance">
                {media.title}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-5 gap-y-2 text-sm text-[#A7AFBA]">
                <span className="font-medium">{media.releaseYear}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-[#E5B84B] text-[#E5B84B]" />
                  <span className="text-[#F5F5F2] font-semibold">
                    {media.avgRating ? media.avgRating.toFixed(1) : "0.0"}
                  </span>
                  <span className="text-[#6F7885]">/ 5</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {media.ratingCount} ratings
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageSquareText className="w-4 h-4" />
                  {media.reviewCount} reviews
                </span>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 pt-1">
                {media.streamingUrl && (
                  <a
                    href={media.streamingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5B84B] hover:bg-[#F2C963] text-[#0B0F14] font-semibold rounded-lg transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Stream now
                  </a>
                )}
                {media.trailerUrl && (
                  <a
                    href={media.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[#3A4553] hover:bg-[#161D27] text-[#F5F5F2] font-medium rounded-lg transition-colors text-sm"
                  >
                    <Play className="w-4 h-4" />
                    Watch trailer
                  </a>
                )}
                <AddToWatchlist mediaId={media.id} />
                <AddToCompleted mediaId={media.id} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BODY ================= */}
      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
          {/* Main column: write + reviews */}
          <div className="space-y-8 min-w-0">
            <WriteReview mediaId={media.id} hasReviewed={hasUserReviewed} />
            <ShowAllReview mediaId={media.id} currentUserId={currentUserId} />
          </div>

          {/* Sidebar: quick facts, sticky on desktop */}
          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="p-5 rounded-xl bg-[#111720] border border-[#252E3A] space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-[#8D96A3]">
                Details
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#6F7885]">Type</dt>
                  <dd className="text-[#F5F5F2] font-medium">{media.type}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#6F7885]">Access</dt>
                  <dd className="text-[#F5F5F2] font-medium">{media.access}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#6F7885]">Release year</dt>
                  <dd className="text-[#F5F5F2] font-medium">
                    {media.releaseYear}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#252E3A]">
                  <dt className="inline-flex items-center gap-1.5 text-[#6F7885]">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Added
                  </dt>
                  <dd className="text-[#A7AFBA]">{addedDate}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="inline-flex items-center gap-1.5 text-[#6F7885]">
                    <Hash className="w-3.5 h-3.5" />
                    Slug
                  </dt>
                  <dd className="text-[#A7AFBA] truncate max-w-[140px]">
                    {media.slug}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
