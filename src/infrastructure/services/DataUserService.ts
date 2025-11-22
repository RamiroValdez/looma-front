import { type UserDTO } from "../../domain/dto/UserDTO";
import { useAuthStore } from "../store/AuthStore";

export async function getCurrentUser(tokenParam?: string): Promise<UserDTO | null> {
  try {
    const token = tokenParam || useAuthStore.getState().token;
    if (!token) return null;

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_AUTH_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    
    if (!response.ok) {

      return null;
    }

    const data = await response.json();
    
    const mapped: UserDTO = {
      id: String(data.id),
      name: data.name,
      surname: data.surname,
      username: data.username,
      email: data.email,
      image: data.photo ?? "",
    };
    return mapped;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
}