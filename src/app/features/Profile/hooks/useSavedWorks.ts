import { useEffect, useState } from "react";
import { GetSavedWorks, SaveWork } from "../../../../infrastructure/services/MySavesService";
import type { WorkCardDto } from "../../../../domain/dto/WorkCardDTO";
import { notifySuccess } from "../../../../infrastructure/services/ToastProviderService";

export function useSavedWorks() {
  const [savedWorks, setSavedWorks] = useState<WorkCardDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedWorks = async () => {
      try {
        const works = await GetSavedWorks();
        setSavedWorks(works as WorkCardDto[]);
      } catch (error) {
        console.error('Error fetching saved works:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSavedWorks();
  }, []);

  const handleRemoveWork = async (workId: number) => {
    try {
      await SaveWork(workId);
      setSavedWorks(prev => prev.filter(work => work.id !== workId));
      notifySuccess("Obra eliminada de tus guardados.");
    } catch (error) {
      console.error('Error removing saved work:', error);
    }
  };

  return { savedWorks, isLoading, handleRemoveWork };
}