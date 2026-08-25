"use server";

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
    const response = await fetch(
      "http://localhost:5000/api/admin/overview-stats",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Failed to fetch overview stats",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong fetching stats!",
    };
  }
};
