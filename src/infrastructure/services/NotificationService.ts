import { useAuthStore } from "../store/AuthStore";
import type { NotificationDTO } from "../../domain/dto/NotificationDTO";

export async function getUserNotifications(userId: number): Promise<NotificationDTO[]> {
  const token = useAuthStore.getState().token;
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/notification/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  if (!response.ok) throw new Error("Error al obtener notificaciones");
  return response.json();
}

export async function markNotificationAsRead(notificationId: number): Promise<boolean> {
  const token = useAuthStore.getState().token;
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/notification/update-read/${notificationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  if (!response.ok) throw new Error("Error al marcar como leída");
  return response.json();
}