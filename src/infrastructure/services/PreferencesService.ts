import { useAuthStore } from "../../domain/store/AuthStore.ts";
import { handleError } from "../../infrastructure/errorHandler.ts";

export async function sendPreferences(genres: string[], formats: string[]) {
  try {
    const token = useAuthStore.getState().token;
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/user/preferences`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ genres, formats }),
      }
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(handleError(error));
  }
}