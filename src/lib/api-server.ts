// lib/api-server.ts
import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const serverAPI = axios.create({
  baseURL: BASE_URL,
});

export const getWithAuth = async (endpoint: string) => {
  // 1. Get the cookies from the request context
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value; // Ensure this matches your cookie name

  if (!token) {
    throw new Error("No authentication token found");
  }

  // 2. Perform the request with the Authorization header
  try {
    const response = await serverAPI.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        `API Error [${endpoint}]:`,
        error.response?.data || error.message,
      );
    } else {
      console.error(`API Error [${endpoint}]:`, error);
    }
    throw error;
  }
};
