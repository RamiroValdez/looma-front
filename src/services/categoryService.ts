import { type CategoryDTO } from "../dtos/category.dto";

export async function getCategorias(): Promise<CategoryDTO[]> { //mockeadas
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

export async function getAllCategories(): Promise<CategoryDTO[]> { //metodo del back
  try {
    const response = await fetch("/api/category/obtain-all");

    if (!response.ok) {
      throw new Error(`Error al obtener categorías: ${response.statusText}`);
    }

    const data = await response.json();
    return data as CategoryDTO[];
  } catch (error) {
    console.error("Error al obtener las categorías desde el backend:", error);
    throw error;
  }
}