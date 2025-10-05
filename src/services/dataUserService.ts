import { type UserDTO } from "../dtos/user.dto";
import users from "../../public/data/userData.json"; 

const loggedInEmail = "usuario123@example.com"; //// simulacion de la identidad del usuario que está logueado

export async function getCurrentUser(): Promise<UserDTO | null> {
  try {
    
    await new Promise(resolve => setTimeout(resolve, 200));

    const currentUser = users.find(u => u.email === loggedInEmail); 
    return currentUser ?? null;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
}

/* SE VA A CONECTAR CUANDO ESTE EL ENDPOINT DEL BACKEND

import { type UserDTO } from "../dtos/user.dto";

export async function getCurrentUser(): Promise<UserDTO | null> {
  const token = localStorage.getItem("token"); // el token que guardaste al login
  if (!token) return null; // si no hay token, no hay usuario logueado

  try {
    const response = await fetch("http://localhost:3000/api/users/current", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null; // token inválido o expirado
    }

    const data: UserDTO = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
}
*/