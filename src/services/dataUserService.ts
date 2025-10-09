import { type UserDTO } from "../dtos/user.dto";
import { useAuthStore } from "../store/AuthStore";

export async function getCurrentUser(): Promise<UserDTO | null> {
  try {
    const token = useAuthStore.getState().token;
    if (!token) return null;

    const response = await fetch("http://localhost:8080/api/auth/me", {
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
      email: data.email,
      image: data.photo ?? "",
    };
    return mapped;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
}