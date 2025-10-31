import FooterLector from "../../components/FooterLector.tsx";
import { useState, useEffect } from "react";
import { useLanguages } from "../../../infrastructure/services/LanguageService.ts";
import { translateContent } from "../../../infrastructure/services/TranslateService";
import TextViewer from "../Chapter/TextViewer.tsx";
import { MilkdownProvider } from "@milkdown/react";
import { WorkService } from "../../../infrastructure/services/WorkService";
import { useParams, useNavigate } from "react-router-dom";
import { notifyError } from "../../../infrastructure/services/ToastProviderService";
import { getChapterById } from "../../../infrastructure/services/ChapterService.ts";


const ReadChapter = () => {
    const navigate = useNavigate();
    const { chapterId } = useParams<{ chapterId: string }>();
    const { data, isLoading, error: errorFetch } = getChapterById(Number(chapterId), "");

    const { languages } = useLanguages();
    const [translatedContent, setTranslatedContent] = useState<string>("");
    const [currentLanguage, setCurrentLanguage] = useState<string>("");
    const [isTranslating, setIsTranslating] = useState(false);
    const [work, setWork] = useState<any | null>(null);
    const [chapters, setChapters] = useState<any[]>([]);
    const [liked, setLiked] = useState<Record<number, boolean>>({});
    const [localLikes, setLocalLikes] = useState<Record<number, number>>({});

    const isStatusError = (err: unknown): err is { response: { status: number } } => {
        if (typeof err !== "object" || err === null) return false;
        const e = err as Record<string, unknown>;
        if (!("response" in e)) return false;
        const resp = e.response as Record<string, unknown> | undefined;
        return typeof resp?.status === "number";
    };

    useEffect(() => {
        if (!errorFetch) return;
        if (isStatusError(errorFetch) && errorFetch.response.status === 403) {
            navigate(-1);
        }
    }, [errorFetch, navigate]);

    // Establecer contenido original al cargar
    useEffect(() => {
        if (data?.content) {
            setTranslatedContent(data.content);
            setCurrentLanguage(data.languageDefaultCode.code);
        }

        const loadWork = async () => {
            if (!data?.workId) return;
            try {
                const w = await WorkService.getWorkById(Number(data.workId));
                setWork(w);
                setChapters(w.chapters || []);
            } catch (err: any) {
                console.error('No se pudo cargar la obra:', err);
                notifyError('No se pudo cargar información de la obra.');
            }
        };

        loadWork();
    }, [data]);

    useEffect(() => {
        const likesInit: Record<number, number> = {};
        chapters.forEach((ch: any) => {
            likesInit[ch.id] = ch.likes || 0;
        });
        setLocalLikes(likesInit);
    }, [chapters]);

    const toggleLike = (id: number) => {
        setLiked((prev) => {
            const isLiked = !prev[id];
            setLocalLikes((l) => ({ ...l, [id]: (l[id] || 0) + (isLiked ? 1 : -1) }));
            return { ...prev, [id]: isLiked };
        });
    };

    const handleChapterClick = (chapter: any) => {
        const chapterData = {
            ...chapter,
            content: chapter.description || "Contenido no disponible",
            originalLanguage: work?.originalLanguage?.name || "",
        };

        navigate(`/work/chapter/${encodeURIComponent(JSON.stringify(chapterData.id))}/read`);
    };

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

            <aside className="w-80 bg-gray-50 border-l border-gray-200 hidden lg:block">
                <div className="p-4 space-y-4 sticky top-4">
                    <div className="relative">
                        <div className="w-full h-32 bg-cover bg-center rounded-md" style={{ backgroundImage: `url(${work?.banner || '/img/portadas/banner1.jpg'})` }} />
                        <div className="-mt-16 flex items-start gap-4">
                            <img src={work?.cover || '/img/portadas/banner1.jpg'} alt={work?.title} className="w-32 h-44 object-cover rounded-md shadow-lg border-4 border-white ml-2" />
                            <div className="flex-1 pt-4">
                                <h2 className="text-lg font-semibold text-gray-800">{work?.title || data.workName}</h2>
                                <div className="mt-3 flex flex-col gap-2">
                                    <button className="px-3 py-1 rounded-md bg-[#C026D3] text-white font-medium cursor-pointer">Suscrito</button>
                                    <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 font-medium cursor-pointer">Guardado</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {chapters.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Capítulos</h3>
                            <div className="chapter-list-compact">
                                <style>{`.chapter-list-compact .text-sm.text-gray-500{display:none !important;} .chapter-list-compact .flex.text-gray-500{display:none !important;}`}</style>

                                <div className="bg-white rounded-xl overflow-hidden">
                                    {[...chapters]
                                        .sort((a, b) => a.id - b.id)
                                        .map((chapter: any, index: number) => ({
                                            ...chapter,
                                            displayIndex: index + 1
                                        }))
                                        .filter((chapter: any) => chapter.publicationStatus === "PUBLISHED")
                                        .map((chapter: any) => (
                                        <div
                                            key={chapter.id}
                                            className="p-4 transition duration-150 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                                            onClick={() => handleChapterClick(chapter)}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-900 mr-2 flex items-center" aria-hidden>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4">
                                                        <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
                                                    </svg>
                                                </span>

                                                <span className="font-medium text-gray-800">{`Capítulo ${chapter.displayIndex}`}</span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleLike(chapter.id);
                                                    }}
                                                    aria-label={liked[chapter.id] ? 'Quitar like' : 'Agregar like'}
                                                    className="p-1 rounded-md cursor-pointer hover:scale-105 transition-transform"
                                                >
                                                    {liked[chapter.id] ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" className="text-red-500">
                                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                        </svg>
                                                        ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                        </svg>
                                                    )}
                                                </button>

                                                <span className="text-sm text-gray-500 hidden">{chapter.publishedAt || ''}</span>

                                                <span className="text-sm text-gray-500">{(localLikes[chapter.id] ?? chapter.likes ?? 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
