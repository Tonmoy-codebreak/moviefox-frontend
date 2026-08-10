import MediaContainer from "@/components/MediaContainer";
import { fetchMediaAction } from "@/actions/mediaContainer.action";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page || "1";
  const searchTerm = resolvedParams.searchTerm || "";
  const sortBy = resolvedParams.sortBy || "createdAt";
  const sortOrder = resolvedParams.sortOrder || "desc";

  const response = await fetchMediaAction({
    page,
    searchTerm,
    sortBy,
    sortOrder,
  });

  const movies = response.success ? response.data : [];
  const meta = response.success
    ? response.meta
    : { page: 1, limit: 8, total: 0, totalPages: 1 };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Media Library</h1>

      <MediaContainer
        initialMovies={movies}
        initialMeta={meta}
        currentSearch={searchTerm}
        currentSortBy={sortBy}
        currentSortOrder={sortOrder}
      />
    </div>
  );
}
