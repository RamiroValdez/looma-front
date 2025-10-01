import { useNavigate } from 'react-router-dom';
import type { Work } from '../types/MyWorks.types';

export const WorkItem = ({ work }: { work: Work }) => {
    
    const navigate = useNavigate(); 
    
    const handleClick = () => {
        navigate(`/Work=${work.id}`);
    };
    return (
        <div 
            className="flex items-start p-4 mb-4 border border-black-700 rounded-lg w-full max-w-4xl bg-[#F0EEF6]/50 cursor-pointer hover:bg-[#EAE8F0] transition duration-200"
            onClick={handleClick}
        >
            <img 
                src={work.cover} 
                alt={`Portada de ${work.title}`} 
                className="w-24 h-32 object-cover mr-4 rounded" 
            />
            <div className="flex-1">
                <h3 className="text-xl font-bold text-black mb-1">{work.title}</h3>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{work.description}</p>
                <p className="text-sm text-gray-500">Publicado el: {work.publication_date}</p>
            </div>
        </div>
    );
};