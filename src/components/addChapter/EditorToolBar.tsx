// ...existing code...
import { useRef, useState } from "react";

export default function EditorToolbar({
  onImportFile,
}: {
  onImportFile?: (file: File) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const triggerFile = () => inputRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name.toLowerCase();
    if (!name.endsWith(".doc") && !name.endsWith(".docx")) {
      alert("Formato no soportado. Solo .doc o .docx");
      e.currentTarget.value = "";
      return;
    }
    if (!onImportFile) return;
    setLoading(true);
    try {
      await onImportFile(file);
    } catch (err) {
      console.error(err);
      alert("Error al importar el archivo.");
    } finally {
      setLoading(false);
      e.currentTarget.value = "";
    }
  };

  return (
    <div className="flex items-center space-x-3 bg-[#4C3B63] text-white px-4 py-2 text-sm">
      <button className="hover:text-gray-200">≡</button>
      <button className="hover:text-gray-200">≡≡</button>
      <button className="hover:text-gray-200">≡≡≡</button>
      <div className="flex items-center space-x-3 ml-4">
        <button className="font-bold hover:text-gray-200">B</button>
        <button className="italic hover:text-gray-200">I</button>
        <button className="underline hover:text-gray-200">U</button>
        <button className="hover:text-gray-200">A</button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFile}
      />

      <button
        onClick={triggerFile}
        className="ml-auto bg-white text-black font-bold px-3 py-1 rounded-md hover:bg-[#5C17A6] hover:text-white cursor-pointer hover:scale-103 transition"
        disabled={loading}
      >
        {loading ? "Importando capítulo..." : "Subir capítulo (.doc/.docx)"}
      </button>
    </div>
  );
}
