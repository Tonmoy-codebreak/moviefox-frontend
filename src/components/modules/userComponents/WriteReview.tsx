"use client";

import React, { useState } from "react";

import { Loader2, Star, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createReview } from "@/actions/userAction/writeReview.action";

interface WriteReviewProps {
  mediaId: string;
  hasReviewed?: boolean;
}

const WriteReview = ({ mediaId, hasReviewed = false }: WriteReviewProps) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [content, setContent] = useState("");
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(hasReviewed);
  const router = useRouter();

  if (alreadyReviewed) {
    return (
      <div className="flex items-center gap-3 p-5 rounded-xl bg-[#111720] border border-[#252E3A]">
        <div className="flex items-center justify-center shrink-0 w-9 h-9 rounded-full bg-[#E5B84B]/10 border border-[#E5B84B]/30">
          <CheckCircle2 className="w-4 h-4 text-[#E5B84B]" />
        </div>
        <p className="text-sm text-[#C2C8D0] leading-relaxed">
          You&apos;ve already reviewed this title. Thanks for sharing your take.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await createReview({
      mediaId,
      rating,
      content,
      hasSpoiler,
    });

    if (res.success) {
      setAlreadyReviewed(true);
      router.refresh();
    } else {
      alert(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[#111720] border border-[#252E3A] space-y-5">
      <h3 className="text-base font-bold text-[#F5F5F2] tracking-tight">
        Write a review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating Stars */}
        <div>
          <span className="block text-xs font-semibold text-[#8D96A3] uppercase tracking-[0.06em] mb-2">
            Your rating
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none cursor-pointer p-0.5 -m-0.5"
                aria-label={`Rate ${star} out of 5`}
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    (hoverRating || rating) >= star
                      ? "fill-[#E5B84B] text-[#E5B84B]"
                      : "text-[#3A4553]"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-semibold text-[#F5F5F2] tabular-nums">
              {hoverRating || rating}
              <span className="text-[#6F7885] font-medium">/5</span>
            </span>
          </div>
        </div>

        {/* Review Content */}
        <div>
          <label
            htmlFor="review-content"
            className="block text-xs font-semibold text-[#8D96A3] uppercase tracking-[0.06em] mb-2"
          >
            Your review
          </label>
          <textarea
            id="review-content"
            rows={4}
            placeholder="Share your thoughts about this title…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3.5 bg-[#161D27] border border-[#252E3A] text-[#F5F5F2] placeholder:text-[#6F7885] rounded-lg text-sm leading-relaxed focus:outline-none focus:border-[#E5B84B] transition-colors resize-none"
          />
        </div>

        {/* Spoiler Checkbox */}
        <label
          htmlFor="spoiler"
          className="flex items-center gap-2.5 cursor-pointer select-none w-fit"
        >
          <input
            type="checkbox"
            id="spoiler"
            checked={hasSpoiler}
            onChange={(e) => setHasSpoiler(e.target.checked)}
            className="w-4 h-4 rounded bg-[#161D27] border-[#3A4553] text-[#E5B84B] focus:ring-1 focus:ring-[#E5B84B] focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-sm text-[#A7AFBA]">
            This review contains spoilers
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#E5B84B] hover:bg-[#F2C963] text-[#0B0F14] font-semibold rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Submit review</span>
        </button>
      </form>
    </div>
  );
};

export default WriteReview;
