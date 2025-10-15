import { useAuthStore } from "../store/AuthStore";

export const translateContent = async (
  sourceLanguage: string,
  targetLanguage: string,
  originalText: string
): Promise<string> => {
  try {

    if (!sourceLanguage || !targetLanguage || !originalText) {
      throw new Error("Todos los campos son obligatorios.");
    }

    const url = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_TRANSLATION_URL}/create-version`;

    const { token } = useAuthStore.getState();
    console.log("Token obtenido del store:", token);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    console.log("URL generada para la traducción:", url);
    console.log("Cuerpo de la solicitud:", {
      sourceLanguage,
      targetLanguage,
      originalText,
    });

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ sourceLanguage, targetLanguage, originalText }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error en la respuesta del backend:", errorData);

      if (response.status === 403) {
        throw new Error("No tienes permiso para realizar esta acción.");
      } else if (response.status === 500) {
        throw new Error("Error interno del servidor. Inténtalo más tarde.");
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Respuesta del backend (JSON):", data);
      return data.translatedText || "No se pudo obtener la traducción";
    } else {
      const textData = await response.text();
      console.log("Respuesta del backend (Texto):", textData);
      return textData;
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Error desconocido al traducir el contenido.");
    } else {
      throw new Error("Error desconocido al traducir el contenido.");
    }
  }
};