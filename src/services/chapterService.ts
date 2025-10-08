import works from "../../public/data/work-2.json";
import { handleError } from "../utils/errorHandler";
import type { ChapterDTO } from "../dto/ChapterDTO";

export async function getWorkById(id: number) {
  return new Promise((resolve) => {
    const work = works.find((w) => w.id === id);
    setTimeout(() => resolve(work), 200);
  });
}

export async function addChapter(
  workId: number,
  titulo: string,
  description: string,
  publishAt?: string,
  isDraft: boolean = false
): Promise<ChapterDTO> {
  try {
    if (!titulo.trim() || !description.trim()) {
      throw new Error("El título y el contenido son obligatorios.");
    }

    const work = works.find((w) => w.id === workId);
    if (!work) {
      throw new Error("Obra no encontrada");
    }

    const newChapter: ChapterDTO = {
      id: work.chapters.length + 1,
      title: titulo,
      description: description,
      price: 0,
      likes: 0,
      lastModified: new Date().toISOString(),
      publishedAt: publishAt ? publishAt : "", // Convertir undefined a string vacío
      status: isDraft ? "draft" : "published",
    };
   
    const response = await fetch(`https://api.tuservidor.com/users/${userId}`); // AGUARDAR AL ENDPOINT Q LIBERA IVONE
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Retornar los datos directamente desde la API
    return await response.json();
    return newChapter;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export const getUserData = async (userId: number): Promise<UserData> => {
  try {
    const response = await fetch(`https://api.tuservidor.com/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Retornar los datos directamente desde la API
    return await response.json();
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    throw error; // Relanzar el error para que el componente lo maneje
  }
};

export async function updateChapter(
  workId: number,
  chapterId: number,
  titulo: string,
  contenido: string,
  publishAt?: string
): Promise<ChapterDTO> {
  try {
    const work = works.find((w) => w.id === workId);
    if (!work) throw new Error("Obra no encontrada");

    const chapter = work.chapters.find((c) => c.id === chapterId);
    if (!chapter) throw new Error("Capítulo no encontrado");

    chapter.title = titulo;
    chapter.description = contenido;
    chapter.lastModified = new Date().toISOString();
    if (publishAt) chapter.publishedAt = publishAt;

    return chapter as ChapterDTO;
  } catch (error) {
    throw new Error(handleError(error));
  }
}


/*llama al backend real
import { buildEndpoint } from "../utils/endpoints";
import { useAuthStore } from "../store/AuthStore";
import { handleError } from "../utils/errorHandler";

export async function getWorkById(id: number) {
  try {
    // Obtenemos el token desde el store de autenticación
    const { token } = useAuthStore();

    // Construimos el endpoint dinámicamente
    const url = buildEndpoint(import.meta.env.VITE_API_GET_WORK_BY_ID_URL, { id });

    // Configuramos los encabezados
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Incluimos el token en el encabezado
    };

    // Realizamos la solicitud al backend
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener la obra.");
    }

    // Retornamos los datos de la respuesta
    return await response.json();
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function addChapter(
  workId: number,
  titulo: string,
  contenido: string,
  publishAt?: string, // Fecha y hora opcional para programar la publicación
  isDraft: boolean = false // Nuevo parámetro para indicar si es un borrador
) {
  try {
    if (!titulo.trim() || !contenido.trim()) {
      throw new Error("El título y el contenido son obligatorios.");
    }

    // Obtenemos el token desde el store de autenticación
    const { token } = useAuthStore();

    // Construimos el endpoint dinámicamente
    const url = buildEndpoint(import.meta.env.VITE_API_ADD_CHAPTER_URL, { workId });

    // Configuramos los encabezados
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Incluimos el token en el encabezado
    };

    // Configuramos el cuerpo de la solicitud
    const body = JSON.stringify({
      titulo,
      contenido,
      publishAt,
      isDraft,
    });

    // Realizamos la solicitud al backend
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al agregar el capítulo.");
    }

    // Retornamos los datos de la respuesta
    return await response.json();
  } catch (error) {
    throw new Error(handleError(error));
  }
}
*/