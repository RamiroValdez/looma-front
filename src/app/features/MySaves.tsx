import { useEffect, useState} from "react";
import { GetSavedWorks } from "../../infrastructure/services/MySavesService";
import type { WorkCardDto } from "../../domain/dto/WorkCardDTO";
import { WorkItemSaves } from "../components/WorkItemSaves";

export const MySaves = () => {
  const [savedWorks, setSavedWorks] = useState<WorkCardDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedWorks = async () => {
      try {
        const works = await GetSavedWorks();
        console.log("Obras guardadas:", works);
        setSavedWorks(works as WorkCardDto[]);
      } catch (error) {
        console.error('Error fetching saved works:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedWorks();
  }, []);

  const handleRemoveWork = (workId: number) => {
    setSavedWorks(prev => prev.filter(work => work.id !== workId));
  };

  if (isLoading) {
    return <div className="text-center p-8">Cargando obras guardadas...</div>;
  }

  return (
    <div className="container p-4 flex flex-col mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#000000]">Mis Obras Guardadas</h2>
      <div className="flex flex-row gap-12 mt-2">
      {savedWorks.map((work) => (
        <WorkItemSaves key={work.id} work={work} onRemove={handleRemoveWork} />
      ))}
      </div>
      {savedWorks.length === 0 && (
      <div className="flex flex-col items-center justify-center p-16 text-gray-500">
        <img src="/img/triste_1.png" alt="no works" className="w-40 h-40 mb-8" />
        <div>No tienes obras guardadas.</div>
      </div>
    )}
    </div>
  );
};