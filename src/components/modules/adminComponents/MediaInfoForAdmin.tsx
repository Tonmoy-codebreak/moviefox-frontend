"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  getSingleMediaForAdmin,
  getReviewsByMediaIdForAdmin,
  deleteReviewForAdmin,
} from "@/actions/adminAction/mediaInfoForAdmin.action";
import {
  Trash2,
  Loader2,
  Star,
  Pencil,
  ImageOff,
  PlayCircle,
  Link2,
  Hash,
  CalendarPlus,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Sparkles,
  MessageSquareText,
  AlertTriangle,
  LayoutGrid,
  Info,
  ArrowLeft,
  Users,
  Trash,
  MoreVertical,
} from "lucide-react";

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
  /** Optional slot rendered inside the "more options" menu in the hero, next to Edit (e.g. a DeleteMedia action). */
  headerActions?: React.ReactNode;
};

type TabKey = "overview" | "reviews" | "links";

const MediaInfoForAdmin = ({ id, headerActions }: Props) => {
  const [media, setMedia] = useState<Media | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // more-options মেনুর বাইরে ক্লিক করলে বন্ধ হবে
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

    // সার্ভার অ্যাকশনের মাধ্যমে সিকিউরড ডিলিট রিকোয়েস্ট
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
      <div className="min-h-screen bg-[#0B0F14] flex flex-col justify-center items-center gap-3 py-32">
        <Loader2 className="w-7 h-7 animate-spin text-[#E5B84B]" />
        <span className="text-sm text-[#6F7885]">Loading media details...</span>
      </div>
    );
  }

  if (errorMsg || !media) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex justify-center pt-16 px-6">
        <div className="flex items-start gap-3 p-5 text-[#E26D6D] bg-[#161D27] border border-[#3A2A2A] rounded-xl max-w-2xl w-full">
          <AlertTriangle
            size={18}
            strokeWidth={2}
            className="mt-0.5 flex-shrink-0"
          />
          <span className="text-sm">Failed to load media: {errorMsg}</span>
        </div>
      </div>
    );
  }

  const tabs: {
    key: TabKey;
    label: string;
    icon: React.ElementType;
    count?: number;
  }[] = [
    { key: "overview", label: "Overview", icon: Info },
    {
      key: "reviews",
      label: "Reviews",
      icon: MessageSquareText,
      count: reviews.length,
    },
    { key: "links", label: "Links & Meta", icon: Link2 },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F14]">
      {/* ===== Hero / masthead ===== */}
      <div className="relative border-b border-[#1D2530] overflow-hidden">
        <div className="absolute inset-0">
          {media.posterUrl ? (
            <img
              src={media.posterUrl}
              alt=""
              className="w-full h-full object-cover opacity-[0.12] blur-sm scale-110"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14] via-[#0B0F14]/95 to-[#0B0F14]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 md:px-8 pt-8 pb-10">
          <Link
            href="/allmedia"
            className="inline-flex items-center gap-1.5 text-xs text-[#8D96A3] hover:text-[#E5B84B] transition-colors mb-6"
          >
            <ArrowLeft size={13} strokeWidth={2} />
            Back to all media
          </Link>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-36 md:w-28 md:h-40 flex-shrink-0 rounded-xl border border-[#252E3A] overflow-hidden bg-[#161D27] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] hidden sm:block">
              {media.posterUrl ? (
                <img
                  src={media.posterUrl}
                  alt={media.title || "Poster"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff
                    size={20}
                    strokeWidth={1.5}
                    className="text-[#6F7885]"
                  />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[11px] uppercase font-semibold tracking-wider px-3 py-1 bg-[#1C2531] text-[#E5B84B] border border-[#303A47] rounded-full">
                  {media.type || "N/A"}
                </span>
                <span className="text-[11px] uppercase font-semibold tracking-wider px-3 py-1 bg-[#1C2531] text-[#B8C0CA] border border-[#303A47] rounded-full">
                  {media.access || "N/A"}
                </span>
                {media.isFeatured && (
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase font-semibold tracking-wider px-3 py-1 bg-[rgba(229,184,75,0.08)] text-[#E5B84B] border border-[rgba(229,184,75,0.35)] rounded-full">
                    <Sparkles size={11} strokeWidth={2} />
                    Featured
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 text-[11px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full border ${
                    media.isPublished
                      ? "bg-[rgba(98,198,138,0.08)] text-[#62C68A] border-[rgba(98,198,138,0.3)]"
                      : "bg-[rgba(217,164,65,0.08)] text-[#D9A441] border-[rgba(217,164,65,0.3)]"
                  }`}
                >
                  {media.isPublished ? (
                    <CheckCircle2 size={11} strokeWidth={2} />
                  ) : (
                    <XCircle size={11} strokeWidth={2} />
                  )}
                  {media.isPublished ? "Published" : "Unpublished"}
                </span>
              </div>

              <h1 className="text-2xl md:text-[32px] font-semibold text-[#F5F5F2] tracking-tight leading-tight">
                {media.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-[#A7AFBA]">
                <span>{media.releaseYear || "N/A"}</span>
                <span className="text-[#3A4553]">•</span>
                <code className="text-xs text-[#8D96A3]">
                  {media.slug || "N/A"}
                </code>
                <span className="text-[#3A4553]">•</span>
                <span className="inline-flex items-center gap-1">
                  <Star
                    size={13}
                    strokeWidth={2}
                    className="fill-[#E5B84B] text-[#E5B84B]"
                  />
                  <span className="text-[#F5F5F2] font-medium">
                    {media.avgRating ?? 0}
                  </span>
                  <span className="text-[#6F7885]">
                    ({media.ratingCount ?? 0})
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {media.genres && media.genres.length > 0 ? (
                  media.genres.map(({ genre }) => (
                    <span
                      key={genre.id}
                      className="text-xs font-medium px-2.5 py-1 bg-[#1C2531] text-[#B8C0CA] rounded-md border border-[#303A47]"
                    >
                      {genre.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#6F7885]">
                    No genres assigned
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <Link
                href={`/allmedia/${media.id}/edit`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5B84B] hover:bg-[#F2C963] text-[#0B0F14] rounded-lg text-sm font-semibold transition-colors flex-1 sm:flex-none justify-center"
              >
                <Pencil size={15} strokeWidth={2.5} />
                Edit
              </Link>

              {headerActions && (
                <div className="relative flex-shrink-0" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="More options"
                    aria-expanded={menuOpen}
                    className={`h-[42px] w-[42px] flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                      menuOpen
                        ? "bg-[#161D27] border-[#3A4553] text-[#F5F5F2]"
                        : "bg-transparent border-[#3A4553] text-[#A7AFBA] hover:bg-[#161D27] hover:text-[#F5F5F2]"
                    }`}
                  >
                    <MoreVertical size={17} strokeWidth={2} />
                  </button>

                  {menuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-[calc(100%+8px)] w-56 bg-[#161D27] border border-[#252E3A] rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] p-1.5 z-20"
                    >
                      <div className="px-3 py-2">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#6F7885]">
                          Danger zone
                        </span>
                      </div>
                      <div
                        onClick={() => setMenuOpen(false)}
                        className="px-1.5 pb-1.5 [&_button]:w-full [&_button]:!justify-start [&_button]:!bg-transparent [&_button]:hover:!bg-[rgba(226,109,109,0.08)] [&_button]:!text-[#E26D6D] [&_button]:!rounded-lg [&_button]:!px-2.5 [&_button]:!py-2 [&_button]:!text-sm [&_button]:!font-medium [&_button]:!shadow-none [&_button]:!border-none"
                      >
                        {headerActions}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Tab navigation ===== */}
      <div className="sticky top-0 z-10 bg-[#0B0F14]/95 backdrop-blur border-b border-[#1D2530]">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="flex items-center gap-6 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex items-center gap-2 py-4 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? "text-[#F5F5F2]"
                      : "text-[#8D96A3] hover:text-[#F5F5F2]"
                  }`}
                >
                  <Icon
                    size={15}
                    strokeWidth={2}
                    className={isActive ? "text-[#E5B84B]" : ""}
                  />
                  {tab.label}
                  {typeof tab.count === "number" && (
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-[rgba(229,184,75,0.12)] text-[#E5B84B]"
                          : "bg-[#1C2531] text-[#6F7885]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#E5B84B] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/*
        ===== Content =====
        One fixed-width, single-column frame shared by every tab so switching
        only swaps what's inside the panel — the page shape itself never jumps.
      */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="bg-[#111720] border border-[#252E3A] rounded-2xl p-6">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8D96A3] mb-3">
                Synopsis
              </h2>
              <p className="text-[#B8C0CA] leading-relaxed text-[15px]">
                {media.description || "No description provided."}
              </p>
            </div>

            <div className="bg-[#111720] border border-[#252E3A] rounded-2xl p-6">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8D96A3] mb-4 flex items-center gap-1.5">
                <LayoutGrid size={13} strokeWidth={2} />
                Snapshot
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#161D27] border border-[#252E3A] rounded-xl p-3.5">
                  <span className="text-[#6F7885] block text-xs mb-1">
                    Avg rating
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#F5F5F2]">
                    <Star
                      size={13}
                      strokeWidth={2}
                      className="fill-[#E5B84B] text-[#E5B84B]"
                    />
                    {media.avgRating ?? 0}
                  </span>
                </div>
                <div className="bg-[#161D27] border border-[#252E3A] rounded-xl p-3.5">
                  <span className="text-[#6F7885] block text-xs mb-1">
                    Rating count
                  </span>
                  <span className="font-semibold text-[#F5F5F2]">
                    {media.ratingCount ?? 0}
                  </span>
                </div>
                <div className="bg-[#161D27] border border-[#252E3A] rounded-xl p-3.5">
                  <span className="text-[#6F7885] block text-xs mb-1">
                    Review count
                  </span>
                  <span className="font-semibold text-[#F5F5F2]">
                    {reviews.length}
                  </span>
                </div>
                <div className="bg-[#161D27] border border-[#252E3A] rounded-xl p-3.5">
                  <span className="text-[#6F7885] block text-xs mb-1">
                    Published
                  </span>
                  <span
                    className={`font-semibold ${
                      media.isPublished ? "text-[#62C68A]" : "text-[#D9A441]"
                    }`}
                  >
                    {String(media.isPublished ?? "N/A")}
                  </span>
                </div>
                <div className="bg-[#161D27] border border-[#252E3A] rounded-xl p-3.5">
                  <span className="text-[#6F7885] block text-xs mb-1">
                    Featured
                  </span>
                  <span className="font-semibold text-[#F5F5F2]">
                    {String(media.isFeatured ?? "N/A")}
                  </span>
                </div>
                <div className="bg-[#161D27] border border-[#252E3A] rounded-xl p-3.5">
                  <span className="text-[#6F7885] block text-xs mb-1">
                    Release year
                  </span>
                  <span className="font-semibold text-[#F5F5F2]">
                    {media.releaseYear || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-[#111720] border border-[#252E3A] rounded-2xl p-6">
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-14">
                <Users size={22} strokeWidth={1.5} className="text-[#6F7885]" />
                <p className="text-sm text-[#6F7885]">
                  No reviews found for this media.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => {
                  const isDeleting = deletingId === review.id;
                  return (
                    <div
                      key={review.id}
                      className="group relative p-4 bg-[#161D27] border border-[#252E3A] rounded-xl transition-colors hover:border-[#3A4553]"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1C2531] border border-[#303A47] flex items-center justify-center text-xs font-semibold text-[#B8C0CA] flex-shrink-0">
                            {(review.user?.name || "A").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-[#F5F5F2] block">
                              {review.user?.name || "Anonymous User"}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-[#E5B84B] font-medium">
                              <Star className="w-3 h-3 fill-[#E5B84B] text-[#E5B84B]" />
                              <span>{review.rating} / 5</span>
                            </div>
                          </div>
                        </div>

                        <span className="text-xs text-[#6F7885] flex-shrink-0">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>

                      <p className="text-sm text-[#C2C8D0] mt-3 pl-12 leading-relaxed">
                        {review.content || review.review || "No text provided."}
                      </p>

                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={isDeleting}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-[#3A4553] hover:border-[#E26D6D] hover:bg-[rgba(226,109,109,0.08)] text-[#A7AFBA] hover:text-[#E26D6D] rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Review"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "links" && (
          <div className="space-y-4">
            <div className="bg-[#111720] border border-[#252E3A] rounded-2xl p-6 space-y-4">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8D96A3]">
                Streaming &amp; Links
              </h2>

              <div className="p-3.5 bg-[#161D27] border border-[#252E3A] rounded-xl">
                <span className="text-[#6F7885] flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide mb-1.5">
                  <PlayCircle size={13} strokeWidth={2} />
                  Trailer URL
                </span>
                {media.trailerUrl ? (
                  <a
                    href={media.trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#A7AFBA] hover:text-[#E5B84B] hover:underline break-all text-xs font-medium transition-colors"
                  >
                    {media.trailerUrl}
                  </a>
                ) : (
                  <span className="text-[#6F7885] text-xs">Not Available</span>
                )}
              </div>

              <div className="p-3.5 bg-[#161D27] border border-[#252E3A] rounded-xl">
                <span className="text-[#6F7885] flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide mb-1.5">
                  <Link2 size={13} strokeWidth={2} />
                  Streaming URL
                </span>
                {media.streamingUrl ? (
                  <a
                    href={media.streamingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#A7AFBA] hover:text-[#E5B84B] hover:underline break-all text-xs font-medium transition-colors"
                  >
                    {media.streamingUrl}
                  </a>
                ) : (
                  <span className="text-[#6F7885] text-xs">Not Available</span>
                )}
              </div>
            </div>

            <div className="bg-[#111720] border border-[#252E3A] rounded-2xl p-6 space-y-3">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8D96A3] mb-1">
                Record Metadata
              </h2>

              <div className="flex items-center justify-between py-2 border-b border-[#1D2530] text-sm">
                <span className="text-[#6F7885] flex items-center gap-1.5">
                  <Hash size={13} strokeWidth={2} />
                  Media ID
                </span>
                <span className="font-mono text-xs text-[#A7AFBA] bg-[#161D27] border border-[#252E3A] px-2 py-1 rounded">
                  {media.id}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#1D2530] text-sm">
                <span className="text-[#6F7885] flex items-center gap-1.5">
                  <CalendarPlus size={13} strokeWidth={2} />
                  Created At
                </span>
                <span className="font-medium text-[#F5F5F2] text-xs">
                  {media.createdAt
                    ? new Date(media.createdAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#1D2530] text-sm">
                <span className="text-[#6F7885] flex items-center gap-1.5">
                  <CalendarClock size={13} strokeWidth={2} />
                  Updated At
                </span>
                <span className="font-medium text-[#F5F5F2] text-xs">
                  {media.updatedAt
                    ? new Date(media.updatedAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-[#6F7885] flex items-center gap-1.5">
                  <Trash size={13} strokeWidth={2} />
                  Deleted At
                </span>
                <span
                  className={`font-medium text-xs ${
                    media.deletedAt ? "text-[#E26D6D]" : "text-[#62C68A]"
                  }`}
                >
                  {media.deletedAt
                    ? new Date(media.deletedAt).toLocaleString()
                    : "Active (Null)"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaInfoForAdmin;
