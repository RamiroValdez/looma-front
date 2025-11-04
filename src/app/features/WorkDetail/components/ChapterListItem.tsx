import React from "react";
import  type {ChapterDTO } from "../../../../domain/dto/ChapterDTO";
import Button from "../../../components/Button";
import LikeButton from "../../../components/LikeButton";

interface ChapterListItemProps {
  chapter: ChapterDTO;
  index: number;
  onClick: () => void;
  disabled?: boolean;
  onAcquire?: () => void;
  workId: number; 
}

export const ChapterListItem: React.FC<ChapterListItemProps> = ({
  chapter,
  index,
  onClick,
  disabled = false,
  onAcquire,
  workId,
}) => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const formattedDate = chapter.publishedAt
    ? new Date(chapter.publishedAt).toLocaleDateString("es-AR", dateOptions).replace(".", "")
    : "Sin fecha";

  return (
    <div
      className={`p-4 transition duration-150 border-b border-gray-200 last:border-b-0 flex items-center justify-between ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
      }`}
      aria-disabled={disabled}
      onClick={() => {
        if (disabled) return;
        console.log("Se hizo clic en el capítulo:", chapter);
        onClick();
      }}
    >
      <div className="flex items-center space-x-2">
        <span className="font-medium text-gray-800">{`Episodio ${index}`}</span>
      </div>

      <span className="text-sm text-gray-500">{formattedDate}</span>

       <div className="flex items-center gap-1 text-gray-500 min-w-[70px]">
<div onClick={(e) => e.stopPropagation()}>
  <LikeButton
    workId={workId}
    chapterId={chapter.id}
    initialLiked={chapter.likedByUser}
    initialCount={chapter.likes}
    type="chapter"
    disabled={disabled}
  />
</div>

  </div>
      {disabled && (
        <div className="ml-4">
          <Button
            text="Adquirir Capitulo"
            onClick={(e) => {
              e.stopPropagation();
              if (onAcquire) onAcquire();
            }}
            colorClass="bg-[#5c17a6] text-white px-3 py-1 rounded-md cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
