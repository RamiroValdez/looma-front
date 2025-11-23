import { type ChapterDTO } from "../../../../domain/dto/ChapterDTO";
import React, { useMemo, useState } from "react";
import { ChapterListItem } from "./ChapterListItem";
import { useNavigate } from "react-router-dom";
import ChapterPurchaseModal from "./ChapterPurchaseModal";
import { notifyError } from "../../../../infrastructure/services/ToastProviderService.ts";

interface ChapterListProps {
  chapters: ChapterDTO[];
  originalLanguage: string;
  subscribedToAuthor?: boolean;
  subscribedToWork?: boolean;
  unlockedChapters?: number[]; 
  workId: number;
}

export const ChapterList: React.FC<ChapterListProps> = ({ chapters, originalLanguage, subscribedToAuthor, subscribedToWork, unlockedChapters, workId }) => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<ChapterDTO | null>(null);

  const handleChapterClick = (chapter: ChapterDTO, isUnlocked: boolean) => {
     if (!isUnlocked) {
      openAcquireModal(chapter);
      return;
    }
    const chapterData = {
      ...chapter,
      content: chapter.description || "Contenido no disponible",
      originalLanguage,
    };
    try {
      navigate(`/work/chapter/${encodeURIComponent(JSON.stringify(chapterData.id))}/read`);
    } catch (e) {
      notifyError("No se pudo abrir el capítulo");
    }
  };

  const sortedChapters = useMemo(() => [...chapters].sort((a, b) => a.id - b.id), [chapters]);
  const allUnlocked = Boolean(subscribedToAuthor) || Boolean(subscribedToWork);
  const unlockedSet = useMemo(() => new Set<number>([...(unlockedChapters || [])]), [unlockedChapters]);

  const openAcquireModal = (chapter: ChapterDTO) => {
    setSelectedChapter(chapter);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChapter(null);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden divide-y-2 divide-gray-300">
      {sortedChapters.map((chapter, index) => {
        const displayIndex = index + 1; 
        const isUnlocked = allUnlocked || unlockedSet.has(chapter.id) || chapter.price === 0;
        return (
          chapter.publicationStatus === "PUBLISHED" && (
        <div key={chapter.id} className="py-0">
          <ChapterListItem
            key={chapter.id}
            chapter={chapter}
            index={displayIndex}
            disabled={!isUnlocked}
            onClick={() => handleChapterClick(chapter, isUnlocked)}
            onAcquire={() => openAcquireModal(chapter)}
            workId={workId}
          />
        </div>
          )
        );
      })}

      <ChapterPurchaseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        chapter={selectedChapter}
        workId={workId}
      />
    </div>
  );
}