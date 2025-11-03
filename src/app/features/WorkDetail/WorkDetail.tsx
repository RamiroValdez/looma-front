import React from "react";
import { useWorkDetailData } from "./hooks/useWorkDetailData";
import { WorkInfo } from "./components/WorkInfo";
import { ChapterList } from "./components/ChapterList";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";

export const WorkDetail: React.FC = () => {
  const { work, isLoading, error } = useWorkDetailData();
  const navigate = useNavigate();
  if (isLoading)
    return <div className="text-center py-10">Cargando detalles de la obra...</div>;
  if (error)
    return <div className="text-center text-red-600 py-10">Error: {error}</div>;
  if (!work) return <div className="text-center py-10">Obra no encontrada.</div>;

  const sortedChapters = [...work.chapters].sort((a, b) => a.id - b.id);
  const allUnlocked = Boolean(work.subscribedToAuthor) || Boolean(work.subscribedToWork);
  const unlockedSet = new Set<number>(work.unlockedChapters || []);

  const firstUnlocked = allUnlocked
    ? sortedChapters[0]
    : sortedChapters.find((_, idx) => unlockedSet.has(idx + 1));

  const handleFirstChapter = () => {
    if (firstUnlocked) {
      navigate(`/work/chapter/${firstUnlocked.id}/read`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f0f7]">
      <div
        className="h-72 w-full bg-cover bg-center flex flex-col justify-center items-center text-white relative"
        style={{ backgroundImage: `url(${work.banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
        <div className="absolute top-4 left-4 z-20">
          <BackButton />
        </div>


        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-extrabold drop-shadow-md">{work.title}</h1>
          <p className="text-xl font-semibold mt-2 drop-shadow">
            {work.creator.name} {work.creator.surname}
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-[-4rem] relative z-20">
        <div className="flex flex-col md:flex-row shadow-lg overflow-hidden bg-white">
          <div className="w-full md:w-2/3 border-r border-gray-300">
            <ChapterList
              chapters={work.chapters}
              originalLanguage={work.originalLanguage.name}
              subscribedToAuthor={work.subscribedToAuthor}
              subscribedToWork={work.subscribedToWork}
              unlockedChapters={work.unlockedChapters}
              workId={work.id}
            />
          </div>
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 p-6">
            <WorkInfo work={work} manageFirstChapter={handleFirstChapter} disableFirstChapter={!firstUnlocked} />
          </div>
        </div>
      </div>
    </div>
  );
};
