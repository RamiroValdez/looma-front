import React from "react";
import { type WorkDTO } from "../../../dto/WorkDTO";

interface WorkInfoProps {
  work: WorkDTO;
  manageFirstChapter: () => void;
}

export const WorkInfo: React.FC<WorkInfoProps> = ({ work, manageFirstChapter }) => {
  const likesFormatted = work.likes >= 1000 ? (work.likes / 1000).toFixed(1) + "k" : work.likes;

  return (
    <div className="p-8 bg-white space-y-6 ">
         <div className="flex flex-wrap gap-3">
        <button disabled={true} className=" disabled:opacity-50 cursor-not-allowed flex-1 bg-[#3c2a50] text-white py-2 rounded-lg text-sm">
          Guardar
        </button>
        <button disabled={true} className="flex-1 bg-[#5c17a6] text-white py-2 rounded-lg text-sm  disabled:opacity-50 cursor-not-allowed">
          Suscribirse
        </button>
  
      </div>

      <div className="flex items-center gap-6 ">
        <div className="flex items-center gap-2 text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c026d3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="text-[16px] font-semibold text-gray-700">{likesFormatted}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <path d="M20 8v6M23 11h-6" />
          </svg>
          <span className="text-[16px] font-semibold text-gray-700">1.7k</span>
        </div>
         <button disabled={true} className="flex-1 bg-[#172fa6] text-white py-2 rounded-lg text-sm disabled:opacity-50 cursor-not-allowed">
          Exportar EPUB
        </button>
      </div>

      <p className="text-gray-700 leading-relaxed text-[15px]">{work.description}</p>

      <div className="flex flex-wrap gap-2">
        {work.categories.map((category) => (
          <span
            key={category.id}
            className="bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-100 transition text-sm font-medium"
          >
            {category.name}
          </span>
        ))}
      </div>

      <button onClick={manageFirstChapter} className="w-full bg-[#5c17a6] text-white py-3 rounded-lg text-base font-semibold hover:bg-[#3c2a50] transition cursor-pointer">
        Primer capítulo →
      </button>
    </div>
  );
};
