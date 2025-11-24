/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation } from "react-router-dom";
import FooterLector from "../../components/FooterLector.tsx";
import { useState, useEffect } from "react";
import { useLanguages } from "../../../infrastructure/services/LanguageService.ts";
import { translateContent } from "../../../infrastructure/services/TranslateService";
import TextViewer from "./TextViewer.tsx";
import { MilkdownProvider } from "@milkdown/react";

const PreviewChapter = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const data = queryParams.get("data"); // compatibilidad legacy
  const previewId = queryParams.get("previewId");

  // Hooks SIEMPRE al inicio
  const [initialData, setInitialData] = useState<any | null>(null);
  const [loadError, setLoadError] = useState<string>("");
  const { languages } = useLanguages();
  const [translatedContent, setTranslatedContent] = useState<string>("");
  const [currentLanguage, setCurrentLanguage] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);

  // Cargar datos desde localStorage o query legacy
  useEffect(() => {
    let parsed: any | null = null;
    try {
      if (previewId) {
        const raw = localStorage.getItem(`preview:${previewId}`);
        if (!raw) {
          setLoadError("No se encontró información de la vista previa.");
        } else {
          parsed = JSON.parse(raw);
        }
      } else if (data) {
        parsed = JSON.parse(data);
      } else {
        setLoadError("Parámetros inválidos para la vista previa.");
      }
    } catch (e) {
      console.error("Error al obtener datos de vista previa:", e);
      setLoadError("Error al leer datos de la vista previa.");
    }
    setInitialData(parsed);
  }, [previewId, data]);

  // Cuando llegan los datos iniciales, inicializamos contenido y idioma
  useEffect(() => {
    if (initialData) {
      setTranslatedContent(initialData.content || "");
      setCurrentLanguage(initialData.originalLanguage || "");
      // Limpieza opcional del storage para evitar acumulación (solo si se usó previewId)
      if (previewId) {
        try { localStorage.removeItem(`preview:${previewId}`); } catch (e) { /* noop */ }
      }
    }
  }, [initialData, previewId]);

  const handleLanguageChange = async (languageCode: string) => {
    if (!initialData) return;
    try {
      setIsTranslating(true);
      const translated = await translateContent(currentLanguage, languageCode, initialData.content);
      setTranslatedContent(translated);
      setCurrentLanguage(languageCode);
    } catch (error: any) {
      console.error("Error al traducir el contenido:", error);
      alert(`No se pudo traducir el contenido. Detalles: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  // Derivados seguros (se recalculan en cada render)
  const numberChapter = initialData?.numberChapter ?? "";
  const originalLanguage = initialData?.originalLanguage ?? "";

  const sortedLanguages = originalLanguage
    ? [
        { code: originalLanguage, name: "Original" },
        ...languages.filter((lang) => lang.code !== originalLanguage),
      ]
    : languages;

  // Renderizados condicionales (después de declarar todos los hooks)
  if (loadError) {
    return <p>{loadError}</p>;
  }
  if (!initialData) {
    return <p>Cargando vista previa...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 px-4 py-9 bg-white flex flex-col overflow-y-auto pb-18 items-center">
        <h1 className="text-xl mb-4 text-center">Capítulo {numberChapter}</h1>
        <hr className="w-full border-t border-gray-300 mb-6" />
        <div className="max-w-3xl text-base mx-5">
          {isTranslating ? (
            <p className="text-center text-gray-500">Traduciendo contenido...</p>
          ) : (
            <div>
              <MilkdownProvider>
                <TextViewer content={translatedContent} />
              </MilkdownProvider>
            </div>
          )}
        </div>
      </div>
      <FooterLector
        selectedLanguages={sortedLanguages}
        chapterTitle={`Capítulo ${numberChapter}`}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
};

export default PreviewChapter;

