"use server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function fetchMediaAction(params: {
  page?: string;
  limit?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  try {
    const {
      page = "1",
      limit = "8",
      searchTerm = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(searchTerm && { searchTerm }),
      sortBy,
      sortOrder,
    });

    const res = await fetch(`${BASE_URL}/media?${queryParams.toString()}`, {
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch media");
    }

    return {
      success: true,
      data: result.data || [],
      meta: result.meta || { page: 1, limit: 8, total: 0, totalPages: 1 },
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return {
      success: false,
      data: [],
      meta: { page: 1, limit: 8, total: 0, totalPages: 1 },
      message,
    };
  }
}
