/* eslint-disable @typescript-eslint/no-explicit-any */
import FooterLector from "../../components/FooterLector";
import { useState, useEffect } from "react";
import { useLanguages } from "../../services/languageService";
import { translateContent } from "../../services/TranslateService";
import TextViewer from "../Chapter/TextViewer.tsx";
import { MilkdownProvider } from "@milkdown/react";
import { getChapterById } from "../../services/chapterService.ts";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ReadChapter = () => {
    const navigate = useNavigate();
    const { chapterId } = useParams<{ chapterId: string }>();
    const { data, isLoading, error: errorFetch } = getChapterById(Number(chapterId), "");

    const { languages } = useLanguages();
    const [translatedContent, setTranslatedContent] = useState<string>("");
    const [currentLanguage, setCurrentLanguage] = useState<string>("");
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        if (errorFetch) {
            const status = (errorFetch as any)?.response?.status;
            if (status === 403) {
                navigate(-1);
            }
        }
    }, [errorFetch, navigate]);

    // Establecer contenido original al cargar
    useEffect(() => {
        if (data?.content) {
            setTranslatedContent(data.content);
            setCurrentLanguage(data.languageDefaultCode.code);
        }
    }, [data]);

    const sortedLanguages = data?.languageDefaultCode
        ? [
            { code: data.languageDefaultCode.code, name: "Original" },
            ...languages.filter((lang) => lang.code !== data.languageDefaultCode.code),
        ]
        : languages;

    const handleLanguageChange = async (languageCode: string) => {
        if (!data || languageCode === currentLanguage) return;

        try {
            setIsTranslating(true);
            const translated = await translateContent(currentLanguage, languageCode, data.content);
            setTranslatedContent(translated);
            setCurrentLanguage(languageCode);
        } catch (error: any) {
            console.error("Error al traducir el contenido:", error);
            alert(`No se pudo traducir el contenido. Detalles: ${error.message}`);
        } finally {
            setIsTranslating(false);
        }
    };

    if (isLoading) {
        return <p className="text-center text-gray-500 mt-10">Cargando capítulo...</p>;
    }

    if (!data) {
        return <p className="text-center text-red-500 mt-10">No se pudo cargar el capítulo.</p>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="flex-1 px-4 py-9 bg-white flex flex-col overflow-y-auto pb-18 items-center">
                <h1 className="text-xl mb-4 text-center">Capítulo {data.chapterNumber}</h1>
                <hr className="w-full border-t border-gray-300 mb-6" />
                <div className="max-w-3xl text-base mx-5">
                    {isTranslating ? (
                        <p className="text-center text-gray-500">Traduciendo contenido...</p>
                    ) : (
                        <div className="">
                            <MilkdownProvider>
                                <TextViewer content={translatedContent} />
                            </MilkdownProvider>
                        </div>
                    )}
                </div>
            </div>
            <FooterLector
                selectedLanguages={sortedLanguages}
                chapterTitle={`Capítulo ${data.chapterNumber}`}
                onLanguageChange={handleLanguageChange}
            />
        </div>
    );
};

export default ReadChapter;
