"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";

const serverAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 8000, // 👈 ADD THIS LINE
});

export async function getAllGenresAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    console.log("Fetching genres from:", BASE_URL); // 👈 ADD THIS LINE

    const response = await serverAPI.get("/genre", { headers });

    console.log("Genres fetched successfully"); // 👈 ADD THIS LINE

    return {
      success: true,
      data: response.data?.data || response.data,
    };
  } catch (error: unknown) {
    console.error("Get Genres Error:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch genres";
      return { success: false, message: errorMessage };
    }

    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message };
  }
}
