import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdvancedTools from "../../components/addChapter/AdvancedTools";
import { addChapter, getWorkById } from "../../services/chapterService";
import ChapterEditor from "../../components/addChapter/ChapterEditor";
import { handleError } from "../../utils/errorHandler";
import ChapterActions from "../../components/addChapter/ChapterActions";
import PublishOptions from "../../components/addChapter/PublishOptions";
import InspirationBubble from "../../components/addChapter/InspirationBubble";

export default function AddChapter() {
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [error, setError] = useState("");
  const [work, setWork] = useState<any>(null); // estado para la obra
  const [loading, setLoading] = useState(true); // estado de carga
  const [publishAt, setPublishAt] = useState<string | null>(null); // Estado para la fecha y hora de publicación

  const navigate = useNavigate();
  const { id } = useParams(); // id de la URL → /works/:id/add-chapter

  useEffect(() => {
    const fetchWork = async () => {
      try {
        setLoading(true);
        const found = await getWorkById(Number(id));
        if (!found) {
          setError("Obra no encontrada.");
          setLoading(false);
          return;
        }
        setWork(found);
      } catch (err) {
        console.error(err);
        setError("Error al cargar la obra. Por favor, inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchWork();
  }, [id, navigate]);

  const handlePublish = async () => {
    setError("");
    try {
      if (!chapterTitle.trim() || !chapterContent.trim()) {
        setError("El título y el contenido son obligatorios.");
        return;
      }

      console.log("Datos enviados para publicar:", {
        workId: Number(id),
        chapterTitle,
        chapterContent,
        publishAt,
        isDraft: false,
      });

      await addChapter(Number(id), chapterTitle, chapterContent, publishAt || undefined, false); // isDraft: false
      navigate(`/ManageWork/${id}`);
    } catch (err) {
      console.error(err);
      setError(handleError(err));
    }
  };

  const handleSaveDraft = async (titulo: string, contenido: string) => {
    setError("");
    try {
      if (!titulo.trim() || !contenido.trim()) {
        setError("El título y el contenido son obligatorios.");
        return;
      }

      console.log("Datos enviados para guardar borrador:", {
        workId: Number(id),
        titulo,
        contenido,
        publishAt: undefined,
        isDraft: true,
      });

      await addChapter(Number(id), titulo, contenido, undefined, true); // isDraft: true
      setError("Borrador guardado con éxito.");
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

  if (!work) {
    return null;
  }

  const chapterNumber = work?.chapters?.length ? work.chapters.length + 1 : 1; // Calculamos el número del capítulo

  return (
    <div className="min-h-screen bg-[#F4F0F7] px-4 sm:px-8 md:px-16 py-8">
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-white mb-8">

        <div className="bg-white border-b border-[#e4e2eb] h-14 flex items-center ">
          <div className="px-4 sm:px-8 md:px-16 mx-auto flex justify-between items-center w-full">
            <div className="flex items-center gap-3 p-6">
              <div className="w-8 h-8 bg-[#1a2fa1] rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">?</span>
              </div>
              <h2 className="text-gray-900 font-semibold text-base">
                ¿Tenés dudas? <span className="font-normal">Dejanos darte algunos consejos</span>
              </h2>
            </div>

            <a href="#" className="text-gray-400 hover:text-gray-600 underline text-sm">
              Normativas de contenido
            </a>
          </div>
        </div>



      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-[3] rounded-2xl  p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-9">
            Título de la serie: <span className="font-semibold">{work?.title || "Obra no encontrada"}</span>
          </h2>

          <div className="border-2 border-[#4C3B63] rounded-xl overflow-hidden mb-6">
            <ChapterEditor
              chapterTitle={chapterTitle}
              setChapterTitle={setChapterTitle}
              chapterContent={chapterContent}
              setChapterContent={setChapterContent}
              chapterNumber={chapterNumber} // Pasamos chapterNumber como prop
            />
          </div>

          <ChapterActions
            onSaveDraft={({ titulo, contenido }) => handleSaveDraft(titulo, contenido)}
            onPreview={() => console.log("Vista previa activada")}
            formData={{ titulo: chapterTitle, contenido: chapterContent }} // Pasamos los datos dinámicos
          />

          <PublishOptions onScheduleChange={(isoDate) => {
            setPublishAt(isoDate);
            console.log("Fecha y hora programadas:", isoDate);
          }} />


          <button
            onClick={() => handlePublish()}
            className=" px-6 py-2 bg-[#172FA6] text-white rounded-lg shadow hover:bg-blue-800"
          >
            Publicar
          </button>

          {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
        </div>

        <div className="flex-[2] lg:max-w-[400px]">
          <h3 className="text-center font-semibold mb-4 text-xl">Herramientas avanzadas</h3>
          <label className="flex items-center space-x-2 mb-6">
            <span>Permitir traducción con IA</span>
            <input type="checkbox" defaultChecked />
          </label>

          <div className="w-full">
            <AdvancedTools />
          </div>

        </div>


      </div>
      <InspirationBubble />
    </div>
  );
}