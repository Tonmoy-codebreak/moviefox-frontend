"use server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function getSingleMediaForAdmin(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/media/${id}`, {
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch media details");
    }

    return {
      success: true,
      data: result.data || result,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return {
      success: false,
      data: null,
      message,
    };
  }
}
