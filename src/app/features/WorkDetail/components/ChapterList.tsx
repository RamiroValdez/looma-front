import { type ChapterDTO } from "../../../../domain/dto/ChapterDTO";
import React, { useMemo, useState } from "react";
import { ChapterListItem } from "./ChapterListItem";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { subscribeToChapter } from "../../../../infrastructure/services/paymentService.ts";
import { notifyError, notifySuccess } from "../../../../infrastructure/services/ToastProviderService.ts";

interface ChapterListProps {
  chapters: ChapterDTO[];
  originalLanguage: string;
  subscribedToAuthor?: boolean;
  subscribedToWork?: boolean;
  unlockedChapters?: number[]; 
  workId: number;
}

export const ChapterList: React.FC<ChapterListProps> = ({ chapters, originalLanguage, subscribedToAuthor, subscribedToWork, unlockedChapters, workId }) => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<ChapterDTO | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const handleChapterClick = (chapter: ChapterDTO, isUnlocked: boolean) => {
    if (!isUnlocked) return;
    const chapterData = {
      ...chapter,
      content: chapter.description || "Contenido no disponible",
      originalLanguage,
    };
    navigate(`/work/chapter/${encodeURIComponent(JSON.stringify(chapterData.id))}/read`);
  };

  const sortedChapters = useMemo(() => [...chapters].sort((a, b) => a.id - b.id), [chapters]);
  const allUnlocked = Boolean(subscribedToAuthor) || Boolean(subscribedToWork);
  const unlockedSet = useMemo(() => new Set<number>([...(unlockedChapters || [])]), [unlockedChapters]);

  const openAcquireModal = (chapter: ChapterDTO) => {
    setSelectedChapter(chapter);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isPaying) return;
    setIsModalOpen(false);
    setSelectedChapter(null);
  };
  const handleMercadoPagoClick = async () => {
    if (!selectedChapter) return;
    try {
      setIsPaying(true);
      const paymentWindow = window.open("", "_blank");
      const res = await subscribeToChapter(selectedChapter.id, workId, "mercadopago");
      let url = (res.redirectUrl || "").toString().trim();
      if (url && !/^https?:\/\//i.test(url)) {
        url = `${window.location.origin}${url.startsWith('/') ? url : '/' + url}`;
      }
      if (url) {
        if (paymentWindow && !paymentWindow.closed) {
          try {
            paymentWindow.location.href = url;
          } catch {
            window.open(url, "_blank");
            if (paymentWindow) paymentWindow.close();
          }
        } else {
          window.open(url, "_blank");
        }
        notifySuccess("Redirigiendo a MercadoPago...");
        closeModal();
      } else {
        if (paymentWindow && !paymentWindow.closed) paymentWindow.close();
        notifyError("No se recibió URL de pago");
      }
    } catch (e: any) {
        notifyError(e instanceof Error ? e.message : "No se pudo iniciar el pago");
    } finally {
        setIsPaying(false);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden divide-y-2 divide-gray-300">
      {sortedChapters.map((chapter, index) => {
        const displayIndex = index + 1; 
        const isUnlocked = allUnlocked || unlockedSet.has(chapter.id);
        return (
          chapter.publicationStatus === "PUBLISHED" && (
        <div key={chapter.id} className="py-0 px-2">
          <ChapterListItem
            key={chapter.id}
            chapter={chapter}
            index={displayIndex}
            disabled={!isUnlocked}
            onClick={() => handleChapterClick(chapter, isUnlocked)}
            onAcquire={() => openAcquireModal(chapter)}
            workId={workId}
          />
        </div>
          )
        );
      })}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <div className="absolute top-4 right-4">
              <Button text="" onClick={closeModal} disabled={isPaying} colorClass="cursor-pointer">
                <img src="/img/PopUpCierre.png" className="w-6 h-6 hover:opacity-60" alt="Cerrar" />
              </Button>
            </div>
            <h3 className="text-2xl font-bold mb-4">Adquirir capítulo</h3>
            <p className="mb-4">Selecciona un método de pago</p>
            <div
              className={`border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer ${isPaying ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={handleMercadoPagoClick}
            >
              <div className="flex items-center gap-3">
                <img src="/img/mercadopago.png" alt="MercadoPago" className="w-8 h-8" />
                <div className="flex flex-col">
                  <span className="font-semibold">Pagar con MercadoPago</span>
                  <span className="text-sm text-gray-500">Tarjeta, débito, efectivo y más</span>
                </div>
              </div>
              <span className="text-[#5c17a6] font-semibold">Continuar</span>
            </div>
            {isPaying && <p className="mt-4 text-sm text-gray-500">Iniciando pago...</p>}
          </div>
        </div>
      )}
    </div>
  );
};
