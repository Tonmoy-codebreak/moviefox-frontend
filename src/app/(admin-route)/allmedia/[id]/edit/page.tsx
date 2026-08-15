import React from "react";
import { getSingleMediaForAdmin } from "@/actions/adminAction/mediaInfoForAdmin.action";

import EditMediaInfo from "@/components/modules/adminComponents/EditMediaInfo";
import { getAllGenresAction } from "@/actions/adminAction/showAllGenres.action";

type Props = {
  params: Promise<{ id: string }>;
};

const EditMediaPage = async ({ params }: Props) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [mediaRes, genresRes] = await Promise.all([
    getSingleMediaForAdmin(id),
    getAllGenresAction(),
  ]);

  if (!mediaRes.success || !mediaRes.data) {
    return (
      <div className="p-6 text-red-500 bg-red-50 border border-red-200 rounded-xl max-w-xl mx-auto mt-10">
        Failed to load media info: {mediaRes.message}
      </div>
    );
  }

  const media = mediaRes.data;
  const allGenres = genresRes.success ? genresRes.data : [];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Media: {media.title}
        </h1>
        <p className="text-sm text-gray-400">
          Update the information below and save changes.
        </p>
      </div>

      <EditMediaInfo media={media} allGenres={allGenres} />
    </div>
  );
};

export default EditMediaPage;
