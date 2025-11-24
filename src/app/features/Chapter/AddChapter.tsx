import { useState } from "react";
import { useParams } from "react-router-dom";
import AdvancedTools from "../../components/addChapter/AdvancedTools";
import ChapterEditor from "../../components/addChapter/ChapterEditor";
import ChapterActions from "../../components/addChapter/ChapterActions";
import PublishOptions from "../../components/addChapter/PublishOptions";
import { useChapterActions } from "../../hooks/useChapterActions.ts";
import Button from "../../components/Button.tsx";
import type { ChapterWithContentDTO } from "../../../domain/dto/ChapterWithContentDTO.ts";
import LoomiBubble from "../../components/Loomi-buble.tsx";
import BackButton from "../../components/BackButton";
import type { LanguageDTO } from "../../../domain/dto/LanguageDTO.ts";
import { useChapterVersions } from "../../hooks/useChapterVersions";

export default function AddChapter() {
    const { id, chapterId } = useParams<{ id: string; chapterId: string }>();

    // Nuevo hook para gestionar versiones
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
        // hay cambios sucios: mostrar modal
        setTargetLanguageCandidate(code);
        setShowConfirmLanguageModal(true);
    };

    return (
        <div>
            {!chapter ? (
                <div className="min-h-screen flex items-center justify-center bg-[#F4F0F7]">
                    <p className="text-gray-600 text-lg">Cargando capítulo...</p>
                </div>
            ) : (
                <div className="min-h-screen bg-[#F4F0F7] px-4 sm:px-8 md:px-16 py-8 max-w-screen">
                    <div className="pl-5"><BackButton to={`/manage-work/${id}`} /></div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-[3] rounded-2xl p-6">
                            <h2 className="text-lg font-medium text-gray-700 mb-4">Título de la serie: <span className="font-semibold">{chapter.workName}</span></h2>
                            {chapter.publicationStatus === 'SCHEDULED' && chapter.scheduledPublicationDate && (
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
                                                onClick={() => { setCancelScheduleError(""); setCancelScheduleInput(""); setShowCancelScheduleModal(true); }}
                                                disabled={cancelingSchedule}
                                                className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-60"
                                            >{cancelingSchedule ? 'Deshaciendo...' : 'Deshacer programación'}</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="border-2 border-[#4C3B63] rounded-xl max-w-full overflow-hidden mb-6 relative">
                                {languageLoading && (
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 text-[#4C3B63] font-medium">Cargando versión...</div>
                                )}
                                <ChapterEditor
                                    chapterTitle={chapter.title}
                                    setChapterTitle={setTitle}
                                    chapterContent={versions[activeLanguage]?.content || ''}
                                    setChapterContent={updateContent}
                                    chapterNumber={chapter.chapterNumber}
                                    editorKey={editorKey}
                                />
                            </div>

                            <div className="flex flex-col justify-start sm:flex-row sm:items-center mb-6 gap-4">
                                <ChapterActions
                                    onPreview={handlePreview}
                                    publicationStatus={chapter.publicationStatus}
                                />
                                <div className="flex gap-4 items-center">
                                    <Button
                                        text={dirtyActive ? 'Guardar (Pendiente)' : 'Guardar'}
                                        onClick={() => saveActiveLanguage(chapter.allowAiTranslation)}
                                        colorClass={`px-4 py-2 ${dirtyActive ? 'bg-[#172FA6]' : 'bg-[#4C3B63]'} font-semibold text-white rounded-full shadow hover:brightness-110 cursor-pointer whitespace-nowrap flex-shrink-0`}
                                    />
                                    <Button
                                        text={deleting ? 'Eliminando...' : 'Eliminar capítulo'}
                                        onClick={openDeleteModal}
                                        colorClass={`px-4 py-2 bg-red-600 font-semibold text-white rounded-full shadow hover:bg-red-700 cursor-pointer disabled:opacity-60 whitespace-nowrap`}
                                    />
                                </div>
                            </div>

                            {chapter.publicationStatus === 'DRAFT' && (
                                <PublishOptions
                                    workId={Number(id)}
                                    chapterId={Number(chapterId)}
                                    onScheduleChange={() => { /* noop */ }}
                                    formData={{ titulo: chapter.title, contenido: versions[activeLanguage]?.content || '' }}
                                    price={chapter.price || 0}
                                    allowAiTranslation={chapter.allowAiTranslation}
                                    defaultLanguageCode={chapter.languageDefaultCode?.code}
                                    activeLanguageCode={activeLanguage}
                                />
                            )}
                            {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
                        </div>
                        <div className="flex-[2] lg:max-w-[400px] mt-4">
                            <h3 className="text-center font-semibold mb-4 text-xl">Herramientas avanzadas</h3>
                            <AdvancedTools
                                availableLanguages={combinedLanguages}
                                defaultLanguageCode={chapter.languageDefaultCode}
                                onLanguageSelect={requestLanguageChange}
                                activeLanguageCode={activeLanguage}
                                disabled={languageLoading}
                                onAddLanguage={addLanguage}
                            />
                            <div>
                                <div className="flex justify-between items-center w-full mt-8 gap-4">
                                    <div className="flex items-center gap-2 flex-1">
                                        <label className="text-black font-medium text-base">Precio:</label>
                                        <div className="flex items-center border rounded">
                                            <span className="px-2 py-2 bg-gray-50 border-r border border-[#172fa6] text-base text-black">$</span>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={chapter.price || ''}
                                                onChange={(e) => setPriceValue(Number(e.target.value))}
                                                className="px-2 py-2 border border-[#172fa6] text-base text-black rounded-r focus:outline-none focus:ring-2 focus:ring-[#5C17A6] w-25"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Button
                                            text={ priceSaving ? 'Guardando...' : 'Guardar precio'}
                                            onClick={savePrice}
                                            colorClass={`px-4 py-2 bg-[#591b9b] font-semibold text-white rounded-full shadow hover:bg-purple-800 cursor-pointer disabled:opacity-60`}
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
                                    <button onClick={closeDeleteModal} disabled={deleting} className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50">Cancelar</button>
                                    <button onClick={() => handleConfirmDelete(chapterId, deleteInput)} disabled={deleteInput !== 'Eliminar Capitulo' || deleting} className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">{deleting ? 'Eliminando...' : 'Confirmar eliminación'}</button>
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
                                    <button onClick={() => !cancelingSchedule && setShowCancelScheduleModal(false)} disabled={cancelingSchedule} className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50">Cancelar</button>
                                    <button onClick={async () => { if (cancelScheduleInput !== 'Deshacer Programacion' || cancelingSchedule) return; await handleCancelSchedule(chapterId); setShowCancelScheduleModal(false); }} disabled={cancelScheduleInput !== 'Deshacer Programacion' || cancelingSchedule} className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">{cancelingSchedule ? 'Deshaciendo...' : 'Confirmar'}</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showConfirmLanguageModal && targetLanguageCandidate && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4 overflow-x-hidden">
                            <div className="absolute inset-0 bg-black/40" onClick={() => setShowConfirmLanguageModal(false)} />
                            <div className="relative z-10 w-full max-w-screen -ml-2 sm:ml-auto sm:max-w-xl lg:max-w-2xl bg-white rounded-xl shadow-lg p-4 sm:p-6 mx-auto max-h-[90vh] overflow-y-auto">
                                <h3 className="text-lg font-semibold mb-2">Cambiar de idioma</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Tienes cambios sin guardar en el idioma actual. Si cambias a <span className="font-semibold">{targetLanguageCandidate.toUpperCase()}</span> sin guardar, podrás volver luego pero los cambios siguen pendientes aquí. ¿Deseas continuar?
                                </p>
                                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 w-full">
                                    <button
                                        onClick={() => { setShowConfirmLanguageModal(false); setTargetLanguageCandidate(null); }}
                                        className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 w-full sm:w-auto"
                                    >Cancelar</button>
                                    <button
                                        onClick={() => { switchLanguage(targetLanguageCandidate); setShowConfirmLanguageModal(false); setTargetLanguageCandidate(null); }}
                                        className="px-4 py-2 rounded-full bg-[#172FA6] text-white hover:bg-[#0e1c80] w-full sm:w-auto"
                                    >Cambiar sin guardar</button>
                                    <button
                                        onClick={async () => { await saveActiveLanguage(chapter.allowAiTranslation); switchLanguage(targetLanguageCandidate); setShowConfirmLanguageModal(false); setTargetLanguageCandidate(null); }}
                                        className="px-4 py-2 rounded-full bg-[#4C3B63] text-white hover:bg-[#3b2c4e] w-full sm:w-auto"
                                    >Guardar y cambiar</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {chapter && (
                <LoomiBubble chapterId={chapter.id} chapterContent={versions[activeLanguage]?.content || ''} publicationStatus={chapter.publicationStatus} />
            )}
        </div>
    );
}
