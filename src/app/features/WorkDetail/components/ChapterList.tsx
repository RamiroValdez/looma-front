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
     if (!isUnlocked) {
      openAcquireModal(chapter);
      return;
    }
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
        <div key={chapter.id} className="py-0">
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
          <div className="bg-[#E3E3E3] rounded-xl p-8 w-full max-w-md relative shadow-xl">
            <div className="absolute top-4 right-4">
              <Button text="" onClick={closeModal} disabled={isPaying} colorClass="cursor-pointer">
                <img src="/img/PopUpCierre.png" className="w-9 h-9 hover:opacity-60" alt="Cerrar" />
              </Button>
            </div>

            <h3 className="text-2xl font-bold mb-6 text-center">Comprar Capítulo</h3>

            <div className="border-2 border-[#172FA6] rounded-xl p-6 transition text-center shadow-2xl bg-white">
              <h3 className="font-bold text-xl mb-2">Capítulo: {selectedChapter?.title}</h3>
              <h2 className="font-semibold text-2xl text-[#5C17A6] mb-4">${selectedChapter?.price}</h2>
              <p className="text-gray-600 mb-6">
                Acceso permanente a este capítulo
              </p>
              <Button 
                text="Adquirir" 
                colorClass="bg-[#172FA6] w-full text-white rounded-lg cursor-pointer hover:bg-[#0f1f70] py-3 font-semibold" 
                onClick={handleMercadoPagoClick}
                disabled={isPaying} 
              />
            </div>

            {isPaying && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">Redirigiendo a MercadoPago...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}