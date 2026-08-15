import EditGenre from "@/components/modules/adminComponents/EditGenre";
import GenreDetails from "@/components/modules/adminComponents/GenreDetails";
import { getGenreDetailsAction } from "@/actions/adminAction/genreDetails.action";
import React from "react";
import DeleteGenre from "@/components/modules/adminComponents/DeleteGenre";

type Props = {
  params: Promise<{ id: string }>;
};

const GenreDetailsPage = async ({ params }: Props) => {
  const resolvedParams = await params;
  const genreId = resolvedParams.id;

  const res = await getGenreDetailsAction(genreId);

  if (!res.success || !res.data) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm max-w-2xl mx-auto mt-6">
        Failed to load genre data: {res.message}
      </div>
    );
  }

  const genre = res.data;

  return (
    <div className="space-y-8 pb-10">
      <GenreDetails id={genreId} />

      <div className="max-w-5xl mx-auto px-6">
        <EditGenre genre={genre} />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <DeleteGenre genreId={genre.id} genreName={genre.name} />
      </div>
    </div>
  );
};

export default GenreDetailsPage;
