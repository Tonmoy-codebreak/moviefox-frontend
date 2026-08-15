"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const serverAPI = axios.create({
  baseURL: BASE_URL,
});

export async function addGenreAction(payload: { name: string }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "No authentication token found",
      };
    }

    const response = await serverAPI.post("/genre", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    revalidatePath("/genres");

    return {
      success: true,
      data: response.data?.data || response.data,
    };
  } catch (error: unknown) {
    console.error("Add Genre Error:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create genre";
      return { success: false, message: errorMessage };
    }

    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message };
  }
}
