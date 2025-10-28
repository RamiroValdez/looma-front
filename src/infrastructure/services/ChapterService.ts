import { useAuthStore } from "../../domain/store/AuthStore.ts";
import { handleError } from "../utils/errorHandler.ts";
import type { WorkDTO } from "../../domain/dto/WorkDTO.ts";
import { useApiQuery } from "../api/useApiQuery.ts";
import type { ChapterWithContentDTO } from "../../domain/dto/ChapterWithContentDTO.ts";

export async function addChapter(
  workId: number,
  languageId: number,
  contentType: string
): Promise<{ fetchStatus: number; chapterId: number }> {
  try {
    if (!languageId && !contentType && !workId) {
      throw new Error("Datos obligatorios no proporcionados.");
    }

    const token = useAuthStore.getState().token;

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_MANAGE_WORK_URL}/create-chapter`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ workId, languageId, contentType }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      fetchStatus: response.status,
      chapterId: data.chapterId,
    };
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function updateChapter(
  workId: number,
  chapterId: number,
  titulo: string,
  contenido: string,
  publishAt?: string
): Promise<{ fetchStatus: number }> {
  try {
    
    const token = useAuthStore.getState().token;

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_MANAGE_WORK_URL}/update-chapter`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workId, chapterId, titulo, contenido, publishAt }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return {
      fetchStatus: response.status,
    };
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function getWorkById(id: number): Promise<WorkDTO> {
  try {
    const token = useAuthStore.getState().token;

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_MANAGE_WORK_URL}/${id}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener la obra.");
    }
    return (await response.json()) as WorkDTO;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export function getChapterById(chapterId: number, languageCode: string) {
  const { token } = useAuthStore();
  let url = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_EDIT_CHAPTER_URL}/${chapterId}`;
  if (languageCode) {
    url += `?language=${encodeURIComponent(languageCode)}`;
  }

  return useApiQuery<ChapterWithContentDTO>(
    [
      "get-chapter-content " +
        chapterId +
        (languageCode ? `-${languageCode}` : ""),
    ],
    {
      url: url,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function deleteChapter(
  chapterId: number,
  workId: number
): Promise<{ fetchStatus: number }> {
  try {
    const token = useAuthStore.getState().token;

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_WORK_URL}/${workId}/chapter/${chapterId}/delete`,
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
    return { fetchStatus: response.status };
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function scheduleChapter(
  workId: number,
  chapterId: number,
  when: string
): Promise<{ fetchStatus: number }> {
  try {
    const token = useAuthStore.getState().token;

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_WORK_URL}/${workId}/chapter/${chapterId}/schedule`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ when }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return { fetchStatus: response.status };
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function publishChapter(
  workId: number,
  chapterId: number
): Promise<{ fetchStatus: number }> {
  try {
    const token = useAuthStore.getState().token;

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_WORK_URL}/${workId}/chapter/${chapterId}/publish`,
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
    return { fetchStatus: response.status };
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function cancelScheduleChapter(
  workId: number,
  chapterId: number
): Promise<{ fetchStatus: number }> {
  try {
    const token = useAuthStore.getState().token;

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_WORK_URL}/${workId}/chapter/${chapterId}/schedule`,
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
    return { fetchStatus: response.status };
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function saveDraftChapter(
  chapterId: number,
  payload: {
    title: string;
    status: string;
    last_update: string;
    price: number;
    allow_ai_translation: boolean;
    versions: Record<string, string>;
  }
): Promise<{ fetchStatus: number }> {
  try {
    const token = useAuthStore.getState().token;
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_EDIT_CHAPTER_URL}/update/${chapterId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return { fetchStatus: response.status };
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function importFileToText(file: File): Promise<string> {
  try {
    if (!file) throw new Error("Archivo no seleccionado.");

    const token = useAuthStore.getState().token;
    const form = new FormData();
    form.append("file", file, file.name);

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/edit-chapter/import-text`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: form,
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      throw new Error(errBody?.error || `Error ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as { text: string };
    return data.text ?? "";
  } catch (error) {
    throw new Error(handleError(error));
  }
}
