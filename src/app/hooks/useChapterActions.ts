import { useState } from "react";
import { updateChapter, deleteChapter, cancelScheduleChapter } from "../../infrastructure/services/ChapterService";
import { handleError } from "../../infrastructure/errorHandler";
import type { ChapterWithContentDTO } from "../../domain/dto/ChapterWithContentDTO";
import { useNavigate } from "react-router-dom";

export function useChapterActions(id: string, chapter: ChapterWithContentDTO | null) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [cancelingSchedule, setCancelingSchedule] = useState(false);
    const [cancelScheduleError, setCancelScheduleError] = useState("");

    const handleSave = async () => {
        if (!chapter) return;
        setError("");

        if (!chapter?.title?.trim() || !chapter?.content?.trim()) {
            setError("El título y el contenido son obligatorios.");
            return;
        }

        const chapterData: ChapterWithContentDTO = {
            ...chapter,
            last_update: new Date().toISOString(),
        };

        try {
            const response = await updateChapter(
                Number(id),
                chapterData.id,
                chapterData.title,
                chapterData.content,
                chapterData.publishedAt
            );
            if (response?.fetchStatus === 200) {
                navigate(`/manage-work/${id}`);
            } else {
                setError("Error al actualizar el capítulo.");
            }
        } catch (err) {
            setError(handleError(err));
        }
    };

const handleConfirmDelete = async (chapterId: string | undefined, deleteInput: string) => {
        if (!chapter || !chapterId) return;
        if (deleteInput !== "Eliminar Capitulo") {
            setDeleteError("Debes escribir exactamente: Eliminar Capitulo");
            return;
        }
        try {
            setDeleting(true);
            setDeleteError("");
            const resp = await deleteChapter(Number(chapterId), Number(id));
            if (resp.fetchStatus === 200 || resp.fetchStatus === 204 || resp.fetchStatus === 201) {
                navigate(`/manage-work/${id}`);
            } else {
                setDeleteError("No se pudo eliminar el capítulo.");
            }
        } catch (err) {
            setDeleteError(handleError(err));
        } finally {
            setDeleting(false);
        }
    };
  const handleCancelSchedule = async (chapterId: string | undefined) => {
        if (!id || !chapterId) return;
        try {
            setCancelScheduleError("");
            setCancelingSchedule(true);
            const resp = await cancelScheduleChapter(Number(id), Number(chapterId));
            if (resp.fetchStatus >= 200 && resp.fetchStatus < 300) {
                navigate(`/manage-work/${id}`);
            } else {
                setCancelScheduleError("No se pudo deshacer la programación.");
            }
        } catch (e) {
            setCancelScheduleError("Error al deshacer la programación.");
            console.error(e);
        } finally {
            setCancelingSchedule(false);
        }
    };

    return {
        handleSave,
        error,
        setError,
        handleConfirmDelete,
        deleting,
        deleteError,
        setDeleteError,
        handleCancelSchedule,
        cancelingSchedule,
        cancelScheduleError,
        setCancelScheduleError
    };
}