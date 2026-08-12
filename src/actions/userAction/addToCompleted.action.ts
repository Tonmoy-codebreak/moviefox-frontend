"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type CompletedMediaItem = {
  media: {
    id: string;
  };
};

// ১. চেক করার সার্ভার অ্যাকশন
export async function checkIfInCompleted(mediaId: string): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return false;

  try {
    const res = await fetch(`${BASE_URL}/completedmedia/my-list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return false;

    const result = await res.json();
    const completedList = result?.data || [];

    return completedList.some(
      (item: CompletedMediaItem) => item.media.id === mediaId,
    );
  } catch (error) {
    return false;
  }
}

// ২. কমপ্লিটেড লিস্টে অ্যাড করার সার্ভার অ্যাকশন
export async function addToCompletedAction(mediaId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const res = await fetch(`${BASE_URL}/completedmedia`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mediaId }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to add to completed list",
      };
    }

    revalidatePath("/completed");
    return { success: true, data };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message };
  }
}
