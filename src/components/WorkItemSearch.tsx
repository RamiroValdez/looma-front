import { useNavigate } from "react-router-dom";
import type { WorkCardDto } from "../dto/WorkCardDTO";

export const WorkItemSearch = ({work}  : {work: WorkCardDto}) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/work/${work.id}`);
    };

  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition" onClick={handleClick}>
      <img
        src={work.cover}
        alt={work.title}
        className="w-full h-48 object-cover rounded mb-2"
      />
      <h3 className="font-bold text-lg">{work.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{work.description}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-sm">❤️ {work.likes}</span>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{work.format.name}</span>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {work.categories.map((cat) => (
          <span key={cat.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {cat.name}
          </span>
        ))}
      </div>
    </div>
  );

}