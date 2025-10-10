import works from "../../public/data/work-2.json";

import { useAuthStore } from "../store/AuthStore";
import { handleError } from "../utils/errorHandler";
import type { WorkDTO } from "../dto/WorkDTO";

export async function addChapter(
  workId: number,
  languageId: number,
  contentType: string // text or images
): Promise<{ fetchStatus: number, chapterId: number }> {
  try {
    if (!languageId && !contentType && !workId) {
      throw new Error("Datos obligatorios no proporcionados.");
    }

    const token = useAuthStore.getState().token;

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_MANAGE_WORK_URL}/create-chapter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ workId, languageId, contentType }),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      fetchStatus: response.status,
      chapterId: data.chapterId
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
    const work = works.find((w) => w.id === workId);
    if (!work) throw new Error("Obra no encontrada");

    const chapter = work.chapters.find((c) => c.id === chapterId);
    if (!chapter) throw new Error("Capítulo no encontrado");

    chapter.title = titulo;
    chapter.description = contenido;
    chapter.lastModified = new Date().toISOString();
    if (publishAt) chapter.publishedAt = publishAt;

    const token = useAuthStore.getState().token;

    const response = await fetch(`http://localhost:8080/api/update-chapter`, { // FALTA CONFIRMACION DE ENDPOINT DE IVONE.
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
      fetchStatus: response.status
    };
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function getWorkById(id: number): Promise<WorkDTO> {
  try {
    const token = useAuthStore.getState().token;

    // const url = buildEndpoint(import.meta.env.VITE_API_GET_WORK_BY_ID_URL, { id });
    
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_MANAGE_WORK_URL}/${id}`, {
      method: "GET",
      headers,
    });


    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener la obra.");
    }
    return (await response.json()) as WorkDTO;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function deleteChapter(
  chapterId: number,
  workId: number
): Promise<{ fetchStatus: number }> {
  try {
    const token = useAuthStore.getState().token;

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_WORK_URL}/${workId}/chapter/${chapterId}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return { fetchStatus: response.status };
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/*

export async function getWorkById(id: number) {
  return new Promise((resolve) => {
    const work = works.find((w) => w.id === id);
    setTimeout(() => resolve(work), 200);
  });
}
*/