import MediaContainer from "@/components/MediaContainer";
import API from "@/lib/api";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function MediaPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const limit = 10;
  const searchTerm = resolvedParams.searchTerm || "";
  const sortBy = resolvedParams.sortBy || "createdAt";
  const sortOrder = resolvedParams.sortOrder || "desc";

  let movies = [];
  let meta = { page: 1, limit: 5, total: 0, totalPages: 1 };

  try {
    const res = await API.get("/media", {
      params: {
        page,
        limit,
        sortBy,
        sortOrder,
        ...(searchTerm && { searchTerm }),
      },
    });

    const result = res.data;
    movies = result.data || [];
    meta = result.meta || meta;
  } catch (error) {
    console.error("Failed to fetch media data:", error);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-8xl text-center font-bold mb-6">Media Library</h1>

      <MediaContainer
        initialMovies={movies}
        meta={meta}
        currentSearch={searchTerm}
        currentSortBy={sortBy}
        currentSortOrder={sortOrder}
      />
    </div>
  );
}
