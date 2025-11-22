import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

interface Category {
  id: number;
  name: string;
}

interface Props {
  position?: number;
  cover: string;
  title: string;
  idWork: number;
  authorName?: string;
  genre?: string;
  format?: string;
  likesCount?: number;
  description?: string;
  categories?: Category[];
}

const TopBookCard: React.FC<Props> = ({ 
  position, 
  cover, 
  title, 
  idWork, 
  format,
  likesCount,
  description,
  categories = []
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/work/${idWork}`);
  };

  return (
    <div className="relative z-[2] w-[210px] h-[280px]">
      {position && (
        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border-2 border-[#172fa6] flex items-center justify-center z-20 transition-opacity duration-300 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}>
          <span className="text-[#172fa6] font-bold text-lg">#{position}</span>
        </div>
      )}
      
      <div 
        className="relative z-10 rounded-2xl overflow-hidden shadow-md w-full h-full bg-white hover:scale-104 transition-transform duration-300 cursor-pointer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={cover}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {!isHovered && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 to-transparent" />
        )}

        {isHovered && (
          <div className="absolute inset-0 pointer-events-none bg-black/90" />
        )}

        <div className="relative z-10 flex flex-col justify-end h-full p-3 text-white">
          {isHovered && description && (
            <div className="absolute top-0 left-0 right-0 p-3">
              <p className="leading-relaxed line-clamp-6 drop-shadow-md text-sm">
                {description}
              </p>
            </div>
          )}

          <h3 className="font-semibold text-xl leading-tight text-center mb-3 drop-shadow-md line-clamp-2">
            {title}
          </h3>

          <div className="min-h-[28px]">
            {!isHovered ? (
              <div className="flex items-center justify-between text-sm">
                {likesCount !== undefined && (
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
                    <span className="font-semibold drop-shadow-md text-base text-white">{likesCount}</span>
                  </div>
                )}
                
                {format && (
                  <span className={`px-2 py-1 text-sm font-semibold text-white rounded-full whitespace-nowrap ${getFormatBgByName(format)}`}>
                    {format}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="px-3 py-1 text-sm font-semibold text-white bg-blue-600/80 rounded-full whitespace-nowrap"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBookCard;

