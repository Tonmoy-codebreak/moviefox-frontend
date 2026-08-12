import MediaContainer from "@/components/modules/publicComponents/MediaContainer";
import { fetchMediaAction } from "@/actions/publicAction/mediaContainer.action";

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
    : { page: 1, limit: 10, total: 0, totalPages: 1 };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-8xl text-center font-bold mb-6">Media Library</h1>

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
