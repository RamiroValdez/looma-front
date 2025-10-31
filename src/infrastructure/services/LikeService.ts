import { useAuthStore } from "../../domain/store/AuthStore.ts";
import { handleError } from "../utils/errorHandler.ts";

export async function likeWork(workId: number): Promise<{ likeCount: number }> {
  try {
    const token = useAuthStore.getState().token;
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/works/${workId}/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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

export async function unlikeWork(workId: number): Promise<{ likeCount: number }> {
  try {
    const token = useAuthStore.getState().token;
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/works/${workId}/like`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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

export async function likeChapter(workId: number, chapterId: number): Promise<{ likeCount: number }> {
  try {
    const token = useAuthStore.getState().token;
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/work/${workId}/chapter/${chapterId}/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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

export async function unlikeChapter(workId: number, chapterId: number): Promise<{ likeCount: number }> {
  try {
    const token = useAuthStore.getState().token;
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/work/${workId}/chapter/${chapterId}/like`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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