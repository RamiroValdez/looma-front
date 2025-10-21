import React from "react";
import { useWorkDetailData } from "./hooks/useWorkDetailData";
import { WorkInfo } from "./components/WorkInfo";
import { ChapterList } from "./components/ChapterList";

export const WorkDetail: React.FC = () => {
  const { work, isLoading, error } = useWorkDetailData();

  if (isLoading)
    return <div className="text-center py-10">Cargando detalles de la obra...</div>;
  if (error)
    return <div className="text-center text-red-600 py-10">Error: {error}</div>;
  if (!work) return <div className="text-center py-10">Obra no encontrada.</div>;

  return (
    <div className="min-h-screen bg-[#f2f0f7]">
      <div
        className="h-72 w-full bg-cover bg-center flex flex-col justify-center items-center text-white relative"
        style={{ backgroundImage: `url(${work.banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-extrabold drop-shadow-md">{work.title}</h1>
          <p className="text-xl font-semibold mt-2 drop-shadow">
            {work.creator.name} {work.creator.surname}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-[-4rem] px-6 relative z-20">
        <div className="flex flex-col md:flex-row shadow-lg  overflow-hidden bg-white">

           <div className="w-full md:w-3/5 p-6">
            <ChapterList chapters={work.chapters} originalLanguage={work.originalLanguage.name} />
          </div>
          <div className="w-full md:w-2/5 border-b md:border-b-0 md:border-r border-gray-200 p-6">
            <WorkInfo work={work} />
          </div>
        </div>
      </div>

      <div className="h-16"></div>
    </div>
  );
};
