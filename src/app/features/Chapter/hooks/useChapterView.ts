import { useState } from "react";
import { useParams } from "react-router-dom";
import { useChapterActions } from "../../../hooks/useChapterActions";
import { useChapterVersions } from "../../../hooks/useChapterVersions";
import type { ChapterWithContentDTO } from "../../../../domain/dto/ChapterWithContentDTO";
import type { LanguageDTO } from "../../../../domain/dto/LanguageDTO";

export function useChapterView() {
    const { id, chapterId } = useParams<{ id: string; chapterId: string }>();

    const {
        chapter,
        activeLanguage,
        loadingLanguage,
        versions,
        pendingLanguages,
        switchLanguage,
        updateContent,
        addLanguage,
        saveActiveLanguage,
        savePrice,
        setTitle,
        setPriceValue,
        dirtyActive,
        priceSaving,
    } = useChapterVersions({ chapterId: Number(chapterId) || null });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteInput, setDeleteInput] = useState("");
    const [showCancelScheduleModal, setShowCancelScheduleModal] = useState(false);
    const [cancelScheduleInput, setCancelScheduleInput] = useState("");
    const [targetLanguageCandidate, setTargetLanguageCandidate] = useState<string | null>(null);
    const [showConfirmLanguageModal, setShowConfirmLanguageModal] = useState(false);

    const {
        error,
        handleConfirmDelete,
        deleting,
        deleteError,
        handleCancelSchedule,
        cancelingSchedule,
        cancelScheduleError,
        setCancelScheduleError,
        setDeleteError
    } = useChapterActions(id ?? "", chapter as ChapterWithContentDTO | null);

    const closeDeleteModal = () => { if (deleting) return; setShowDeleteModal(false); };

    const handlePreview = () => {
        if (!chapter) return;
        const previewId = `${chapter.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const previewData = {
            chapterId: chapter.id,
            content: versions[activeLanguage]?.content || chapter.content || '',
            numberChapter: chapter.chapterNumber,
            originalLanguage: chapter.languageDefaultCode.code,
        };
        try { localStorage.setItem(`preview:${previewId}`, JSON.stringify(previewData)); } catch {}
        const previewUrl = `/preview?previewId=${encodeURIComponent(previewId)}`;
        window.open(previewUrl, '_blank');
    };

    const editorKey = chapter ? `${chapter.id}-${activeLanguage || 'default'}` : 'loading';
    const languageLoading = loadingLanguage;

    const combinedLanguages: LanguageDTO[] = (() => {
        if (!chapter) return pendingLanguages;
        const map = new Map<string, LanguageDTO>();
        for (const l of chapter.availableLanguages) map.set(l.code, l);
        for (const l of pendingLanguages) map.set(l.code, l);
        return Array.from(map.values());
    })();

    const openDeleteModal = () => {
        if (deleting) return;
        setDeleteError("");
        setDeleteInput("");
        setShowDeleteModal(true);
    };

    const requestLanguageChange = (code: string) => {
        if (!dirtyActive) {
            switchLanguage(code);
            return;
        }
        setTargetLanguageCandidate(code);
        setShowConfirmLanguageModal(true);
    };

    return {
        id,
        chapterId,
        chapter,
        activeLanguage,
        loadingLanguage,
        versions,
        pendingLanguages,
        switchLanguage,
        updateContent,
        addLanguage,
        saveActiveLanguage,
        savePrice,
        setTitle,
        setPriceValue,
        dirtyActive,
        priceSaving,
        showDeleteModal,
        setShowDeleteModal,
        deleteInput,
        setDeleteInput,
        showCancelScheduleModal,
        setShowCancelScheduleModal,
        cancelScheduleInput,
        setCancelScheduleInput,
        targetLanguageCandidate,
        setTargetLanguageCandidate,
        showConfirmLanguageModal,
        setShowConfirmLanguageModal,
        error,
        handleConfirmDelete,
        deleting,
        deleteError,
        handleCancelSchedule,
        cancelingSchedule,
        cancelScheduleError,
        setCancelScheduleError,
        setDeleteError,
        closeDeleteModal,
        handlePreview,
        editorKey,
        languageLoading,
        combinedLanguages,
        openDeleteModal,
        requestLanguageChange
    };
}