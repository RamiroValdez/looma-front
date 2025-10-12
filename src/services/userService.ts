import userData from "../../public/data/userData.json";
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
      const user = userData.find((u: UserData) => u.userId === userId);
      if (user) {
        resolve(user);
      } else {
        reject(new Error(`Usuario con ID ${userId} no encontrado`));
      }
    }, 500); 
  });
};

export const getUserReadingList = async (userId: number) => {
  const response = await fetch("/data/readingList.json");

  if (!response.ok) {
    throw new Error(`Error al obtener la lista de lectura: ${response.statusText}`);
  }

  const data = await response.json();
  const userData = data.find((user: { userId: number }) => user.userId === userId);
  return userData ? userData.books : []; 
};
