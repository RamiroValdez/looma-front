import React from "react";
import { type ChapterDTO } from "../../../../domain/dto/ChapterDTO";
import { ChapterListItem } from "./ChapterListItem";
import { useNavigate } from "react-router-dom";

interface ChapterListProps {
  chapters: ChapterDTO[];
  originalLanguage:string;
}

export const ChapterList: React.FC<ChapterListProps> = ({ chapters,originalLanguage }) => {
  const navigate = useNavigate();

const handleChapterClick = (chapter: ChapterDTO) => {
  const chapterData = {
    ...chapter,
    content: chapter.description|| "Contenido no disponible",
    originalLanguage,
  };

  navigate(`/work/chapter/${encodeURIComponent(JSON.stringify(chapterData.id))}/read`);
};

const sortedChapters = [...chapters].sort((a, b) => a.id - b.id);

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {sortedChapters.map((chapter, index) => (
        <ChapterListItem
          key={chapter.id}
          chapter={chapter}
          index={index +1}
          onClick={() => handleChapterClick(chapter)} 
        />
      ))}
    </div>
  );
};
