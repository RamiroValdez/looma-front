import { useEffect, useState} from "react";
import { GetSavedWorks } from "../../../infrastructure/services/MySavesService";
import type { WorkCardDto } from "../../../domain/dto/WorkCardDTO";
import { WorkItemSaves } from "../../components/WorkItemSaves";
import ProfileMenu from "./components/ProfileMenu";

export const MySaves = () => {
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

  const handleRemoveWork = (workId: number) => {
    setSavedWorks(prev => prev.filter(work => work.id !== workId));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <ProfileMenu />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">Cargando obras guardadas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <ProfileMenu />
      <div className="flex-1 container p-4 flex flex-col mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-[#000000]">Mis Obras Guardadas</h2>
        <div className="flex flex-row gap-12 mt-2">
        {savedWorks.map((work) => (
          <WorkItemSaves key={work.id} work={work} onRemove={handleRemoveWork} />
        ))}
        </div>
        {savedWorks.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            No tienes obras guardadas.
          </div>
        )}
      </div>
    </div>
  );
};