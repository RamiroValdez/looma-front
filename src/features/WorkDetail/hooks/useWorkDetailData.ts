import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { WorkService } from '../../../services/workService';
import {type WorkDTO } from '../../../dto/WorkDTO';

export const useWorkDetailData = () => {

  const { workId } = useParams<{ workId: string }>(); 
  const idAsNumber = parseInt(workId || '0'); 

  const [work, setWork] = useState<WorkDTO | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
 
    if (idAsNumber === 0) { 
        setIsLoading(false);
        setError("ID de obra no válido en la URL.");
        return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Ejecución concurrente de las dos llamadas al Service
          const workData = await WorkService.getWorkDetail(idAsNumber);
        
        setWork(workData);
      } catch (e) {
        setError("Ocurrió un error al cargar los detalles de la obra.");
        console.error("Error de carga:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idAsNumber]); 

  return { work,  isLoading, error };
};