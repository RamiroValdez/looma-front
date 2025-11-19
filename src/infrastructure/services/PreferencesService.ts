import { useAuthStore } from "../../domain/store/AuthStore.ts";
import { handleError } from "../../infrastructure/errorHandler.ts";

export async function sendPreferences(genres: string[]) {
  try {
    const token = useAuthStore.getState().token;
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/users/preferences`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ genres }),
      }
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return;
  } catch (error) {
    throw new Error(handleError(error));
  }
}