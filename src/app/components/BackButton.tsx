import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string; // ruta opcional, si no se pasa vuelve atrás
}

const BackButton = ({ to }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-gray-600 hover:text-[#5C17A6] transition-colors duration-200 group mb-3 cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span className="text-sm font-medium">Volver</span>
    </button>
  );
};

export default BackButton;
