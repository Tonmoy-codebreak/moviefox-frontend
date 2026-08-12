import React from "react";
import Link from "next/link";
import { getGenreDetailsAction } from "@/actions/adminAction/genreDetails.action";

type Props = {
  id: string;
};

type Media = {
  id: string;
  posterUrl?: string | null;
  title: string;
  type: string;
  releaseYear?: number | null;
  access?: string | null;
};

type Genre = {
  id: string;
  name: string;
  slug?: string | null;
  createdAt?: string | null;
  media?: Array<{ media: Media }>; // Prisma include structure
};

const GenreDetails = async ({ id }: Props) => {
  const res = await getGenreDetailsAction(id);

  if (!res.success || !res.data) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm max-w-2xl mx-auto mt-6">
        Failed to load genre details: {res.message}
      </div>
    );
  }

  const genre = res.data as Genre;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Genre Header Card */}
      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
            Genre Details
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            {genre.name}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Slug:{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono">
              {genre.slug}
            </code>
          </p>
        </div>

        <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-xl border">
          <p>
            Created At:{" "}
            {genre.createdAt
              ? new Date(genre.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
          <p className="mt-1">
            ID: <span className="font-mono">{genre.id}</span>
          </p>
        </div>
      </div>

      {/* Associated Media / Movies Section */}
      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Associated Media ({genre.media?.length || 0})
          </h2>
        </div>

        {!genre.media || genre.media.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No media found under this genre.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {genre.media.map((item) => {
              const mediaObj = item.media; // Prisma include এর স্ট্রাকচার অনুযায়ী
              if (!mediaObj) return null;

              return (
                <Link
                  key={mediaObj.id}
                  href={`/allmedia/${mediaObj.id}`}
                  className="p-4 border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-indigo-200 rounded-xl transition-all flex gap-3 items-center group block"
                >
                  <img
                    src={
                      mediaObj.posterUrl ||
                      "https://placehold.co/100x150?text=No+Image"
                    }
                    alt={mediaObj.title}
                    className="w-16 h-20 object-cover rounded-lg border bg-gray-200 flex-shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h3 className="font-semibold text-gray-800 text-sm truncate group-hover:text-indigo-600">
                      {mediaObj.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {mediaObj.type} • {mediaObj.releaseYear || "N/A"}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-medium rounded">
                      {mediaObj.access}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenreDetails;
