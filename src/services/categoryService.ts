import { type CategoryDTO } from "../dtos/category.dto";

export async function getCategorias(): Promise<CategoryDTO[]> {
  try {
    const response = await fetch("/data/categorias.json"); 

    if (!response.ok) {
      throw new Error(`Error al obtener categorías: ${response.statusText}`);
    }

    const data = await response.json();


    return data as CategoryDTO[];
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    throw error;
  }
}