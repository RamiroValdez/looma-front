import FooterLector from "../../components/FooterLector";
import { useState, useEffect } from "react";
import { useLanguages } from "../../services/languageService";
import { translateContent } from "../../services/TranslateService";
import TextViewer from "../Chapter/TextViewer.tsx";
import { MilkdownProvider } from "@milkdown/react";
import { getChapterById } from "../../services/chapterService.ts";
import { WorkService } from "../../services/workService";
import { useParams } from "react-router-dom";
import { notifyError } from "../../services/ToastProviderService";
import { ChapterList } from "./components/ChapterList";

const ReadChapter = () => {
    const { chapterId } = useParams<{ chapterId: string }>();
    const { data, isLoading } = getChapterById(Number(chapterId), "");

    const { languages } = useLanguages();
    const [translatedContent, setTranslatedContent] = useState<string>("");
    const [currentLanguage, setCurrentLanguage] = useState<string>("");
    const [isTranslating, setIsTranslating] = useState(false);
    const [work, setWork] = useState<any | null>(null);
    const [chapters, setChapters] = useState<any[]>([]);

    useEffect(() => {
        if (data?.content) {
            setTranslatedContent(data.content);
            setCurrentLanguage(data.languageDefaultCode.code);
        }

        // load work and chapters for the right sidebar
        const loadWork = async () => {
            if (!data?.workId) return;
            try {
                // Prefer WorkService.getWorkById which loads local mock data when available
                const w = await WorkService.getWorkById(Number(data.workId));
                setWork(w);
                setChapters(w.chapters || []);
            } catch (err: any) {
                console.error('No se pudo cargar la obra:', err);
                // No es crítico si falla; sólo notificamos
                notifyError('No se pudo cargar información de la obra.');
            }
        };

        loadWork();
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
            // Always translate from the original language to avoid chained translations
            const source = data.languageDefaultCode?.code || currentLanguage;
            const translated = await translateContent(source, languageCode, data.content);
            setTranslatedContent(translated);
            setCurrentLanguage(languageCode);
        } catch (error: any) {
            console.error("Error al traducir el contenido:", error);
            notifyError(`No se pudo traducir el contenido.`);
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
        <div className="min-h-screen flex bg-white">
            <main className="flex-1 px-6 py-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-xl mb-4 text-center">Capítulo {data.chapterNumber}</h1>
                    <hr className="w-full border-t border-gray-300 mb-6" />

                    <div className="prose max-w-none">
                        {isTranslating ? (
                            <p className="text-center text-gray-500">Traduciendo contenido...</p>
                        ) : (
                            <MilkdownProvider>
                                <TextViewer content={translatedContent} />
                            </MilkdownProvider>
                        )}
                    </div>
                </div>
            </main>

            {/* Right sidebar */}
            <aside className="w-80 bg-gray-50 border-l border-gray-200 hidden lg:block">
                <div className="p-4 space-y-4 sticky top-4">
                    <div className="flex flex-col items-center gap-3">
                        {work?.cover ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={work.cover} alt={work.title} className="w-40 h-56 object-cover rounded-md shadow-sm" />
                        ) : null}
                        <h2 className="text-lg font-semibold text-gray-800 text-center">{work?.title || data.workName}</h2>
                    </div>

                    {chapters.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Capítulos</h3>
                            <div className="chapter-list-compact">
                                <style>{`.chapter-list-compact .text-sm.text-gray-500{display:none !important;} .chapter-list-compact .flex.text-gray-500{display:none !important;}`}</style>
                                <ChapterList chapters={chapters} originalLanguage={work?.originalLanguage?.name || ''} />
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            <FooterLector
                selectedLanguages={sortedLanguages}
                chapterTitle={`Capítulo ${data.chapterNumber}`}
                onLanguageChange={handleLanguageChange}
            />
        </div>
    );
};

export default ReadChapter;
