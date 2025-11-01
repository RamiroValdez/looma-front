import FooterLector from "../../components/FooterLector.tsx";
import TextViewer from "../Chapter/TextViewer.tsx";
import { MilkdownProvider } from "@milkdown/react";
import { useParams, useNavigate } from "react-router-dom";
import { useReadChapterData } from "./hooks/useReadChapterData";

const ReadChapter = () => {
    const navigate = useNavigate();
    const { chapterId } = useParams<{ chapterId: string }>();
    
    const {
        chapterData,
        work,
        chapters,
        translatedContent,
        isTranslating,
        sortedLanguages,
        liked,
        localLikes,
        isFullScreen,
        showFooter,
        isPaying,
        isLoading,
        isAuthor,
        isWorkSubscribed,
        isAuthorSubscribed,
        toggleFullScreen,
        toggleLike,
        handleChapterClick,
        handleLanguageChange,
        handleSubscribeWork,
        handleChapterPayment,
        isChapterUnlocked,
    } = useReadChapterData(chapterId || "");

    if (isLoading) {
        return <p className="text-center text-gray-500 mt-10">Cargando capítulo...</p>;
    }

    if (!chapterData) {
        return <p className="text-center text-red-500 mt-10">No se pudo cargar el capítulo.</p>;
    }

    return (
        <div className="h-full flex bg-white relative">
            <div className="flex-1 overflow-y-auto">
                <div className={`px-6 pt-6 pb-28 flex flex-col ${!isFullScreen ? 'min-h-[calc(100vh-4rem)]' : 'min-h-screen'}`}>
                {!isFullScreen && (
                    <button
                        onClick={() => chapterData?.workId && navigate(`/work/${chapterData.workId}`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-[#5C17A6] transition-colors duration-200 group mb-3 cursor-pointer"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-200" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Volver</span>
                    </button>
                )}

                <div className={`mx-auto w-full flex-1 flex flex-col ${isFullScreen ? 'max-w-4xl' : 'max-w-3xl'}`}>
                    <div className="mb-4">
                        <div className="text-center space-y-2">
                            <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: '#5C17A6' }}>
                                Capítulo {chapterData.chapterNumber}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                {chapterData.title}
                            </h1>
                        </div>
                        <div className="mt-3 flex items-center justify-center">
                            <div className="h-0.5 w-200 bg-gray-200"></div>
                        </div>
                    </div>

                    <div className="prose max-w-none">
                        {isTranslating ? (
                            <p className="text-center text-gray-500">Traduciendo contenido...</p>
                        ) : (
                            <MilkdownProvider>
                                <TextViewer content={translatedContent} />
                            </MilkdownProvider>
                        )}
                    </div>

                    <div className="mt-auto">
                        <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
                            <button
                            onClick={() => {
                                const publishedChapters = chapters
                                    .filter(ch => ch.publicationStatus === "PUBLISHED")
                                    .sort((a, b) => a.id - b.id);
                                const currentPublishedIndex = publishedChapters.findIndex(ch => ch.id === Number(chapterId));
                                
                                if (currentPublishedIndex > 0) {
                                    const prevChapter = publishedChapters[currentPublishedIndex - 1];
                                    navigate(`/work/chapter/${prevChapter.id}/read`);
                                }
                            }}
                            disabled={
                                chapters.filter(ch => ch.publicationStatus === "PUBLISHED")
                                    .sort((a, b) => a.id - b.id)
                                    .findIndex(ch => ch.id === Number(chapterId)) === 0
                            }
                            className="flex items-center gap-2 text-gray-600 hover:text-[#5C17A6] transition-colors duration-200 group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-600 cursor-pointer"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-200" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm font-medium">Capítulo anterior</span>
                        </button>

                        <button
                            onClick={() => {
                                const publishedChapters = chapters
                                    .filter(ch => ch.publicationStatus === "PUBLISHED")
                                    .sort((a, b) => a.id - b.id);
                                const currentPublishedIndex = publishedChapters.findIndex(ch => ch.id === Number(chapterId));
                                
                                if (currentPublishedIndex < publishedChapters.length - 1) {
                                    const nextChapter = publishedChapters[currentPublishedIndex + 1];
                                    navigate(`/work/chapter/${nextChapter.id}/read`);
                                }
                            }}
                            disabled={
                                (() => {
                                    const publishedChapters = chapters.filter(ch => ch.publicationStatus === "PUBLISHED")
                                        .sort((a, b) => a.id - b.id);
                                    const currentPublishedIndex = publishedChapters.findIndex(ch => ch.id === Number(chapterId));
                                    return currentPublishedIndex === publishedChapters.length - 1;
                                })()
                            }
                            className="flex items-center gap-2 text-gray-600 hover:text-[#5C17A6] transition-colors duration-200 group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-600 cursor-pointer"
                        >
                            <span className="text-sm font-medium">Capítulo siguiente</span>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {!isFullScreen && (
                <aside className="w-80 bg-gray-50 border-l border-gray-200 hidden lg:block">
                <div className="p-4 space-y-4 sticky top-4">
                    <div className="relative">
                        <div className="w-full h-32 bg-cover bg-center rounded-md" style={{ backgroundImage: `url(${work?.banner || '/img/portadas/banner1.jpg'})` }} />
                        <div className="-mt-16 flex items-start gap-4">
                            <img src={work?.cover || '/img/portadas/banner1.jpg'} alt={work?.title} className="w-32 h-44 object-cover rounded-md shadow-lg border-4 border-white ml-2" />
                            <div className="flex-1 pt-4">
                                <h2 className="text-lg font-semibold text-gray-800">{work?.title || chapterData.workName}</h2>
                                {!isAuthor && (
                                    <div className="mt-3 flex flex-col gap-2">
                                        <button 
                                            onClick={handleSubscribeWork}
                                            disabled={isPaying || isWorkSubscribed || isAuthorSubscribed}
                                            className="px-3 py-1 rounded-md bg-[#C026D3] text-white font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                        >
                                            {isWorkSubscribed || isAuthorSubscribed ? "Suscrito" : "Suscribir"}
                                        </button>
                                        <button 
                                            disabled={true}
                                            className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 font-medium cursor-not-allowed opacity-50"
                                        >
                                            Guardado
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {chapters.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Capítulos</h3>
                            <div className="chapter-list-compact max-h-96 overflow-y-auto">
                                <style>{`.chapter-list-compact .text-sm.text-gray-500{display:none !important;} .chapter-list-compact .flex.text-gray-500{display:none !important;}`}</style>

                                <div className="bg-white rounded-xl overflow-hidden">
                                    {[...chapters]
                                        .sort((a, b) => a.id - b.id)
                                        .map((chapter: any, index: number) => ({
                                            ...chapter,
                                            displayIndex: index + 1
                                        }))
                                        .filter((chapter: any) => chapter.publicationStatus === "PUBLISHED")
                                        .map((chapter: any) => {
                                            const isCurrentChapter = chapter.id === Number(chapterId);
                                            const isUnlocked = isChapterUnlocked(chapter.id);
                                            return (
                                        <div
                                            key={chapter.id}
                                            className={`p-4 transition duration-150 border-b border-gray-200 last:border-b-0 cursor-pointer flex items-center justify-between ${
                                                isCurrentChapter ? 'bg-gray-300' : 'hover:bg-gray-100'
                                            }`}
                                            onClick={() => {
                                                if (isUnlocked) {
                                                    handleChapterClick(chapter);
                                                } else {
                                                    handleChapterPayment(chapter.id);
                                                }
                                            }}
                                        >
                                            <div className="flex items-center space-x-2">
                                                {!isUnlocked && (
                                                    <span className="text-gray-900 mr-2 flex items-center" aria-hidden>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4 text-gray-500">
                                                            <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
                                                        </svg>
                                                    </span>
                                                )}

                                                <span className={`font-medium ${isCurrentChapter ? 'text-gray-900' : 'text-gray-800'}`}>{`Capítulo ${chapter.displayIndex}`}</span>
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
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
            )}

            {(!isFullScreen || showFooter) && (
                <FooterLector
                    selectedLanguages={sortedLanguages}
                    chapterTitle={`Capítulo ${chapterData.chapterNumber}`}
                    onLanguageChange={handleLanguageChange}
                    onToggleFullScreen={toggleFullScreen}
                    isFullScreen={isFullScreen}
                />
            )}
        </div>
    );
};

export default ReadChapter;
