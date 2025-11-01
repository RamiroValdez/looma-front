export async function sendRating(workId: number, rating: number) {
  // reemplazar la URL
  const response = await fetch(`/api/works/${workId}/rating`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating }),
  });
  if (!response.ok) throw new Error("Error al enviar la valoración");
  return response.json();
}