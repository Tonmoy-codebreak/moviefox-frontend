"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getWithAuth } from "@/lib/api-server";

// get soft deleted media
export const getSoftDeletedMedia = async (queryString = "") => {
  try {
    const endpoint = `/media/trash${queryString}`;

    const response = await getWithAuth(endpoint);

    return {
      success: true,
      data: response?.data || [],
      meta: response?.meta || null,
    };
  } catch (error: unknown) {
    let message = "Failed to fetch trash media";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message;
      console.error(
        "Axios error details:",
        error.response?.status,
        error.response?.data,
      );
    } else if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, message, data: [], meta: null };
  }
};
// restore media from trash
export const restoreMedia = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "No authentication token found" };
    }

    const BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

    const response = await axios.patch(
      `${BASE_URL}/media/${id}/restore`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    revalidatePath("/trash");

    return {
      success: true,
      message: response.data?.message || "Media restored successfully",
    };
  } catch (error: unknown) {
    let message = "Failed to restore media";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message;
    }
    return { success: false, message };
  }
};

// permanently delete a media
export const permanentDeleteMedia = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "No authentication token found" };
    }

    const BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

    const response = await axios.delete(`${BASE_URL}/media/hard-delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    revalidatePath("/trash");

    return {
      success: true,
      message: response.data?.message || "Media permanently deleted",
    };
  } catch (error: unknown) {
    let message = "Failed to permanently delete media";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message;
    }
    return { success: false, message };
  }
};
