/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import  type {ChapterDTO } from "../../../../domain/dto/ChapterDTO";
import Button from "../../../components/Button";

interface ChapterListItemProps {
  chapter: ChapterDTO;
  index: number;
  onClick: () => void;
  disabled?: boolean;
  onAcquire?: () => void;
}

export const ChapterListItem: React.FC<ChapterListItemProps> = ({
  chapter,
  index,
  onClick,
  disabled = false,
  onAcquire,
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
        disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
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
        
        {disabled && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4 text-black">
        <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
        </svg>
          )}                                                          
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
