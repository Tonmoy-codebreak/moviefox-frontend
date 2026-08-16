"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const softDeleteMedia = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "No authentication token found" };
    }

    // DELETE /media/:id এপিআই কল
    const response = await axios.delete(`${BASE_URL}/media/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ক্যাশ রিভ্যালিডেট করা যাতে UI আপডেট হয়ে যায়
    revalidatePath("/allmedia");

    return {
      success: true,
      data: response.data?.data || response.data,
      message: "Media deleted successfully",
    };
  } catch (error: unknown) {
    let message = "Failed to delete media";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return {
      success: false,
      message,
    };
  }
};
