import { useAuthStore } from "../../domain/store/AuthStore"; 

export async function sendRating(workId: number, rating: number) {
  const token = useAuthStore.getState().token;
  const response = await fetch(`/api/works/${workId}/ratings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ rating }),
  });
  if (!response.ok) throw new Error("Error al enviar la valoración");
  return response.json();
}

export async function getWorkRatings(workId: number, page: number = 0, size: number = 10) {
  const response = await fetch(`/api/works/${workId}/ratings?page=${page}&size=${size}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("No se pudo obtener las valoraciones de la obra");
  return response.json();
}
