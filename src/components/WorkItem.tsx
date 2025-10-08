import { useNavigate } from 'react-router-dom';
import type { WorkDTO } from '../dto/WorkDTO';
import Tag from './Tag';

export const WorkItem = ({ work }: { work: WorkDTO}) => {
    
    const navigate = useNavigate(); 
    
    const handleClick = () => {
        navigate(`/Work=${work.id}`);
    };
    return (
         <div 
        className="flex items-start p-4 mb-4 rounded-lg w-full bg-[#E2DFEA] cursor-pointer hover:scale-[1.01] hover:shadow-lg"
        onClick={handleClick}
    >
            <img 
                src={work.coverUrl} 
                alt={`Portada de ${work.title}`} 
                className="w-24 h-32 object-cover mr-4 rounded" 
            />
            <div className="flex-1">
                <h3 className="text-xl font-bold text-[#474747] mb-1">{work.title}</h3>
                <p className="text-[#474747] text-sm mb-2 line-clamp-2">{work.description}</p>
                 
               <div className="flex flex-wrap gap-2 my-2">
                    {work.categories.map((category) => (
                        <Tag
                            key={category.id} 
                            text={category.name}
                            colorClass="bg-[#172FA6] text-[#FFFFFF] font-semibold" 
                        />
                    ))}
                </div>
                <p className="text-sm text-[#474747]">Fecha de creación: {work.publicationDate}</p>
            </div>
        </div>
    );
};