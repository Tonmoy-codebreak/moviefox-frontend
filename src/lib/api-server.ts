import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const serverAPI = axios.create({
  baseURL: BASE_URL,
});

export const getWithAuth = async (endpoint: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("No authentication token found");
  }

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

export const postWithAuth = async (
  endpoint: string,
  payload: Record<string, unknown>,
) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await serverAPI.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        `API Error [POST ${endpoint}]:`,
        error.response?.data || error.message,
      );
      throw error.response?.data || error;
    } else {
      console.error(`API Error [POST ${endpoint}]:`, error);
      throw error;
    }
  }
};
