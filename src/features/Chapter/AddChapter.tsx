import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdvancedTools from "../../components/addChapter/AdvancedTools";
import ChapterEditor from "../../components/addChapter/ChapterEditor";
import ChapterActions from "../../components/addChapter/ChapterActions";
import PublishOptions from "../../components/addChapter/PublishOptions";
import InspirationBubble from "../../components/addChapter/InspirationBubble";
import { getWorkById, updateChapter } from "../../services/chapterService";
import { handleError } from "../../utils/errorHandler";
import { type ChapterDTO } from "../../dto/ChapterDTO";

export default function AddChapter() {
  const navigate = useNavigate();
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();

  const [work, setWork] = useState<any>(null);
  const [chapter, setChapter] = useState<ChapterDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWorkAndChapter = useCallback(async () => {
    try {
      setLoading(true);
      const found = await getWorkById(Number(id));
      if (!found) {
        throw new Error("Obra no encontrada.");
      }
      setWork(found);
      const existingChapter = found.chapters?.find(
        (c: any) => c.id === Number(chapterId)
      );
      if (!existingChapter) {
        throw new Error("Capítulo no encontrado.");
      }

      setChapter({
        id: existingChapter.id,
        title: existingChapter.title,
        description: existingChapter.description,
        price: 0,
        likes: 0,
        lastModified: existingChapter.lastModified || new Date().toISOString(),
        publishedAt: existingChapter.publishedAt || "",
        status: existingChapter.status || "draft",
      });
    } catch (err) {
      console.error(err);
      setError(handleError(err) || "Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  }, [id, chapterId]);

  useEffect(() => {
    fetchWorkAndChapter();
  }, [fetchWorkAndChapter]);

  const handleFieldChange = (field: keyof ChapterDTO, value: any) => {
    if (!chapter) return;
    setChapter({ ...chapter, [field]: value });
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!chapter || !work) return;
    setError("");

    try {
      if (!chapter?.title?.trim() || !chapter?.description?.trim()) {
        setError("El título y el contenido son obligatorios.");
        return;
      }

      const chapterData: ChapterDTO = {
        ...chapter,
        lastModified: new Date().toISOString(),
        status,
      };

      const response = await updateChapter(
        Number(id),
        chapterData.id,
        chapterData.title,
        chapterData.description,
        chapterData.publishedAt
      );
      console.log("Capítulo actualizado:", response);
      if (response?.fetchStatus === 200) {
        // alguna anotacion de que está todo OK y mandamos al managework con el nuevo capítulo
        // tenemos que esperar a la confirmacion de ivone.
        navigate(`/manage-work/${id}`);
      }
      else {
        setError("Error al actualizar el capítulo.");
      }
    } catch (err) {
      console.error(err);
      setError(handleError(err));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F0F7]">
        <p className="text-gray-600 text-lg">Cargando obra...</p>
      </div>
    );
  }

  if (!work || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F0F7]">
        <p className="text-gray-600 text-lg">No se pudo cargar la obra o el capítulo.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F0F7] px-4 sm:px-8 md:px-16 py-8">
      {/* 🔹 Header de consejos */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-white mb-8">
        <div className="bg-white border-b border-[#e4e2eb] h-14 flex items-center ">
          <div className="px-4 sm:px-8 md:px-16 mx-auto flex justify-between items-center w-full">
            <div className="flex items-center gap-3 p-6">
              <div className="w-8 h-8 bg-[#1a2fa1] rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">?</span>
              </div>
              <h2 className="text-gray-900 font-semibold text-base">
                ¿Tenés dudas? Dejanos darte algunos consejos
              </h2>
            </div>

            <a href="#" className="text-gray-400 hover:text-gray-600 underline text-sm">
              Normativas de contenido
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-[3] rounded-2xl p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-9">
            Título de la serie:{" "}
            <span className="font-semibold">{work?.title || "Obra no encontrada"}</span>
          </h2>

          <div className="border-2 border-[#4C3B63] rounded-xl overflow-hidden mb-6">
            <ChapterEditor
              chapterTitle={chapter.title}
              setChapterTitle={(value) => handleFieldChange("title", value)}
              chapterContent={chapter.description}
              setChapterContent={(value) => handleFieldChange("description", value)}
              chapterNumber={chapter.id}
            />
          </div>

          <ChapterActions
            onSaveDraft={({ titulo, contenido }) =>
              handleSave("draft")
            }
            onPreview={() => console.log("Vista previa activada")}
            formData={{ titulo: chapter.title, contenido: chapter.description }}
          />

          <PublishOptions
            onScheduleChange={(isoDate) => handleFieldChange("publishedAt", isoDate)}
          />

          <button
            onClick={() => handleSave("published")}
            className="px-6 py-2 bg-[#172FA6] text-white rounded-lg shadow hover:bg-blue-800"
          >
            {"Guardar cambios"}
          </button>

          {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
        </div>

        {/* Herramientas */}
        <div className="flex-[2] lg:max-w-[400px]">
          <h3 className="text-center font-semibold mb-4 text-xl">
            Herramientas avanzadas
          </h3>
          <label className="flex items-center space-x-2 mb-6">
            <span>Permitir traducción con IA</span>
            <input type="checkbox" defaultChecked />
          </label>

          <AdvancedTools />
        </div>
      </div>

      <InspirationBubble />
    </div>
  );
}