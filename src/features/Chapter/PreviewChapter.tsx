/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useLocation } from "react-router-dom";
import FooterLector from "../../components/FooterLector";
import { useState } from "react";
import { useLanguages } from "../../services/languageService";
import { translateContent } from "../../services/TranslateService";
import TextViewer from "./TextViewer.tsx";
import {MilkdownProvider} from "@milkdown/react";

const PreviewChapter = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const data = queryParams.get("data");

  let previewData;
  try {
    previewData = data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error al parsear los datos de la vista previa:", error);
    previewData = null;
  }

  if (!previewData) {
    return <p>Error al cargar la vista previa.</p>;
  }

  const { content, numberChapter, originalLanguage } = previewData;

  const { languages } = useLanguages();
  const [translatedContent, setTranslatedContent] = useState(content);
  const [currentLanguage, setCurrentLanguage] = useState(originalLanguage);
  const [isTranslating, setIsTranslating] = useState(false); 

  const sortedLanguages = originalLanguage
    ? [
        { code: originalLanguage, name: "Original" },
        ...languages.filter((lang) => lang.code !== originalLanguage),
      ]
    : languages;

  const handleLanguageChange = async (languageCode: string) => {
    try {
      setIsTranslating(true); 
      const translated = await translateContent(currentLanguage, languageCode, content);
      setTranslatedContent(translated);
      setCurrentLanguage(languageCode);
    } catch (error: any) {
      console.error("Error al traducir el contenido:", error);
      alert(`No se pudo traducir el contenido. Detalles: ${error.message}`);
    } finally {
      setIsTranslating(false); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 px-4 py-9 bg-white flex flex-col overflow-y-auto pb-18 items-center">
        <h1 className="text-xl mb-4 text-center">Capítulo {numberChapter}</h1>
        <hr className="w-full border-t border-gray-300 mb-6" />
        <div className="max-w-3xl text-base mx-5">
          {isTranslating ? (
            <p className="text-center text-gray-500">Traduciendo contenido...</p> // Mensaje de carga
          ) : (
          <div className="">
              <MilkdownProvider>
                  <TextViewer content={translatedContent}/>
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