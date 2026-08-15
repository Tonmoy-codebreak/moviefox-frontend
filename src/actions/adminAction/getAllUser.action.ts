"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const serverAPI = axios.create({
  baseURL: BASE_URL,
});

export async function getAllUsersAction(query?: {
  searchTerm?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const params = new URLSearchParams();
    if (query?.searchTerm) params.append("searchTerm", query.searchTerm);
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));

    const response = await serverAPI.get(
      `/auth/all-users?${params.toString()}`,
      {
        headers,
      },
    );

    return {
      success: true,
      meta: response.data?.meta,
      data: response.data?.data,
      flatData: response.data?.flatData,
    };
  } catch (error: unknown) {
    console.error("Get All Users Error:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch users";
      return { success: false, message: errorMessage };
    }

    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message };
  }
}
