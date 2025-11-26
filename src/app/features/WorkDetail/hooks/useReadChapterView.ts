import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "./useTheme";
import { useReadChapterData } from "./useReadChapterData";
import { updateReadingProgress } from "../../../../infrastructure/services/HomeService";

export const useReadChapterView = () => {
    const navigate = useNavigate();
    const { chapterId } = useParams<{ chapterId: string }>();
    const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
    const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
    const [selectedChapterForPayment, setSelectedChapterForPayment] = useState<any | null>(null);
    const { currentTheme, fontSize, changeTheme, changeFontSize, getTheme, getFontSize, themes } = useTheme();
    const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
    const theme = getTheme();
    const currentFontSize = getFontSize();

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
        isWorkSaved,
        toggleFullScreen,
        handleChapterClick,
        handleLanguageChange,
        handleChapterPayment,
        isChapterUnlocked,
        handdleToggleSaveWork,
        currentLanguage,
    } = useReadChapterData(chapterId || "");

    const openWorkModal = () => setIsWorkModalOpen(true);
    const closeWorkModal = () => { if (!isPaying) setIsWorkModalOpen(false); };

    const openChapterModal = (chapterIdForPayment: number) => {
        const fullChapter = chapters.find(ch => ch.id === chapterIdForPayment) || null;
        setSelectedChapterForPayment(fullChapter);
        setIsChapterModalOpen(true);
    };
    const closeChapterModal = () => {
        if (!isPaying) {
            setIsChapterModalOpen(false);
            setSelectedChapterForPayment(null);
        }
    };

    const handlePreviousChapter = () => {
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
    };

    const handleNextChapter = () => {
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
    };

    useEffect(() => {
        const saveProgress = async () => {
            if (!chapterData?.workId || !chapterId) return;
            try {
                await updateReadingProgress(Number(chapterData.workId), Number(chapterId));
            } catch (error) {
                // Manejo de error opcional
            }
        };
        saveProgress();
    }, [chapterData?.workId, chapterId]);

    return {
        navigate,
        chapterId,
        isWorkModalOpen,
        setIsWorkModalOpen,
        isChapterModalOpen,
        setIsChapterModalOpen,
        selectedChapterForPayment,
        setSelectedChapterForPayment,
        currentTheme,
        fontSize,
        changeTheme,
        changeFontSize,
        getTheme,
        getFontSize,
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
    };
};