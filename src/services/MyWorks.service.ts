// src/services/workService.ts

import type { Work } from '../dto/MyWorksDTO'; 

const WORKS_JSON_URL = '/works.json'; 

/**
 * Obtiene todas las obras y las filtra por el ID de creador proporcionado.
 * * @param creatorId El ID del usuario cuyas obras se deben buscar.
 * @returns Una promesa que resuelve con un array de obras filtradas.
 */
    export async function fetchMyWorks(creatorId: number): Promise<Work[]> {
    
    // Aquí el fetch es igual (asumimos que la API no filtra aún)
    const response = await fetch(WORKS_JSON_URL);
    
    if (!response.ok) {
        throw new Error('Error de red al cargar las obras. Estado: ' + response.status);
    }
    
    const allWorks: Work[] = await response.json(); 

    const myWorks = allWorks.filter(work => work.creator_id === creatorId);
    return myWorks;
}