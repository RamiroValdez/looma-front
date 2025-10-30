import userData from "../../../public/data/userData.json";
import type { BookDTO } from "../../domain/dto/BookDTO";

interface UserData {
  userId: number;
  username: string;
  seguirLeyendo: BookDTO[];
  recomendados: BookDTO[];
}

// Raw JSON shapes from public/data/userData.json
type RawBook = {
  id: number;
  name: string;
  author: string;
  coverUrl: string;
  categories: string[];
  likes: number;
};

type RawUser = {
  userId: number;
  username: string;
  seguirLeyendo: RawBook[];
  recomendados: RawBook[];
};

export const getUserData = async (userId: number): Promise<UserData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = userData as unknown as RawUser[];
      const raw = users.find((u) => u.userId === userId);
      if (raw) {
        const toBookDTO = (b: RawBook): BookDTO => ({
          id: b.id,
          title: b.name,
          author: b.author,
          cover: b.coverUrl,
          categories: b.categories,
          likes: b.likes,
        });

        const mapped: UserData = {
          userId: raw.userId,
          username: raw.username,
          seguirLeyendo: raw.seguirLeyendo.map(toBookDTO),
          recomendados: raw.recomendados.map(toBookDTO),
        };

        resolve(mapped);
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
