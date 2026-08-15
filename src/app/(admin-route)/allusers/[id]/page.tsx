import UserDetailsForAdmin from "@/components/modules/adminComponents/UserDetailsForAdmin";
import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const UserDetailsForAdminPage = async ({ params }: Props) => {
  const resolvedParams = await params;

  return (
    <div>
      <UserDetailsForAdmin params={resolvedParams} />
    </div>
  );
};

export default UserDetailsForAdminPage;
