import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdvancedTools from "../../components/addChapter/AdvancedTools";
import ChapterEditor from "../../components/addChapter/ChapterEditor";
import ChapterActions from "../../components/addChapter/ChapterActions";
import PublishOptions from "../../components/addChapter/PublishOptions";
//import InspirationBubble from "../../components/addChapter/InspirationBubble";
import {updateChapter, deleteChapter, getChapterById, cancelScheduleChapter} from "../../services/chapterService.ts";
import { handleError } from "../../utils/errorHandler";
import type {ChapterWithContentDTO} from "../../dto/ChapterWithContentDTO.ts";

export default function AddChapter() {
    const navigate = useNavigate();
    const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    const { data, isLoading: isLoadingFetch, error: errorFetch } = getChapterById(Number(chapterId), selectedLanguage);
    const [chapter, setChapter] = useState<ChapterWithContentDTO | null>(null);
    const [error, setError] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteInput, setDeleteInput] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [cancelingSchedule, setCancelingSchedule] = useState(false);
    const [cancelScheduleError, setCancelScheduleError] = useState("");
    const [showCancelScheduleModal, setShowCancelScheduleModal] = useState(false);
    const [cancelScheduleInput, setCancelScheduleInput] = useState("");
    useEffect(() => {
        if (errorFetch) {
            const status = (errorFetch as any)?.response?.status;
            if (status === 403 && id) {
                navigate(`/work/${id}`);
            }
        }
    }, [errorFetch, id, navigate]);

    const handleFieldChange = (field: keyof ChapterWithContentDTO, value: any) => {
        setChapter((prev) => (prev ? { ...prev, [field]: value } : prev));
    };
    const handleSave = async () => {
        if (!chapter) return;
        setError("");

        try {
            if (!chapter?.title?.trim() || !chapter?.content?.trim()) {
                setError("El título y el contenido son obligatorios.");
                return;
            }

            const chapterData: ChapterWithContentDTO = {
                ...chapter,
                last_update: new Date().toISOString(),
            };

            const response = await updateChapter(
                Number(id),
                chapterData.id,
                chapterData.title,
                chapterData.content,
                chapterData.publishedAt
            );
            console.log("Capítulo actualizado:", response);
            if (response?.fetchStatus === 200) {
                navigate(`/manage-work/${id}`);
            }
            else {
                setError("Error al actualizar el capítulo.");
            }
        } catch (err) {
            console.error(err);
            setError(handleError(err));
        }
    };

    const openDeleteModal = () => {
        setDeleteError("");
        setDeleteInput("");
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        if (deleting) return;
        setShowDeleteModal(false);
    };

    const handleConfirmDelete = async () => {
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

    const handleChapterActions = () => {
        if (chapter) {
            handleSave();
        }
    };

    const handleCancelSchedule = async () => {
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

    const handleLanguageSelect = (languageCode: string) => {
        setSelectedLanguage(languageCode);
    };

    //NUEVO
  const handlePreview = () => {
    if (!chapter) return;

    const previewData = {
        content: chapter.content,
        selectedLanguages: chapter.availableLanguages,
        numberChapter: chapter.chapterNumber,
        originalLanguage: chapter.languageDefaultCode.code,
    };

    const previewUrl = `/preview?data=${encodeURIComponent(JSON.stringify(previewData))}`;
    window.open(previewUrl, "_blank");
};

    return (
        <div>
            {isLoadingFetch ? (
                <div className="min-h-screen flex items-center justify-center bg-[#F4F0F7]">
                    <p className="text-gray-600 text-lg">Cargando obra...</p>
                </div>
            ) : errorFetch || error ? (
                <div className="min-h-screen flex items-center justify-center bg-[#F4F0F7]">
                    <p className="text-gray-600 text-lg">No se pudo cargar el capítulo.</p>
                </div>
            ) : data && chapter ? (
                <div className="min-h-screen bg-[#F4F0F7] px-4 sm:px-8 md:px-16 py-8 max-w-screen">
                    <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-white mb-8">
                        <div className="bg-white border-b border-[#e4e2eb] h-14 flex items-center ">
                            <div className="px-4 sm:px-8 md:px-16 mx-auto flex justify-between items-center w-full">
                                <div className="flex items-center gap-3 p-6">
                                    <div className="w-8 h-8 bg-[#1a2fa1] rounded-full flex items-center justify-center">
                                        <span className="text-white text-lg font-bold">?</span>
                                    </div>
                                    <h2 className="text-gray-900 font-semibold text-base">
                                        ¿Tenés dudas? Dejanos darte algunos consejos
                                    </h2>
                                </div>

                                <a href="#" className="text-gray-400 hover:text-gray-600 underline text-sm">
                                    Normativas de contenido
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-[3] rounded-2xl p-6">
                            <h2 className="text-lg font-medium text-gray-700 mb-9">
                                Título de la serie:{" "}
                                <span className="font-semibold">{chapter.workName}</span>
                            </h2>

                            {chapter.publicationStatus === 'SCHEDULED' && chapter.scheduledPublicationDate ? (
                                <div className="mb-6">
                                    <div className="border border-blue-300 bg-blue-50 text-blue-800 rounded-lg p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm mt-0.5">i</div>
                                                <div>
                                                    <p className="font-semibold">Publicación programada</p>
                                                    <p className="text-sm">
                                                        Programado para: <span className="font-medium">{new Date(chapter.scheduledPublicationDate).toLocaleString()}</span>
                                                    </p>
                                                    {cancelScheduleError && (
                                                        <p className="text-sm text-red-600 mt-1">{cancelScheduleError}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCancelScheduleError("");
                                                    setCancelScheduleInput("");
                                                    setShowCancelScheduleModal(true);
                                                }}
                                                disabled={cancelingSchedule}
                                                className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-60"
                                            >
                                                {cancelingSchedule ? "Deshaciendo..." : "Deshacer programación"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <div className="border-2 border-[#4C3B63] rounded-xl max-w-full overflow-hidden mb-6">
                                <ChapterEditor
                                    chapterTitle={chapter.title}
                                    setChapterTitle={(value) => handleFieldChange("title", value)}
                                    chapterContent={chapter.content}
                                    setChapterContent={(value) => handleFieldChange("content", value)}
                                    chapterNumber={chapter.chapterNumber}
                                />
                            </div>

                            <ChapterActions
                                onSaveDraft={handleChapterActions}
                                onPreview={handlePreview}
                                formData={{ titulo: chapter.title, contenido: chapter.content }}
                                chapterId={chapter.id}
                                publicationStatus={chapter.publicationStatus}
                                price={chapter.price}
                                workId={chapter.workId}
                                allowAiTranslation={chapter.allowAiTranslation}
                                defaultLanguageCode={chapter.languageDefaultCode?.code}
                            />

                    { chapter.publicationStatus === 'DRAFT' ? (
                            <div className="mt-6">
                                <div className="border border-red-300 bg-red-50 text-red-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold">Eliminar capítulo</h4>
                                            <p className="text-sm">Esta acción no se puede deshacer.</p>
                                        </div>
                                        <button
                                            onClick={openDeleteModal}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        >
                                            Eliminar capítulo
                                        </button>
                                    </div>
                                </div>
                            </div> ) : null}

                            { chapter.publicationStatus === 'DRAFT' ? (
                            <PublishOptions
                                workId={Number(id)}
                                chapterId={Number(chapterId)}
                                onScheduleChange={(isoDate) => handleFieldChange("publishedAt", isoDate)}
                            /> ) : null}

                            {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
                        </div>

                        <div className="flex-[2] lg:max-w-[400px]">
                            <h3 className="text-center font-semibold mb-4 text-xl">
                                Herramientas avanzadas
                            </h3>
                            <label className="flex items-center space-x-2 mb-6">
                                <span>Permitir traducción con IA</span>
                                <input
                                    type="checkbox"
                                    checked={chapter.allowAiTranslation}
                                    onChange={(e) => handleFieldChange("allowAiTranslation", e.target.checked)}
                                />
                            </label>

                            <AdvancedTools
                                availableLanguages={chapter.availableLanguages}
                                defaultLanguageCode={chapter.languageDefaultCode}
                                onLanguageSelect={handleLanguageSelect}
                            />
                        </div>
                    </div>


                   {/* <InspirationBubble />  COMO AUN NO TIENE LOGICA NO LO MOSTRAMOS*/}
                    {showDeleteModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/40" onClick={closeDeleteModal} />
                            <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold mb-2">
                                    ¿Estás seguro que quieres eliminar el capítulo?
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Para confirmar, escribe exactamente:{" "}
                                    <span className="font-semibold">Eliminar Capitulo</span>
                                </p>
                                <input
                                    type="text"
                                    value={deleteInput}
                                    onChange={(e) => setDeleteInput(e.target.value)}
                                    placeholder="Eliminar Capitulo"
                                    className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-red-300"
                                />
                                {deleteError && <p className="text-sm text-red-600 mb-2">{deleteError}</p>}
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={closeDeleteModal}
                                        disabled={deleting}
                                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        disabled={deleteInput !== "Eliminar Capitulo" || deleting}
                                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {deleting ? "Eliminando..." : "Confirmar eliminación"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showCancelScheduleModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/40" onClick={() => !cancelingSchedule && setShowCancelScheduleModal(false)} />
                            <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold mb-2">¿Confirmar deshacer programación?</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Para confirmar, escribe exactamente: <span className="font-semibold">Deshacer Programacion</span>
                                </p>
                                <input
                                    type="text"
                                    value={cancelScheduleInput}
                                    onChange={(e) => setCancelScheduleInput(e.target.value)}
                                    placeholder="Deshacer Programacion"
                                    className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-red-300"
                                />
                                {cancelScheduleError && <p className="text-sm text-red-600 mb-2">{cancelScheduleError}</p>}
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => !cancelingSchedule && setShowCancelScheduleModal(false)}
                                        disabled={cancelingSchedule}
                                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (cancelScheduleInput !== "Deshacer Programacion" || cancelingSchedule) return;
                                            await handleCancelSchedule();
                                            setShowCancelScheduleModal(false);
                                        }}
                                        disabled={cancelScheduleInput !== "Deshacer Programacion" || cancelingSchedule}
                                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {cancelingSchedule ? "Deshaciendo..." : "Confirmar"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}
