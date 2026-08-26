"use server";

import { postWithAuth } from "@/lib/api-server";
import { revalidatePath } from "next/cache";

export async function addNewMediaAction(payload: Record<string, unknown>) {
  try {
    const responseData = await postWithAuth("/media", payload);

    revalidatePath("/allmedia");

    return { success: true, data: responseData };
  } catch (error: unknown) {
    console.error("Create Media Error:", error);

    const errorMessage =
      (error instanceof Error ? error.message : undefined) ||
      (typeof error === "object" && error !== null && "error" in error
        ? String(error.error)
        : undefined) ||
      "Failed to create media";

    return { success: false, message: errorMessage };
  }
}
