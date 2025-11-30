import { useNavigate } from "react-router-dom";
import type { WorkCardDto } from "../../domain/dto/WorkCardDTO";

const FORMAT_BG_BY_NAME: Record<string, string> = {
  novela: "bg-emerald-600/80",
  cuento: "bg-sky-600/80",
  poesía: "bg-fuchsia-600/80",
  ensayo: "bg-amber-600/80",
  comic: "bg-indigo-600/80",
  default: "bg-white/20", 
};

function getFormatBgByName(name?: string) {
  if (!name) return FORMAT_BG_BY_NAME.default;
  const key = name.trim().toLowerCase();
  return FORMAT_BG_BY_NAME[key] ?? FORMAT_BG_BY_NAME.default;
}

interface WorkItemSavesProps {
  work: WorkCardDto;
  onRemove: (workId: number) => void;
}

export const WorkItemSaves = ({ work, onRemove }: WorkItemSavesProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/work/${work.id}`);
  };

  const handleRemoveSave = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onRemove(work.id);
  };

  return (
    <div
      className="relative z-[2] rounded-2xl overflow-hidden shadow-md w-[210px] h-[280px] bg-white hover:scale-104 transition-transform duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={work.cover}
        alt={work.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/30"></div>
      
      <button 
        onClick={handleRemoveSave}
        className="absolute top-3 right-3 z-20 hover:scale-110 transition-transform"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="black"
          stroke="white"
          strokeWidth={1.5}
          className="w-6 h-6 drop-shadow-lg hover:fill-white hover:stroke-black hover:cursor-pointer"
        >
          <path 
            fillRule="evenodd" 
            d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
        
      <div className="relative z-10 flex flex-col justify-end h-full p-3 text-white">
        <h3 className="font-semibold text-xl leading-tight text-center mb-2 drop-shadow-md line-clamp-2">
          {work.title}
        </h3>

        <div className="min-h-[28px]">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#c026d3"
                stroke="#c026d3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="font-semibold drop-shadow-md text-base text-white">{work.likes}</span>
            </div>
            <span className={`px-2 py-1 rounded-full font-semibold ${getFormatBgByName(work.format?.name)}`}>
              {work.format.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};