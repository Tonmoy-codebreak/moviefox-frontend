"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type WatchlistItem = {
  media: {
    id: string;
  };
};

// for checking if already watchlisted
export async function checkIfInWatchlist(mediaId: string): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return false;

  try {
    const res = await fetch(`${BASE_URL}/watchlist/my-watchlist`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return false;

    const result = (await res.json()) as { data?: WatchlistItem[] };
    const watchlist = result?.data ?? [];

    return watchlist.some((item: WatchlistItem) => item.media.id === mediaId);
  } catch (error) {
    return false;
  }
}

// add to watchlist function
export async function addToWatchlistAction(mediaId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const res = await fetch(`${BASE_URL}/watchlist`, {
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
        message: data.message || "Failed to add to watchlist",
      };
    }

    revalidatePath("/watchlist");
    return { success: true, data };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message };
  }
}
