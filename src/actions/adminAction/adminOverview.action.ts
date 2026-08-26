"use server";

import { getWithAuth } from "@/lib/api-server";

export interface OverviewStatsData {
  users: {
    total: number;
  };
  media: {
    total: number;
    published: number;
  };
  reviews: {
    total: number;
    pending: number;
  };
}

export interface ActionResponse {
  success: boolean;
  data?: OverviewStatsData;
  error?: string;
}

export const getAdminOverviewAction = async (): Promise<ActionResponse> => {
  try {
    const result = await getWithAuth("/media/overview-stats");

    return {
      success: true,

      data: result.data,
    };
  } catch (error: unknown) {
    const responseMessage =
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null &&
      "data" in error.response &&
      typeof error.response.data === "object" &&
      error.response.data !== null &&
      "message" in error.response.data &&
      typeof error.response.data.message === "string"
        ? error.response.data.message
        : undefined;

    return {
      success: false,
      error:
        responseMessage ||
        (error instanceof Error ? error.message : undefined) ||
        "Something went wrong fetching stats!",
    };
  }
};
