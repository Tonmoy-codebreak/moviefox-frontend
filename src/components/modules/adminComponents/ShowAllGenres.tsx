import React from "react";
import Link from "next/link"; // ১. Link ইমপোর্ট করা হলো
import { getAllGenresAction } from "@/actions/adminAction/showAllGenres.action";

type Genre = {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
};

const ShowAllGenres = async () => {
  const res = await getAllGenresAction();

  if (!res.success) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
        Failed to load genres: {res.message}
      </div>
    );
  }

  const genres: Genre[] = res.data || [];

  return (
    <div className="bg-white p-6 border rounded-2xl shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">All Genres</h2>
          <p className="text-xs text-gray-400">
            Manage and view all available movie/series genres.
          </p>
        </div>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
          Total: {genres.length}
        </span>
      </div>

      {genres.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No genres found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genres/${genre.id}`}
              className="p-4 border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-indigo-200 rounded-xl transition-all flex flex-col justify-between gap-2 cursor-pointer block"
            >
              <div>
                <h3 className="font-semibold text-gray-800 text-base group-hover:text-indigo-600">
                  {genre.name}
                </h3>
                <span className="text-xs text-gray-400 font-mono">
                  Slug: {genre.slug}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-200/60 text-[11px] text-gray-400">
                <span>ID: {genre.id.slice(0, 8)}...</span>
                {genre.createdAt && (
                  <span>{new Date(genre.createdAt).toLocaleDateString()}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowAllGenres;
