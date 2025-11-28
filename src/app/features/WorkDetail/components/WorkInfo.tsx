import { type WorkDTO } from "../../../../domain/dto/WorkDTO";
import React, { useState, useEffect } from "react";
import { notifyError, notifySuccess } from "../../../../infrastructure/services/ToastProviderService.ts";
import LikeButton from "../../../components/LikeButton";
import StarRating from "../../../components/StarRating.tsx";
import Tag from "../../../components/Tag.tsx";
import { useWorkData } from "../hooks/userWorkData.ts";
import { Loader } from "../../../components/Loader.tsx";
import { getTotalSubscribersPerWork } from "../../../../infrastructure/services/WorkService.ts";
import { downloadEpub } from "../../../../infrastructure/services/WorkService.ts";
import { downloadPdf } from "../../../../infrastructure/services/WorkService.ts";
import SubscriptionModal from "./SubscriptionModal";

interface WorkInfoProps {
  work: WorkDTO;
  manageFirstChapter: () => void;
  disableFirstChapter?: boolean;
}

export const WorkInfo: React.FC<WorkInfoProps> = ({ work, manageFirstChapter, disableFirstChapter = false }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthorSubscribed = Boolean(work.subscribedToAuthor);
  const isWorkSubscribed = Boolean(work.subscribedToWork); // nueva variable
  const { isWorkSaved, isSaving, handdleToggleSaveWork } = useWorkData(work.id);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isPreparingDownload, setIsPreparingDownload] = useState(false);
  const [downloadType, setDownloadType] = useState<'epub' | 'pdf' | null>(null);

  const openDownloadModal = () => setIsDownloadModalOpen(true);
  const closeDownloadModal = () => setIsDownloadModalOpen(false);


  const handleDownloadEpub = async () => {
    if (!work) return;
    setDownloadType('epub');
    setIsPreparingDownload(true);
    try {
      const epubFile = await downloadEpub(work.id);
      if (epubFile?.url) {
        const link = document.createElement('a');
        link.href = epubFile.url;
        link.download = `${work.title}.epub`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notifySuccess("Descarga de EPUB iniciada.");
      } else {
        notifyError("No se ha podido completar la descargar EPUB.");
      }
    } catch (e) {
      notifyError("Error al descargar el ePub.");
    } finally {
      setIsPreparingDownload(false);
      setDownloadType(null);
    }
  };

  useEffect(() => {
  getTotalSubscribersPerWork(work.id)
    .then(setSubscriberCount)
    .catch(() => setSubscriberCount(0));
}, [work.id]);

 const handleDownloadPdf = async () => {
  if (!work) return;
  setDownloadType('pdf');
  setIsPreparingDownload(true);
  try {
    const pdfFile = await downloadPdf(work.id);
    if (pdfFile?.url) {
      window.open(pdfFile.url, "_blank");
      notifySuccess("PDF listo para descargar.");
    } else {
      notifyError("No se ha podido completar la descarga PDF.");
    }
  } catch (e) {
    notifyError("Error al descargar el PDF.");
  } finally {
    setIsPreparingDownload(false);
    setDownloadType(null);
  }
};
  
  return (
    <div className="bg-white space-y-6 ">
        <div className="flex flex-wrap gap-2">
  <div className="w-full">
    <StarRating workId={work.id} initialValue={work.averageRating} />
  </div>
  
  <div className="flex gap-2 w-full">
    <button 
      onClick={() => {
        setIsModalOpen(true);
      }}
      disabled={isAuthorSubscribed || isWorkSubscribed} // deshabilitar si cualquiera
      className="flex-1 bg-[#5c17a6] text-white py-2 rounded-lg text-base font-semibold hover:bg-[#5c17a6]/85 disabled:opacity-50 h-10 cursor-pointer"
    >
      {isAuthorSubscribed || isWorkSubscribed ? "Ya suscripto" : "Suscribirse"}
    </button>

    <button
      onClick={handdleToggleSaveWork}
      disabled={isSaving}
      className={`flex-1 py-2 rounded-lg text-base font-semibold transition-colors h-10 ${
        isWorkSaved
          ? 'text-[#5C17A6] cursor-pointer border border-[#5C17A6]'
          : 'text-white cursor-pointer hover:bg-[#2a1c3a] bg-[#3b245a]/90 disabled:opacity-50 disabled:cursor-not-allowed'
      }`}
    >
      {isSaving ? (
        <Loader size="xs" color="primary" />
      ) : (
        isWorkSaved ? "Guardado" : "Guardar"
      )}
    </button>
  </div>
</div>

      <div className="flex items-center mb-0 gap-6 ">
        <div className="flex items-center gap-2 text-gray-700">
            <LikeButton workId={work.id}
            initialLiked={work.likedByUser}
            initialCount={work.likes}
            type="work"/>
        </div>

          <div className="flex items-center gap-2 text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#172FA6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6M23 11h-6" />
            </svg>
            <span className="text-[16px] font-semibold text-gray-700">{subscriberCount}</span>
          </div>
  <button
    className="flex items-center gap-2 rounded-lg text-base font-semibold cursor-pointer" 
    onClick={openDownloadModal}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="#172FA6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>

  </button>

  {isDownloadModalOpen && (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md relative shadow-xl flex flex-col items-center">
        <button
          className="absolute top-4 right-4 cursor-pointer"
          onClick={closeDownloadModal}
        >
          <img src="/img/PopUpCierre.png" className="w-8 h-8 hover:opacity-60" alt="Cerrar" />
        </button>
        <h3 className="text-2xl font-bold mb-8 text-center text-[#172FA6]">Descargar {work.title}</h3>
        <div className="flex gap-6 justify-center">
          <div className="flex flex-col items-center border border-[#172FA6] rounded-lg p-6 shadow hover:scale-103 transition cursor-pointer"
            onClick={() => {
              handleDownloadEpub();
              closeDownloadModal();
            }}
          >
            <img src="/img/epub.png" alt="EPUB" className="w-12 h-12 mb-2" />
            <span className="font-semibold text-[#172FA6]">Exportar EPUB</span>
          </div>
          <div className="flex flex-col items-center border border-[#5C17A6] rounded-lg p-6 shadow hover:scale-103 transition cursor-pointer"
            onClick={() => {
              handleDownloadPdf();
              closeDownloadModal();
            }}
          >
            <img src="/img/pdf.png" alt="PDF" className="w-12 h-12 mb-2" />
            <span className="font-semibold text-[#5C17A6]">Exportar PDF</span>
          </div>
        </div>
      </div>
    </div>
  )}
      </div>

      {/* Modal de carga durante la preparación de la descarga */}
      {isPreparingDownload && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/60" aria-live="polite" aria-label="Preparando descarga">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm flex flex-col items-center gap-4 shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#5C17A6] border-t-transparent"></div>
            <p className="text-[#5C17A6] font-semibold">
              {downloadType === 'epub' ? 'Generando archivo EPUB...' : downloadType === 'pdf' ? 'Generando archivo PDF...' : 'Preparando descarga...'}
            </p>
            <p className="text-gray-500 text-sm text-center">Esto puede tardar unos segundos.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-6 px-8">

      </div>

      <p className="text-gray-700 leading-relaxed text-[15px]">{work.description}</p>

      <div className="flex flex-wrap gap-2">
        {work.categories.map((category) => (
          <Tag
            text={category.name}
            key={category.id}
            colorClass="bg-[#172FA6] border border-gray-200 px-4 py-2 rounded-full shadow-sm transition text-sm font-base text-white"
          >
          </Tag>
        ))}
      </div>

      <button onClick={manageFirstChapter} disabled={disableFirstChapter} className="w-full bg-[#5c17a6] text-white py-3 rounded-full text-base font-semibold hover:bg-[#3c2a50] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        Primer capítulo →
      </button>

      <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} work={work} />
    </div>
  );
};
