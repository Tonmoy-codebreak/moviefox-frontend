import AddGenre from "@/components/modules/adminComponents/AddGenre";
import ShowAllGenres from "@/components/modules/adminComponents/ShowAllGenres";
import React from "react";

const GenresPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
            Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            Genre Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, view, and manage all movie and series genres efficiently.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Add Genre Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <AddGenre />
          </div>
        </div>

        {/* Right Column: Show All Genres List */}
        <div className="lg:col-span-2">
          <ShowAllGenres />
        </div>
      </div>
    </div>
  );
};

export default GenresPage;
