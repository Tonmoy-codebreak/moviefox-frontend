"use client";

import { useEffect, useState } from "react";
import { fetchReviewsByMediaAction } from "@/actions/showAllReview.action";

interface ReviewUser {
  id: string;
  name: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
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
      <div className="text-center py-6 text-gray-500">Loading reviews...</div>
    );
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-xl border border-gray-100 shadow-sm">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Reviews ({reviews.length})
      </h3>
      <div className="grid gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">
                {review.user?.name || "Anonymous User"}
              </span>
              <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                ⭐ {review.rating} / 5
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {review.comment}
            </p>
            <span className="text-xs text-gray-400 block pt-1">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
