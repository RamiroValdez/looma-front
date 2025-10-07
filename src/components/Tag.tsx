export default function Tag({
  text,
  onClick,
  onRemove,
  colorClass,
}: {
  text: string;
  onClick?: () => void;
  onRemove?: (text: string) => void;
  colorClass: string;
}) {
  const baseClasses = "w-24 px-4 py-1 flex items-center justify-center gap-2 rounded-full text-sm border";

  return (
    <div className={`${baseClasses} ${colorClass}`} onClick={onClick}>
      <span>{text}</span>

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // evita que se dispare el onClick del tag
            onRemove(text);
          }}
          className="text-gray-500 hover:text-red-600 font-bold"
        >
          ×
        </button>
      )}
    </div>
  );
}
