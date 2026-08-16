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
    <div className="bg-[#0B0F14] w-full">
      <MediaInfoForAdmin
        id={mediaId}
        headerActions={<DeleteMedia mediaId={mediaId} />}
      />
    </div>
  );
};

export default Mediainfo;
