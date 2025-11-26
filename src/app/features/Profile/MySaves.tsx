import { useSavedWorks } from "./hooks/useSavedWorks";
import { WorkItemSaves } from "../../components/WorkItemSaves";

export const MySaves = () => {
  const { savedWorks, isLoading, handleRemoveWork } = useSavedWorks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full">
        <div className="text-center p-8">Cargando obras guardadas...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 container p-4 flex flex-col mx-auto text-center sm:text-left">
      <h2 className="text-2xl font-bold mb-6 text-[#000000]">Mis Obras Guardadas</h2>
      <div className="flex flex-row flex-wrap gap-6 mt-2 text-left justify-center sm:justify-start">
        {savedWorks.map((work) => (
          <WorkItemSaves key={work.id} work={work} onRemove={handleRemoveWork} />
        ))}
      </div>
      {savedWorks.length === 0 && (
        <div className="flex flex-col items-center justify-center p-16 text-gray-500 min-h-[20hv]">
          <img src="/img/triste_1.png" alt="no works" className="w-70 h-70 mb-8" />
          <div>No tienes obras guardadas.</div>
        </div>
      )}
    </div>
  );
};