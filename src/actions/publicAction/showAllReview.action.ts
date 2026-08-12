"use server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function fetchReviewsByMediaAction(mediaId: string) {
  try {
    const res = await fetch(`${BASE_URL}/review/media/${mediaId}`, {
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch reviews");
    }

    return {
      success: true,
      data: result.data || [],
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return { success: false, data: [], message };
  }
}
