import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChapterDTO } from '../dto/WorkDTO';
import Button from './Button';

interface ChapterItemProps {
  chapter: ChapterDTO;
  workId: number;
}

export const ChapterItem: React.FC<ChapterItemProps> = ({ chapter, workId }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/chapter/work/${workId}/edit/${chapter.id}`);
  };

  const handleConfigure = () => {
    navigate(`/chapter/${chapter.id}/configure`);
  };

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'text-green-600' : 'text-yellow-600';
  };

  const getStatusText = (status: string) => {
    return status === 'published' ? 'Publicado' : 'Borrador';
  };

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200">
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-medium">{chapter.title}</span>
          <div className="text-xs flex gap-4">
            <span className={`font-semibold ${getStatusColor(chapter.status)}`}>
              {getStatusText(chapter.status)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        <Button 
          text="Editar"
          onClick={handleEdit}
          colorClass="bg-white border border-[#5C17A6] !text-[#5C17A6] text-sm px-3 py-1 hover:bg-purple-50 focus:ring-2 focus:ring-[#5C17A6] cursor-pointer"
        />
        <Button
          text="Eliminar"
          onClick={handleConfigure}
          colorClass="bg-transparent border-0 text-red-600 hover:text-red-800 cursor-pointer text-sm px-3 py-1"
        />
      </div>
    </div>
  );
};

export default ChapterItem;