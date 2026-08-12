import MediaInfoForAdmin from "@/components/modules/adminComponents/MediaInfoForAdmin";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const mediainfo = async ({ params }: Props) => {
  const resolvedParams = await params;
  const mediaId = resolvedParams.id;

  return (
    <div className="p-6">
      <MediaInfoForAdmin id={mediaId} />
    </div>
  );
};

export default mediainfo;
