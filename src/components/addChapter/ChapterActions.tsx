interface Props {
  onPreview?: () => void;
  onSaveDraft?: (data: { titulo: string; contenido: string }) => void;
  formData: { titulo: string; contenido: string }; 
}

export default function ChapterActions({ onPreview, onSaveDraft, formData }: Props) {
  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(formData); 
    } else {
      console.warn("Función onSaveDraft no proporcionada.");
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    } else {
      console.warn("Función onPreview no proporcionada.");
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <button
        onClick={handlePreview}
        className="px-4 py-2 bg-[#591b9b] text-white rounded-lg shadow hover:bg-purple-800"
      >
        Vista previa
      </button>
      <button
        onClick={handleSaveDraft}
        className="px-4 py-2 bg-[#4C3B63] text-white rounded-lg shadow hover:bg-[#3b2c4e]"
      >
        Guardar borrador
      </button>
    </div>
  );
}
