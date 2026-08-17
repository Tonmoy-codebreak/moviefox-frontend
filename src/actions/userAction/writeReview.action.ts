"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

type ReviewPayload = {
  mediaId: string;
  rating: number;
  content?: string;
  hasSpoiler?: boolean;
};

export const createReview = async (payload: ReviewPayload) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, message: "No authentication token found" };
    }

    const BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

    const response = await axios.post(`${BASE_URL}/review`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    revalidatePath(`/media/${payload.mediaId}`);

    return {
      success: true,
      message: response.data?.message || "Review submitted successfully!",
      data: response.data?.data,
    };
  } catch (error: unknown) {
    let message = "Failed to create review";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, message };
  }
};
