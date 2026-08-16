"use server";

import { getWithAuth } from "@/lib/api-server";
import { cookies } from "next/headers";
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export async function getSingleMediaForAdmin(id: string) {
  try {
    const result = await getWithAuth(`/media/${id}`);
    return {
      success: true,
      data: result.data || result,
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Failed to fetch media"),
    };
  }
}

export async function getReviewsByMediaIdForAdmin(mediaId: string) {
  try {
    const result = await getWithAuth(`/review/media/${mediaId}`);
    return {
      success: true,
      data: result.data || result,
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: [],
      message: getErrorMessage(error, "Failed to fetch reviews"),
    };
  }
}

export async function deleteReviewForAdmin(reviewId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    await axios.delete(`${BASE_URL}/review/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to delete review"),
    };
  }
}
