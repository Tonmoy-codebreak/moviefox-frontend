import API from "./api";

// Register Function
export const registerUser = async (userData: Record<string, unknown>) => {
  try {
    const response = await API.post("/auth/register", userData);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown } };
    throw (
      err.response?.data || {
        message: "Something went wrong during registration",
      }
    );
  }
};

// Login Function
export const loginUser = async (credentials: Record<string, unknown>) => {
  try {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown } };
    throw (
      err.response?.data || { message: "Something went wrong during login" }
    );
  }
};
