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
    <div className="min-h-screen bg-[#0B0F14]">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8 pb-6 border-b border-[#252E3A]">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.12em] text-[#E5B84B] mb-2">
            Browse
          </span>

          <p className="text-sm text-[#8D96A3] mt-2">
            {meta.total} {meta.total === 1 ? "title" : "titles"} available to
            explore
          </p>
        </div>

        <MediaContainer
          initialMovies={movies}
          initialMeta={meta}
          currentSearch={searchTerm}
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
        />
      </div>
    </div>
  );
}
