interface ScrollArrowProps {
  direction: "left" | "right";
  onClick: () => void;
  isVisible: boolean;
}

const ScrollArrow: React.FC<ScrollArrowProps> = ({ direction, onClick, isVisible }) => {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      aria-label={`Scroll hacia ${direction === "left" ? "la izquierda" : "la derecha"}`}
      className={`absolute ${direction === "left" ? "left-2" : "right-2"} top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:scale-110 transition`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
};

export default ScrollArrow;