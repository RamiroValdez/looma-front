import FooterLector from "../../components/FooterLector.tsx";
import TextViewer from "../Chapter/TextViewer.tsx";
import { MilkdownProvider } from "@milkdown/react";
import ThemeSelector from "./components/ThemeSelector.tsx";
import SubscriptionModal from "./components/SubscriptionModal";
import ChapterPurchaseModal from "./components/ChapterPurchaseModal";
import LikeButton from "../../components/LikeButton";
import { useReadChapterView } from "./hooks/useReadChapterView";

const ReadChapter = () => {
    const {
        navigate,
        chapterId,
        isWorkModalOpen,
        isChapterModalOpen,
        selectedChapterForPayment,
        currentTheme,
        fontSize,
        changeTheme,
        changeFontSize,
        themes,
        isThemeSelectorOpen,
        setIsThemeSelectorOpen,
        theme,
        currentFontSize,
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
        isWorkSaved,
        toggleFullScreen,
        handleChapterClick,
        handleLanguageChange,
        handleChapterPayment,
        isChapterUnlocked,
        handdleToggleSaveWork,
        currentLanguage,
        openWorkModal,
        closeWorkModal,
        openChapterModal,
        closeChapterModal,
        handlePreviousChapter,
        handleNextChapter,
    } = useReadChapterView();

    if (isLoading) {
        return <p className="text-center text-gray-500 mt-10">Cargando capítulo...</p>;
    }

    if (!chapterData) {
        return <p className="text-center text-red-500 mt-10">No se pudo cargar el capítulo.</p>;
    }


    return (
        <div className="h-full flex bg-white relative">
            <div
                className="flex-1 overflow-y-auto"
                style={{
                    backgroundColor: theme.bgColor,
                    color: theme.textColor,
                    fontSize: currentFontSize.size
                }}
            >
                <div
                    className={`px-6 pt-6 pb-28 mb-24 sm:mb-0 flex flex-col ${!isFullScreen ? 'min-h-[calc(100vh-4rem)]' : 'min-h-screen'}`}
                    style={{
                        backgroundColor: theme.bgColor,
                        color: theme.textColor,
                    }}>

                    {!isFullScreen && (
                        <button
                            onClick={() => chapterData?.workId && navigate(`/work/${chapterData.workId}`)}
                            style={{ color: theme.textColor }}
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
                                <p className="text-sm font-semibold tracking-wider uppercase"
                                    style={{ color: theme.textColor === '#f9fafb' ? '#a78bfa' : '#5C17A6' }}>
                                    Capítulo {chapterData.chapterNumber}
                                </p>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
                                    style={{ color: theme.textColor }}
                                >
                                    {chapterData.title}
                                </h1>
                            </div>
                            <div className="mt-3 flex items-center justify-center">
                                <div
                                    className="h-0.5 w-200"
                                    style={{
                                        backgroundColor: currentTheme === 'dark' ? '#4b5563' :
                                            currentTheme === 'paper' ? '#d97706' :
                                                currentTheme === 'sepia' ? '#78350f' :
                                                    '#e5e7eb'
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="prose max-w-none">
                            {isTranslating ? (
                                <p className="text-center text-gray-500">Traduciendo contenido...</p>
                            ) : (
                                <MilkdownProvider>
                                    <div
                                        style={{
                                            color: theme.textColor,
                                            backgroundColor: 'transparent',
                                            fontSize: currentFontSize.size
                                        }}
                                    >
                                        <div style={{
                                            fontSize: currentFontSize.size,
                                            lineHeight: '1.8'
                                        }}>
                                            <TextViewer content={translatedContent} />
                                        </div>
                                    </div>
                                </MilkdownProvider>
                            )}
                        </div>

                        <div className="mt-auto">
                            <div className="flex flex-row items-center justify-between w-full mt-12 border-t pt-6"
                                style={{
                                    borderColor: currentTheme === 'dark' ? '#4b5563' :
                                        currentTheme === 'paper' ? '#d97706' :
                                            currentTheme === 'sepia' ? '#78350f' :
                                                '#e5e7eb'
                                }}
                            >
                                <button
                                    onClick={() => {
                                        const publishedChapters = chapters
                                            .filter(ch => ch.publicationStatus === "PUBLISHED")
                                            .sort((a, b) => a.id - b.id);
                                        const currentIndex = publishedChapters.findIndex(ch => ch.id === Number(chapterId));

                                        for (let i = currentIndex - 1; i >= 0; i--) {
                                            if (isChapterUnlocked(publishedChapters[i].id)) {
                                                navigate(`/work/chapter/${publishedChapters[i].id}/read`);
                                                break;
                                            }
                                        }
                                    }}
                                    disabled={
                                        (() => {
                                            const publishedChapters = chapters
                                                .filter(ch => ch.publicationStatus === "PUBLISHED")
                                                .sort((a, b) => a.id - b.id);
                                            const currentIndex = publishedChapters.findIndex(ch => ch.id === Number(chapterId));

                                            for (let i = currentIndex - 1; i >= 0; i--) {
                                                if (isChapterUnlocked(publishedChapters[i].id)) {
                                                    return false;
                                                }
                                            }
                                            return true;
                                        })()
                                    }
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#5C17A6] transition-colors duration-200 group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-600 cursor-pointer"
                                    style={{ color: theme.textColor }}
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
                                        const currentIndex = publishedChapters.findIndex(ch => ch.id === Number(chapterId));

                                        for (let i = currentIndex + 1; i < publishedChapters.length; i++) {
                                            if (isChapterUnlocked(publishedChapters[i].id)) {
                                                navigate(`/work/chapter/${publishedChapters[i].id}/read`);
                                                break;
                                            }
                                        }
                                    }}
                                    disabled={
                                        (() => {
                                            const publishedChapters = chapters
                                                .filter(ch => ch.publicationStatus === "PUBLISHED")
                                                .sort((a, b) => a.id - b.id);
                                            const currentIndex = publishedChapters.findIndex(ch => ch.id === Number(chapterId));

                                            for (let i = currentIndex + 1; i < publishedChapters.length; i++) {
                                                if (isChapterUnlocked(publishedChapters[i].id)) {
                                                    return false;
                                                }
                                            }
                                            return true;
                                        })()
                                    }
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#5C17A6] transition-colors duration-200 group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-600 cursor-pointer"
                                    style={{ color: theme.textColor }} >
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
                            <div
                                className="w-full h-32 bg-cover bg-center rounded-md"
                                style={{ backgroundImage: `url(${work?.banner || '/img/portadas/banner1.jpg'})` }}
                            />

                            <div className="-mt-12 flex items-start gap-4 px-2">
                                <img
                                    src={work?.cover || '/img/portadas/banner1.jpg'}
                                    alt={work?.title}
                                    className="w-28 h-40 object-cover rounded-md shadow-lg border-4 border-white flex-shrink-0"
                                />

                                <div className="flex-1 mt-14">
                                    <h2 className="text-base font-semibold text-gray-800 line-clamp-2">
                                        {work?.title || chapterData.workName}
                                    </h2>

                                    {!isAuthor && (
                                        <div className="mt-2 flex flex-col gap-2">
                                            <button
                                                onClick={openWorkModal}
                                                disabled={isPaying || isWorkSubscribed || isAuthorSubscribed}
                                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isWorkSubscribed || isAuthorSubscribed
                                                        ? 'text-[#5C17A6] cursor-default'
                                                        : 'border border-[#5C17A6] text-white cursor-pointer bg-[#5C17A6] disabled:opacity-50 disabled:cursor-not-allowed'
                                                    }`}
                                            >
                                                {isWorkSubscribed || isAuthorSubscribed ? "Suscrito" : "Suscribir"}
                                            </button>
                                            <button
                                                onClick={handdleToggleSaveWork}
                                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isWorkSaved
                                                        ? 'text-[#5C17A6] cursor-pointer border border-[#5C17A6]'
                                                        : 'text-white cursor-pointer bg-[#3b245a]/90 disabled:opacity-50 disabled:cursor-not-allowed'
                                                    }`}
                                            >
                                                {isWorkSaved ? "Guardado" : "Guardar"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {chapters.length > 0 && (
                            <div className="mt-6">
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
                                                        className={`p-4 transition duration-150 border-b border-gray-200 last:border-b-0 cursor-pointer flex items-center justify-between ${isCurrentChapter ? 'bg-gray-300' : 'hover:bg-gray-100'
                                                            }`}
                                                        onClick={() => {
                                                            if (isUnlocked) {
                                                                handleChapterClick(chapter);
                                                            } else {
                                                                openChapterModal(chapter.id);
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            {!isUnlocked && (
                                                                <span className="text-gray-900 mr-2 flex items-center" aria-hidden>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4 text-gray-500">
                                                                        <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
                                                                    </svg>
                                                                </span>
                                                            )}

                                                            <span className={`font-medium ${isCurrentChapter ? 'text-gray-900' : 'text-gray-800'}`}>{`Capítulo ${chapter.displayIndex}`}</span>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                }}
                                                                className={`p-1 rounded-md transition-transform ${isUnlocked ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
                                                            >
                                                                <LikeButton
                                                                    workId={Number(work?.id || chapterData.workId)}
                                                                    chapterId={chapter.id}
                                                                    initialLiked={chapter.likedByUser || liked[chapter.id]}
                                                                    initialCount={localLikes[chapter.id] ?? chapter.likes ?? 0}
                                                                    type="chapter"
                                                                    disabled={!isUnlocked}
                                                                />
                                                            </div>

                                                            <span className="text-sm text-gray-500 hidden">{chapter.publishedAt || ''}</span>
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

            {((!isFullScreen || showFooter) || isThemeSelectorOpen) && (

                <FooterLector
                    selectedLanguages={sortedLanguages}
                    chapterTitle={`Capítulo ${chapterData.chapterNumber}`}
                    onLanguageChange={handleLanguageChange}
                    onToggleFullScreen={toggleFullScreen}
                    isFullScreen={isFullScreen}
                    onThemeClick={() => setIsThemeSelectorOpen(true)}
                    isThemeModalOpen={isThemeSelectorOpen}
                    onPreviousChapter={handlePreviousChapter}
                    onNextChapter={handleNextChapter}
                    currentLanguage={currentLanguage}
                    disableLanguageSelect={isTranslating}
                />
            )}

            {isWorkModalOpen && (
                <SubscriptionModal
                    isOpen={isWorkModalOpen}
                    onClose={closeWorkModal}
                    work={work}
                />
            )}

            {isChapterModalOpen && (
                <ChapterPurchaseModal
                    isOpen={isChapterModalOpen}
                    onClose={closeChapterModal}
                    chapter={selectedChapterForPayment}
                    workId={chapterData?.workId ? Number(chapterData.workId) : work?.id || 0}
                    onPayment={async (chapter) => {
                        await handleChapterPayment(chapter.id);
                    }}
                />
            )}

            {isThemeSelectorOpen && (
                <ThemeSelector
                    themes={themes}
                    currentTheme={currentTheme}
                    currentFontSize={fontSize}
                    onThemeChange={changeTheme}
                    onFontSizeChange={changeFontSize}
                    onClose={() => setIsThemeSelectorOpen(false)}
                />
            )}

        </div>
    );
};

export default ReadChapter;
