import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdvancedTools from "../../components/addChapter/AdvancedTools";
import ChapterEditor from "../../components/addChapter/ChapterEditor";
import ChapterActions from "../../components/addChapter/ChapterActions";
import PublishOptions from "../../components/addChapter/PublishOptions";
import { useChapterActions } from "../../hooks/useChapterActions.ts";
import { getChapterById, updateChapterPrice } from "../../../infrastructure/services/ChapterService.ts";
import Button from "../../components/Button.tsx";
import { notifySuccess, notifyError } from "../../../infrastructure/services/ToastProviderService.ts";
import type { ChapterWithContentDTO } from "../../../domain/dto/ChapterWithContentDTO.ts";
import LoomiBubble from "../../components/Loomi-buble.tsx";
import BackButton from "../../components/BackButton";
import type { LanguageDTO } from "../../../domain/dto/LanguageDTO.ts";

export default function AddChapter() {
    const navigate = useNavigate();
    const { id, chapterId } = useParams<{ id: string; chapterId: string }>();

    // Idioma que el usuario selecciona (target) y el idioma actualmente mostrado
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    const [contentLanguage, setContentLanguage] = useState<string>("");
    const [isLanguageChanging, setIsLanguageChanging] = useState(false);

    const { data, isLoading: isLoadingFetch, error: errorFetch, isFetching } = getChapterById(Number(chapterId), selectedLanguage);
    const [chapter, setChapter] = useState<ChapterWithContentDTO | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteInput, setDeleteInput] = useState("");
    const [showCancelScheduleModal, setShowCancelScheduleModal] = useState(false);
    const [cancelScheduleInput, setCancelScheduleInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [pendingLanguages, setPendingLanguages] = useState<LanguageDTO[]>([]);

    const {
        error,
        handleConfirmDelete,
        deleting,
        deleteError,
        setDeleteError,
        handleCancelSchedule,
        cancelingSchedule,
        cancelScheduleError,
        setCancelScheduleError
    } = useChapterActions(id ?? "", chapter);

    useEffect(() => {
        if (errorFetch) {
            const status = (errorFetch as any)?.response?.status;
            if (status === 403 && id) navigate(`/work/${id}`);
        }
    }, [errorFetch, id, navigate]);

    // Inicialización y actualización tras fetch exitoso
    useEffect(() => {
        if (!data) return;
        // Si es la primera carga establecemos idioma de contenido
        if (!contentLanguage) {
            // El contenido inicial corresponde al idioma original (selectedLanguage vacío)
            setContentLanguage(selectedLanguage || data.languageDefaultCode.code);
        }

        // Solo actualizamos el capítulo y el idioma mostrado cuando:
        // - estamos cambiando de idioma y el fetch terminó
        // - o es la carga inicial
        if (isLanguageChanging || !chapter) {
            setChapter(data);
            // Si selectedLanguage está vacío, mostramos original; si no, mostramos el seleccionado
            if (selectedLanguage) {
                setContentLanguage(selectedLanguage);
            } else if (!contentLanguage) {
                setContentLanguage(data.languageDefaultCode.code);
            }
            setIsLanguageChanging(false);
        }
    }, [data, isLanguageChanging, selectedLanguage, contentLanguage, chapter]);

    const handleFieldChange = (field: keyof ChapterWithContentDTO, value: any) => {
        setChapter((prev) => (prev ? { ...prev, [field]: value } : prev));
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

    const handleSavePrice = async () => {
        try {
            if (!chapter) return;
            setIsSaving(true);
            const price = Number(chapter.price ?? 0);
            await updateChapterPrice(chapter.id, price || 0);
            notifySuccess("Precio guardado correctamente.");
        } catch (error) {
            console.error("Error al guardar el precio:", error);
            notifyError("Error al guardar el precio.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLanguageSelect = (languageCode: string) => {
        const current = contentLanguage || chapter?.languageDefaultCode?.code || "";
        if (languageCode === current) return; // Ya mostrado
        // Preparamos cambio de idioma: marcamos estado y cambiamos selectedLanguage
        setIsLanguageChanging(true);
        setSelectedLanguage(languageCode);
    };

    const handleAddLanguage = (language: LanguageDTO) => {
        // Agregar el idioma a la lista de disponibles si no está presente
        setChapter(prev => {
            if (!prev) return prev;
            const exists = prev.availableLanguages.some(l => l.code === language.code);
            if (exists) return prev;
            return {
                ...prev,
                availableLanguages: [...prev.availableLanguages, language]
            };
        });
        // Añadir también a la lista local para que aparezca de inmediato aunque el backend no lo devuelva aún
        setPendingLanguages(prev => prev.some(l => l.code === language.code) ? prev : [...prev, language]);
        // Cambiar automáticamente al nuevo idioma para comenzar a editarlo
        handleLanguageSelect(language.code);
    };

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

    // Idioma activo visual (el que se está mostrando ahora)
    const activeLanguage = contentLanguage || chapter?.languageDefaultCode?.code || "";
    // Key del editor basada en idioma efectivamente mostrado para evitar desfase
    const editorKey = chapter ? `${chapter.id}-${activeLanguage || 'default'}` : 'loading';

    const languageLoading = isLoadingFetch || isFetching || isLanguageChanging;

    // Combinar idiomas del capítulo con los pendientes para mostrar en la UI
    const combinedLanguages: LanguageDTO[] = (() => {
        if (!chapter) return pendingLanguages;
        const map = new Map<string, LanguageDTO>();
        for (const l of chapter.availableLanguages) map.set(l.code, l);
        for (const l of pendingLanguages) map.set(l.code, l);
        return Array.from(map.values());
    })();

    return (
        <div>
            {isLoadingFetch && !chapter ? (
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
                                <div className="flex items-center gap-4 p-6">
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
                    <div className="pl-5">
                        <BackButton to={`/manage-work/${id}`} />
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-[3] rounded-2xl p-6">
                            <h2 className="text-lg font-medium text-gray-700 mb-4">
                                Título de la serie: <span className="font-semibold">{chapter.workName}</span>
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">Idioma mostrado: <span className="font-medium">{activeLanguage.toUpperCase()}</span>{languageLoading && ' (cargando...)'}</p>
                            {chapter.publicationStatus === 'SCHEDULED' && chapter.scheduledPublicationDate ? (
                                <div className="mb-6">
                                    <div className="border border-blue-300 bg-blue-50 text-blue-800 rounded-lg p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm mt-0.5">i</div>
                                                <div>
                                                    <p className="font-semibold">Publicación programada</p>
                                                    <p className="text-sm">Programado para: <span className="font-medium">{new Date(chapter.scheduledPublicationDate).toLocaleString()}</span></p>
                                                    {cancelScheduleError && <p className="text-sm text-red-600 mt-1">{cancelScheduleError}</p>}
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
                            <div className="border-2 border-[#4C3B63] rounded-xl max-w-full overflow-hidden mb-6 relative">
                                {languageLoading && (
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 text-[#4C3B63] font-medium">
                                        Cargando versión...
                                    </div>
                                )}
                                <ChapterEditor
                                    chapterTitle={chapter.title}
                                    setChapterTitle={(value) => handleFieldChange("title", value)}
                                    chapterContent={chapter.content}
                                    setChapterContent={(value) => handleFieldChange("content", value)}
                                    chapterNumber={chapter.chapterNumber}
                                    editorKey={editorKey}
                                />
                            </div>

                            <ChapterActions
                                onPreview={handlePreview}
                                formData={{ titulo: chapter.title, contenido: chapter.content }}
                                chapterId={chapter.id}
                                publicationStatus={chapter.publicationStatus}
                                price={chapter.price}
                                workId={chapter.workId}
                                allowAiTranslation={chapter.allowAiTranslation}
                                defaultLanguageCode={chapter.languageDefaultCode?.code}
                                activeLanguageCode={activeLanguage}
                            />
                            {chapter.publicationStatus === 'DRAFT' && (
                                <div className="mt-6">
                                    <div className="border border-red-300 bg-red-50 text-red-700 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold">Eliminar capítulo</h4>
                                                <p className="text-sm">Esta acción no se puede deshacer.</p>
                                            </div>
                                            <button onClick={openDeleteModal} className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-full font-semibold hover:bg-red-700">Eliminar capítulo</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {chapter.publicationStatus === 'DRAFT' && (
                                <PublishOptions
                                    workId={Number(id)}
                                    chapterId={Number(chapterId)}
                                    onScheduleChange={(isoDate) => handleFieldChange("publishedAt", isoDate)}
                                />
                            )}
                            {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
                        </div>
                        <div className="flex-[2] lg:max-w-[400px] mt-4">
                            <h3 className="text-center font-semibold mb-4 text-xl">Herramientas avanzadas</h3>
                            <label className="flex items-center space-x-2 mb-6">
                                <span>Permitir traducción con IA</span>
                                <input
                                    type="checkbox"
                                    checked={chapter.allowAiTranslation}
                                    onChange={(e) => handleFieldChange("allowAiTranslation", e.target.checked)}
                                />
                            </label>
                            <AdvancedTools
                                availableLanguages={combinedLanguages}
                                defaultLanguageCode={chapter.languageDefaultCode}
                                onLanguageSelect={handleLanguageSelect}
                                activeLanguageCode={activeLanguage}
                                disabled={languageLoading}
                                onAddLanguage={handleAddLanguage}
                            />
                            <div>
                                <div className="flex justify-between items-center w-full mt-8">
                                    <div className="flex items-center gap-2">
                                        <label className="text-black font-medium text-base">Precio:</label>
                                        <div className="flex items-center border rounded">
                                            <span className="px-2 py-2 bg-gray-50 border-r border border-[#172fa6] text-base text-black">$</span>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={chapter.price || ''}
                                                onChange={(e) => handleFieldChange("price", e.target.value)}
                                                className="px-2 py-2 border border-[#172fa6] text-base text-black rounded-r focus:outline-none focus:ring-2 focus:ring-[#5C17A6] w-25"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            text={isSaving ? "Guardando..." : "Guardar"}
                                            onClick={handleSavePrice}
                                            colorClass={`px-4 py-2 bg-[#591b9b] font-semibold text-white rounded-full shadow hover:bg-purple-800 cursor-pointer`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showDeleteModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/40" onClick={closeDeleteModal} />
                            <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold mb-2">¿Estás seguro que quieres eliminar el capítulo?</h3>
                                <p className="text-sm text-gray-600 mb-4">Para confirmar, escribe exactamente: <span className="font-semibold">Eliminar Capitulo</span></p>
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
                                    >Cancelar</button>
                                    <button
                                        onClick={() => handleConfirmDelete(chapterId, deleteInput)}
                                        disabled={deleteInput !== "Eliminar Capitulo" || deleting}
                                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                    >{deleting ? "Eliminando..." : "Confirmar eliminación"}</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showCancelScheduleModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/40" onClick={() => !cancelingSchedule && setShowCancelScheduleModal(false)} />
                            <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold mb-2">¿Confirmar deshacer programación?</h3>
                                <p className="text-sm text-gray-600 mb-4">Para confirmar, escribe exactamente: <span className="font-semibold">Deshacer Programacion</span></p>
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
                                    >Cancelar</button>
                                    <button
                                        onClick={async () => {
                                            if (cancelScheduleInput !== "Deshacer Programacion" || cancelingSchedule) return;
                                            await handleCancelSchedule(chapterId);
                                            setShowCancelScheduleModal(false);
                                        }}
                                        disabled={cancelScheduleInput !== "Deshacer Programacion" || cancelingSchedule}
                                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                    >{cancelingSchedule ? "Deshaciendo..." : "Confirmar"}</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
            {chapter && (
                <LoomiBubble chapterId={chapter.id} chapterContent={chapter.content} publicationStatus={chapter.publicationStatus} />
            )}
        </div>
    );
}
