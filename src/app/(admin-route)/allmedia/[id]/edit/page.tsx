import React from "react";
import { getSingleMediaForAdmin } from "@/actions/adminAction/mediaInfoForAdmin.action";

import EditMediaInfo from "@/components/modules/adminComponents/EditMediaInfo";
import { getAllGenresAction } from "@/actions/adminAction/showAllGenres.action";
import { AlertTriangle } from "lucide-react";

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
      <div className="min-h-screen bg-[#0B0F14] flex justify-center pt-16 px-6">
        <div className="flex items-start gap-3 p-5 text-[#E26D6D] bg-[#161D27] border border-[#3A2A2A] rounded-xl max-w-xl w-full">
          <AlertTriangle
            size={18}
            strokeWidth={2}
            className="mt-0.5 flex-shrink-0"
          />
          <span className="text-sm">
            Failed to load media info: {mediaRes.message}
          </span>
        </div>
      </div>
    );
  }

  const media = mediaRes.data;
  const allGenres = genresRes.success ? genresRes.data : [];

  // EditMediaInfo owns the full page shell (dark background, max-w-4xl frame,
  // heading, back link) so this route just hands it the data — no duplicate wrapper.
  return <EditMediaInfo media={media} allGenres={allGenres} />;
};

export default EditMediaPage;
