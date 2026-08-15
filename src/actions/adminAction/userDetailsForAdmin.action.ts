"use server";

import { getWithAuth } from "@/lib/api-server";

export async function getUserDetailsForAdminAction(userId: string) {
  try {
    const result = await getWithAuth(`/auth/userdetails/${userId}`);

    return {
      success: true,
      data: result?.data || result,
    };
  } catch (error: unknown) {
    const errorMessage =
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { data?: { message?: string } } }).response
        ?.data?.message === "string"
        ? (error as { response?: { data?: { message?: string } } }).response?.data
            ?.message
        : error instanceof Error
          ? error.message
          : "Something went wrong";

    return {
      success: false,
      message: errorMessage,
    };
  }
}
