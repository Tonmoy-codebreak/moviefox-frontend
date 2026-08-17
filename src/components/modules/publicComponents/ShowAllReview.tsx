"use client";

import { useEffect, useState } from "react";
import { fetchReviewsByMediaAction } from "@/actions/publicAction/showAllReview.action";
import {
  Star,
  User,
  CalendarDays,
  MessageSquareText,
  Loader2,
  AlertCircle,
  EyeOff,
  Eye,
  Sparkles,
} from "lucide-react";

interface ReviewUser {
  id: string;
  name: string;
}

interface Review {
  id: string;
  rating: number;
  content: string;
  hasSpoiler?: boolean;
  createdAt: string;
  user: ReviewUser;
  userId?: string;
}

interface ShowAllReviewProps {
  mediaId: string;

  currentUserId?: string | null;
}

export default function ShowAllReview({
  mediaId,
  currentUserId,
}: ShowAllReviewProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [unblurredSpoilers, setUnblurredSpoilers] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);

      const response = await fetchReviewsByMediaAction(mediaId);

      if (response.success) {
        const allReviews: Review[] = response.data;

        if (currentUserId) {
          const sortedReviews = [...allReviews].sort((a, b) => {
            const aIsMine =
              a.userId === currentUserId || a.user?.id === currentUserId;
            const bIsMine =
              b.userId === currentUserId || b.user?.id === currentUserId;

            if (aIsMine) return -1;
            if (bIsMine) return 1;
            return 0;
          });
          setReviews(sortedReviews);
        } else {
          setReviews(allReviews);
        }
      } else {
        setError(response.message || "Failed to load reviews");
      }
      setLoading(false);
    };

    if (mediaId) {
      loadReviews();
    }
  }, [mediaId, currentUserId]);

  const toggleSpoiler = (id: string) => {
    setUnblurredSpoilers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2.5 py-14">
        <Loader2 className="w-4 h-4 animate-spin text-[#E5B84B]" />
        <span className="text-sm text-[#6F7885] tracking-wide">
          Loading reviews…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 px-4 rounded-xl bg-[#111720] border border-[#252E3A]">
        <AlertCircle className="w-4 h-4 text-[#E2685C]" />
        <span className="text-sm text-[#E2685C]">{error}</span>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 text-center py-14 px-6 bg-[#111720] rounded-xl border border-[#252E3A]">
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#161D27] border border-[#252E3A]">
          <MessageSquareText className="w-5 h-5 text-[#6F7885]" />
        </div>
        <div className="space-y-1">
          <p className="text-[#F5F5F2] text-sm font-semibold">No reviews yet</p>
          <p className="text-[#8D96A3] text-xs">
            Be the first to share your take on this title.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between pb-4 border-b border-[#252E3A]">
        <h3 className="flex items-baseline gap-2.5 text-lg font-bold text-[#F5F5F2] tracking-tight">
          <MessageSquareText className="w-4.5 h-4.5 text-[#A7AFBA] relative top-[1px]" />
          Reviews
        </h3>
        <span className="text-xs font-medium text-[#6F7885] tabular-nums">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      <div className="grid gap-3.5">
        {reviews.map((review) => {
          const isSpoilerRevealed = unblurredSpoilers[review.id] || false;

          const isMyReview =
            currentUserId &&
            (review.userId === currentUserId ||
              review.user?.id === currentUserId);

          return (
            <div
              key={review.id}
              className={`relative p-5 sm:p-6 rounded-xl transition-colors duration-200 space-y-4 ${
                isMyReview
                  ? "bg-[#111720] border border-[#E5B84B]/40"
                  : "bg-[#111720] border border-[#252E3A] hover:border-[#3A4553]"
              }`}
            >
              {isMyReview && (
                <span className="absolute left-0 top-5 bottom-5 w-[2px] bg-[#E5B84B] rounded-full" />
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex items-center justify-center shrink-0 w-9 h-9 rounded-full ${
                      isMyReview
                        ? "bg-[#E5B84B]/10 text-[#E5B84B] border border-[#E5B84B]/30"
                        : "bg-[#161D27] text-[#8D96A3] border border-[#252E3A]"
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-[#F5F5F2] text-sm truncate">
                      {review.user?.name || "Anonymous User"}
                    </span>
                    {isMyReview && (
                      <span className="inline-flex items-center gap-1 text-[#E5B84B] text-[10px] font-bold tracking-[0.08em] uppercase mt-0.5">
                        <Sparkles className="w-3 h-3" />
                        Your review
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 text-xs font-bold text-[#F5F5F2]">
                  <Star className="w-3.5 h-3.5 fill-[#E5B84B] text-[#E5B84B]" />
                  {review.rating}
                  <span className="text-[#6F7885] font-medium">/5</span>
                </div>
              </div>

              {/* Review Content & Spoiler Handling */}
              <div className="relative">
                {review.hasSpoiler && !isSpoilerRevealed ? (
                  <div className="py-5 rounded-lg bg-[#161D27] border border-[#252E3A] flex flex-col items-center justify-center gap-2.5 text-center">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#8D96A3]">
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>This review contains spoilers</span>
                    </div>
                    <button
                      onClick={() => toggleSpoiler(review.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-transparent border border-[#3A4553] hover:border-[#E5B84B]/50 hover:bg-[#1C2531] text-[#F5F5F2] text-xs font-medium rounded-md transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Reveal spoiler
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {review.hasSpoiler && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.06em] px-2 py-0.5 bg-[#161D27] text-[#8D96A3] border border-[#252E3A] rounded">
                          Spoiler revealed
                        </span>
                        <button
                          onClick={() => toggleSpoiler(review.id)}
                          className="text-xs text-[#6F7885] hover:text-[#F5F5F2] underline underline-offset-2 cursor-pointer transition-colors"
                        >
                          Hide again
                        </button>
                      </div>
                    )}
                    <p className="text-[#C2C8D0] text-sm leading-relaxed">
                      {review.content}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 pt-3.5 border-t border-[#252E3A] text-xs text-[#6F7885]">
                <CalendarDays className="w-3.5 h-3.5" />
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
