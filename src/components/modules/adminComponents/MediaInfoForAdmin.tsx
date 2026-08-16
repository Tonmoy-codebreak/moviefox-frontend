"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getSingleMediaForAdmin,
  getReviewsByMediaIdForAdmin,
  deleteReviewForAdmin,
} from "@/actions/adminAction/mediaInfoForAdmin.action";
import { Trash2, Loader2, Star } from "lucide-react";

type Genre = {
  id: string;
  name: string;
  slug: string;
};

type ReviewUser = {
  id: string;
  name: string;
};

type Review = {
  id: string;
  rating: number;
  content?: string;
  review?: string;
  createdAt?: string | Date;
  user?: ReviewUser;
};

type Media = {
  id: string | number;
  title?: string;
  slug?: string;
  description?: string;
  type?: string;
  access?: string;
  releaseYear?: number | string | null;
  posterUrl?: string;
  trailerUrl?: string;
  streamingUrl?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  avgRating?: number;
  ratingCount?: number;
  reviewCount?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date | null;
  genres?: { genre: Genre }[];
};

type Props = {
  id: string;
};

const MediaInfoForAdmin = ({ id }: Props) => {
  const [media, setMedia] = useState<Media | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // মিডিয়া এবং রিভিউ ফেচ করা
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const mediaRes = await getSingleMediaForAdmin(id);

      if (!mediaRes.success || !mediaRes.data) {
        setErrorMsg(mediaRes.message || "Failed to load media details");
        setLoading(false);
        return;
      }

      setMedia(mediaRes.data);

      // রিভিউ ফেচ করা (/review/media/:mediaId)
      const reviewsRes = await getReviewsByMediaIdForAdmin(id);
      if (reviewsRes.success) {
        setReviews(reviewsRes.data);
      }

      setLoading(false);
    }

    fetchData();
  }, [id]);

  // রিভিউ ডিলিট হ্যান্ডলার
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    setDeletingId(reviewId);

    // সার্ভার অ্যাকশনের মাধ্যমে সিকিউরড ডিলিট রিকোয়েস্ট
    const res = await deleteReviewForAdmin(reviewId);

    if (res.success) {
      setReviews((prev) => prev.filter((rev) => rev.id !== reviewId));
    } else {
      alert(res.message || "Failed to delete review");
    }

    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (errorMsg || !media) {
    return (
      <div className="p-6 text-red-500 bg-red-50 border border-red-200 rounded-xl max-w-5xl mx-auto mt-6">
        Failed to load media: {errorMsg}
      </div>
    );
  }

  const imageSrc =
    media.posterUrl || "https://placehold.co/300x450?text=No+Poster";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Header with Edit Button */}
      <div className="flex justify-between items-center bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              {media.type || "N/A"}
            </span>
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
              {media.access || "N/A"}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            {media.title}
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Slug:{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
              {media.slug || "N/A"}
            </code>
          </p>

          {/* জেনার ট্যাগ সেকশন */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {media.genres && media.genres.length > 0 ? (
              media.genres.map(({ genre }) => (
                <span
                  key={genre.id}
                  className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md border"
                >
                  {genre.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">No genres assigned</span>
            )}
          </div>
        </div>

        <Link
          href={`/allmedia/${media.id}/edit`}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          ✏️ Edit Media
        </Link>
      </div>

      {/* Poster & Main Info Section */}
      <div className="flex flex-col md:flex-row gap-6 bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
        <div className="w-full md:w-1/3 flex-shrink-0">
          <img
            src={imageSrc}
            alt={media.title || "Media Poster"}
            className="w-full h-80 object-cover rounded-xl border bg-gray-100 shadow-sm"
          />
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-sm">
            <div>
              <span className="text-gray-400 block text-xs">Release Year</span>
              <span className="font-semibold text-gray-700">
                {media.releaseYear || "N/A"}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block text-xs">Is Published</span>
              <span
                className={`font-semibold ${media.isPublished ? "text-green-600" : "text-amber-600"}`}
              >
                {String(media.isPublished ?? "N/A")}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block text-xs">Is Featured</span>
              <span className="font-semibold text-gray-700">
                {String(media.isFeatured ?? "N/A")}
              </span>
            </div>
            <div className="col-span-full">
              <span className="text-gray-400 block text-xs">Description</span>
              <span className="font-normal text-gray-700 mt-1 block">
                {String(media.description ?? "N/A")}
              </span>
            </div>
          </div>

          {/* rating review count */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t text-center">
            <div className="bg-gray-50 p-3 rounded-xl border">
              <span className="text-gray-400 block text-xs">Avg Rating</span>
              <span className="font-bold text-lg text-indigo-600">
                {media.avgRating ?? 0} ⭐
              </span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border">
              <span className="text-gray-400 block text-xs">Rating Count</span>
              <span className="font-bold text-lg text-gray-800">
                {media.ratingCount ?? 0}
              </span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border">
              <span className="text-gray-400 block text-xs">Review Count</span>
              <span className="font-bold text-lg text-gray-800">
                {reviews.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section with Hover Delete Button */}
      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Reviews ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No reviews found for this media.
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => {
              const isDeleting = deletingId === review.id;
              return (
                <div
                  key={review.id}
                  className="group relative p-4 bg-gray-50/50 border border-gray-200 rounded-xl transition-all hover:bg-gray-50 hover:shadow-sm"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-semibold text-sm text-gray-800">
                        {review.user?.name || "Anonymous User"}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-amber-600 mt-0.5 font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{review.rating} / 5</span>
                      </div>
                    </div>

                    <span className="text-xs text-gray-400">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mt-2 bg-white p-3 rounded-lg border border-gray-100">
                    {review.content || review.review || "No text provided."}
                  </p>

                  {/* Hover Delete Button */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={isDeleting}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium shadow transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete Review"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* url section */}
      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Streaming & Links
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 border rounded-xl">
            <span className="text-gray-400 block text-xs font-semibold uppercase">
              Trailer URL
            </span>
            {media.trailerUrl ? (
              <a
                href={media.trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline break-all text-xs font-medium"
              >
                {media.trailerUrl}
              </a>
            ) : (
              <span className="text-gray-400 text-xs">Not Available</span>
            )}
          </div>

          <div className="p-3 bg-gray-50 border rounded-xl">
            <span className="text-gray-400 block text-xs font-semibold uppercase">
              Streaming URL
            </span>
            {media.streamingUrl ? (
              <a
                href={media.streamingUrl}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline break-all text-xs font-medium"
              >
                {media.streamingUrl}
              </a>
            ) : (
              <span className="text-gray-400 text-xs">Not Available</span>
            )}
          </div>
        </div>
      </div>

      {/* Extra media info */}
      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Extra Media Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400 block text-xs">Media ID</span>
            <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded block mt-1">
              {media.id}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-xs">Created At</span>
            <span className="font-medium text-gray-700 block mt-1">
              {media.createdAt
                ? new Date(media.createdAt).toLocaleString()
                : "N/A"}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-xs">Updated At</span>
            <span className="font-medium text-gray-700 block mt-1">
              {media.updatedAt
                ? new Date(media.updatedAt).toLocaleString()
                : "N/A"}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-xs">Deleted At</span>
            <span className="font-medium text-red-500 block mt-1">
              {media.deletedAt
                ? new Date(media.deletedAt).toLocaleString()
                : "Active (Null)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaInfoForAdmin;
