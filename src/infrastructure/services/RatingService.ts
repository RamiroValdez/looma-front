import { useAuthStore } from "../store/AuthStore";

interface RatingResponseDTO {
    workId: number,
    userId: number,
    rating: number,
    average_rating: number
}

export async function sendRating(workId: number, rating: number): Promise<RatingResponseDTO> {
  const token = useAuthStore.getState().token;
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/works/${workId}/ratings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ rating }),
  });
  if (!response.ok) throw new Error("Error al enviar la valoración");
    const data = await response.json();
    return data as RatingResponseDTO;
}

export async function getRatingsCount(workId: number): Promise<number> {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/works/${workId}/ratings`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!response.ok) throw new Error("Error al obtener el conteo de valoraciones");
    return response.json();
}

export async function getMyRatings(workId: number): Promise<number> {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/works/${workId}/ratings/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!response.ok) throw new Error("Error al obtener el conteo de valoraciones");
    return response.json();
}

