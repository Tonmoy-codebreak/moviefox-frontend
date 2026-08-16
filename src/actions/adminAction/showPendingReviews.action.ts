"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const serverAPI = axios.create({
  baseURL: BASE_URL,
});

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPendingReviewsAction() {
  try {
    const headers = await getAuthHeaders();
    const response = await serverAPI.get("/review/pending", { headers });

    return {
      success: true,
      data: response.data?.data || response.data,
    };
  } catch (error: unknown) {
    console.warn(
      "Get Pending Reviews Error:",
      axios.isAxiosError(error) ? error.message : error,
    );
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch pending reviews",
      };
    }
    return { success: false, message: "Something went wrong" };
  }
}

export async function approveReviewAction(reviewId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await serverAPI.patch(
      `/review/${reviewId}/approve`,
      {},
      { headers },
    );

    revalidatePath("/admin/pendingreviews");

    return {
      success: true,
      data: response.data?.data || response.data,
      message: "Review approved successfully!",
    };
  } catch (error: unknown) {
    console.warn(
      "Approve Review Error:",
      axios.isAxiosError(error) ? error.message : error,
    );
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to approve review",
      };
    }
    return { success: false, message: "Something went wrong" };
  }
}

export async function deleteReviewAction(reviewId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await serverAPI.delete(`/review/${reviewId}`, { headers });

    revalidatePath("/admin/pending-reviews");

    return {
      success: true,
      data: response.data?.data || response.data,
      message: "Review deleted successfully!",
    };
  } catch (error: unknown) {
    console.warn(
      "Delete Review Error:",
      axios.isAxiosError(error) ? error.message : error,
    );
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete review",
      };
    }
    return { success: false, message: "Something went wrong" };
  }
}
