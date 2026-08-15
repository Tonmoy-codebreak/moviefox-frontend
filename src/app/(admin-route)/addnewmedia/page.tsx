import { getAllGenresAction } from "@/actions/adminAction/showAllGenres.action";
import AddNewMedia from "@/components/modules/adminComponents/AddNewMedia";

import React from "react";

const AddNewMediaPage = async () => {
  const res = await getAllGenresAction();
  const allGenres = res.success ? res.data : [];

  return (
    <div className="p-6">
      <AddNewMedia allGenres={allGenres} />
    </div>
  );
};

export default AddNewMediaPage;
