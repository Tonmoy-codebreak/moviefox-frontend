import DeleteMedia from "@/components/modules/adminComponents/DeleteMedia";
import MediaInfoForAdmin from "@/components/modules/adminComponents/MediaInfoForAdmin";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const Mediainfo = async ({ params }: Props) => {
  const resolvedParams = await params;
  const mediaId = resolvedParams.id;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <MediaInfoForAdmin id={mediaId} />

      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Danger Zone</h3>
          <p className="text-sm text-gray-400">
            Once you delete this media, it will be marked as deleted.
          </p>
        </div>

        <DeleteMedia mediaId={mediaId} />
      </div>
    </div>
  );
};

export default Mediainfo;
