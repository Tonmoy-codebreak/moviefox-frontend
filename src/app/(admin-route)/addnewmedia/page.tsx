import { getAllGenresAction } from "@/actions/adminAction/showAllGenres.action";
import AddNewMedia from "@/components/modules/adminComponents/AddNewMedia";
import React from "react";

const AddNewMediaPage = async () => {
  let allGenres = [];

  try {
    const res = await getAllGenresAction();
    if (res && res.success) {
      allGenres = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch genres:", error);
  }

  return (
    <div className="p-6">
      <AddNewMedia allGenres={allGenres} />
    </div>
  );
};

export default AddNewMediaPage;
