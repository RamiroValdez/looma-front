import React from 'react';
import { useNavigate } from 'react-router-dom';
import type {ChapterDTO } from '../../domain/dto/ChapterDTO';
import Button from '../../app/components/Button';

interface ChapterItemProps {
  chapter: ChapterDTO;
  workId: number;
}

export const ChapterItem: React.FC<ChapterItemProps> = ({ chapter, workId }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/chapter/work/${workId}/edit/${chapter.id}`);
  };

  const getStatusColor = (status: string) => {
    // que el programado tenga otro color
    const statusMap = {
      SCHEDULED: 'text-orange-600',
      PUBLISHED: 'text-green-600',
      DRAFT: 'text-yellow-600',
    };
    return statusMap[status as keyof typeof statusMap] || 'text-yellow-600';
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      SCHEDULED: 'Programado',
      PUBLISHED: 'Publicado',
      DRAFT: 'Borrador',
    };
    return statusMap[status as keyof typeof statusMap] || 'Borrador';
  };

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200">
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-medium">{chapter.title}</span>
          <div className="text-xs flex gap-4">
            <span className={`font-semibold ${getStatusColor(chapter.publicationStatus)}`}>
              {getStatusText(chapter.publicationStatus)}
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
      </div>
    </div>
  );
};

export default ChapterItem;