import { useState } from "react";
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

export const WorkItemSearch = ({ work }: { work: WorkCardDto }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/work/${work.id}`);
  };

  return (
    <div
      className="relative z-[2] rounded-2xl overflow-hidden shadow-md w-[210px] h-[280px] bg-white hover:scale-104 transition-transform duration-300 cursor-pointer"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen de fondo */}
      <img
        src={work.cover}
        alt={work.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay base: gradiente sutil desde abajo (solo sin hover) */}
      {!isHovered && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 to-transparent" />
      )}

      {/* Overlay hover: oscurecimiento uniforme sin gradiente */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none bg-black/90" />
      )}

      {/* Contenido superpuesto */}
      <div className="relative z-10 flex flex-col justify-end h-full p-3 text-white">
        {/* Descripción (visible solo en hover) */}
        {isHovered && (
          <div className="absolute top-0 left-0 right-0 p-3">
            <p className="leading-relaxed line-clamp-6 drop-shadow-md">
              {work.description}
            </p>
          </div>
        )}

        {/* Título centrado (siempre visible, abajo) */}
        <h3 className="font-semibold text-xl leading-tight text-center mb-2 drop-shadow-md line-clamp-2">
          {work.title}
        </h3>

        {/* Metadata debajo del título con altura fija */}
        <div className="min-h-[28px]">
          {!isHovered ? (
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
          ) : (
            <div className="flex flex-wrap justify-center gap-1">
              {work.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="text-xs font-semibold bg-[#172FA6] backdrop-blur-sm text-white px-2 py-0.5 rounded"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
