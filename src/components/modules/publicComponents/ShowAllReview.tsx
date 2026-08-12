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
} from "lucide-react";

interface ReviewUser {
  id: string;
  name: string;
}

interface Review {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  user: ReviewUser;
}

interface ShowAllReviewProps {
  mediaId: string;
}

export default function ShowAllReview({ mediaId }: ShowAllReviewProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      const response = await fetchReviewsByMediaAction(mediaId);
      if (response.success) {
        setReviews(response.data);
      } else {
        setError(response.message || "Failed to load reviews");
      }
      setLoading(false);
    };

    if (mediaId) {
      loadReviews();
    }
  }, [mediaId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-red-500">
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 text-center py-10 bg-white rounded-xl border border-gray-100 shadow-sm">
        <MessageSquareText className="w-8 h-8 text-gray-300" />
        <p className="text-gray-500 text-sm">
          No reviews yet. Be the first to review!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
        <MessageSquareText className="w-5 h-5 text-gray-700" />
        Reviews
        <span className="text-sm font-medium text-gray-400">
          ({reviews.length})
        </span>
      </h3>

      <div className="grid gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-semibold text-gray-800 text-sm">
                  {review.user?.name || "Anonymous User"}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                {review.rating} / 5
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              {review.content}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1 border-t border-gray-50">
              <CalendarDays className="w-3.5 h-3.5" />
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
