import React from "react";
import { type ChapterDTO } from "../../../dto/ChapterDTO";

interface ChapterListItemProps {
  chapter: ChapterDTO;
  index: number;
  onClick: () => void;
}

export const ChapterListItem: React.FC<ChapterListItemProps> = ({
  chapter,
  index,
  onClick,
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
      className="p-4 transition duration-150 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
      onClick={() => {
        console.log("Se hizo clic en el capítulo:", chapter);
        onClick();
      }}
    >
      <div className="flex items-center space-x-2">
        <span className="font-medium text-gray-800">{`Episodio ${index}`}</span>
      </div>

      <span className="text-sm text-gray-500">{formattedDate}</span>

       <div className="flex items-center gap-1 text-gray-500 min-w-[70px]">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    <span className="text-sm">{chapter.likes.toLocaleString()}</span>
  </div>
    </div>
  );
};
