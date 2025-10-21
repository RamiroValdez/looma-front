import type { WorkDTO } from '../dto/WorkDTO';
import { MOCK_WORK_DATA } from '../features/WorkDetail/services/mockData';
import { getWorkById as getWorkByIdFromChapterService } from './chapterService';

export class WorkService {

 static async getWorkDetail(id: number): Promise<WorkDTO> {
    return getWorkByIdFromChapterService(id); 
  }

/* METODO QUE PRUEBA EL MOCKEADOOO 
  static async getWorkDetail(workId: number): Promise<WorkDTO> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      if (workId!== MOCK_WORK_DATA.id) {
        throw new Error("Error 404: Obra no encontrada (Simulación).");
      }
      
      return MOCK_WORK_DATA; 

    } catch (error) {
      console.error('Error fetching work detail:', error);
      throw new Error('No se pudo establecer conexión con el servidor.');
    }
  }*/

  static async getWorkById(id: number): Promise<WorkDTO> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const response = await fetch(`/data/work-${id}.json`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Could not load work`);
      }
      
      const workData: WorkDTO = await response.json();
      
      return workData;
      
    } catch (error) {
      console.error('Error fetching work:', error);
      throw new Error('Could not load work information');
    }
  }
  
  static async getWorkByIdFromAPI(id: number): Promise<WorkDTO> {
    try {
      const response = await fetch(`/api/works/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const workData: WorkDTO = await response.json();
      return workData;
      
    } catch (error) {
      console.error('Error fetching work from API:', error);
      throw new Error('Server connection error');
    }
  }
}

export const getTop10Works = async () => {
  const response = await fetch("/data/top10Work.json");

  if (!response.ok) {
    throw new Error(`Error al obtener el Top 10: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

