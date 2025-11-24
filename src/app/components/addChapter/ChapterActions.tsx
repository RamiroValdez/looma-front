interface Props {
  onPreview?: () => void;
  publicationStatus: string;
}

export default function ChapterActions({ onPreview, publicationStatus }: Props) {
  const handlePreview = () => {
    if (onPreview) onPreview();
  };
  const isDraft = publicationStatus === 'DRAFT';
  return (
    <div className="">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handlePreview}
          className="px-4 py-2 bg-[#591b9b] text-white rounded-full font-semibold shadow hover:bg-purple-800 cursor-pointer"
        >
          Vista previa
        </button>
      </div>
      {!isDraft && (
        <p className="text-xs text-gray-600 w-full sm:text-left">
    Solo se puede editar cuando el capítulo está en estado <span className="font-semibold">DRAFT</span>.
  </p>
)}
    </div>
  );
}
