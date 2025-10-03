import userData from "../data/userData.json";
import type { BookDTO } from "../dto/BookDTO";

interface UserData {
  userId: number;
  username: string;
  seguirLeyendo: BookDTO[];
  recomendados: BookDTO[];
}

export const getUserData = async (userId: number): Promise<UserData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Buscar el usuario por su ID
      const user = userData.find((u: UserData) => u.userId === userId);
      if (user) {
        resolve(user);
      } else {
        reject(new Error(`Usuario con ID ${userId} no encontrado`));
      }
    }, 500); // Simula un retraso 
  });
};



// Servicio preparado para datos reales 
/*
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
*/