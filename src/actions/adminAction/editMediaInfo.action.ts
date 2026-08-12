"use server";

import { revalidatePath } from "next/cache";
import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const serverAPI = axios.create({
  baseURL: BASE_URL,
});

export async function updateMediaInfoAction(
  mediaId: string,
  updatedData: Record<string, unknown>,
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "No authentication token found",
      };
    }

    const response = await serverAPI.patch(`/media/${mediaId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    revalidatePath(`/allmedia/${mediaId}`);
    revalidatePath(`/allmedia`);

    return { success: true, data: response.data };
  } catch (error: unknown) {
    console.error("Update Media Error:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update media info";
      return { success: false, message: errorMessage };
    }

    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message };
  }
}
