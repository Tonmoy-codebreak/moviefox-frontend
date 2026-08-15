import Link from "next/link";
import EditGenre from "@/components/modules/adminComponents/EditGenre";
import GenreDetails from "@/components/modules/adminComponents/GenreDetails";
import { getGenreDetailsAction } from "@/actions/adminAction/genreDetails.action";
import React from "react";
import DeleteGenre from "@/components/modules/adminComponents/DeleteGenre";
import { ArrowLeft, AlertCircle } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

const GenreDetailsPage = async ({ params }: Props) => {
  const resolvedParams = await params;
  const genreId = resolvedParams.id;

  const res = await getGenreDetailsAction(genreId);

  if (!res.success || !res.data) {
    return (
      <div className="max-w-2xl mx-auto mt-10 px-6">
        <div className="flex items-start gap-3 p-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Failed to load genre data</p>
            <p className="text-red-500 mt-0.5">{res.message}</p>
          </div>
        </div>
        <Link
          href="/genres"
          className="inline-flex items-center gap-1.5 mt-4 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to genres
        </Link>
      </div>
    );
  }

  const genre = res.data;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-6">
        {/* Top nav */}
        <Link
          href="/genres"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to genres
        </Link>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6 items-start">
          {/* Left: details, sticky on scroll */}
          <div className="lg:sticky lg:top-8">
            <GenreDetails id={genreId} />
          </div>

          {/* Right: edit (top) + delete (bottom) */}
          <div className="space-y-6">
            <EditGenre genre={genre} />
            <DeleteGenre genreId={genre.id} genreName={genre.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreDetailsPage;
