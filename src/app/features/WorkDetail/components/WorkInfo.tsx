import { type WorkDTO } from "../../../../domain/dto/WorkDTO";
import React, { useState } from "react";
import { notifyError, notifySuccess } from "../../../../infrastructure/services/ToastProviderService.ts";
import { subscribeToAuthor, subscribeToWork } from "../../../../infrastructure/services/paymentService.ts";
import Button from "../../../components/Button";
import LikeButton from "../../../components/LikeButton";
import StarRating from "../../../components/StarRating.tsx";
import Tag from "../../../components/Tag.tsx";
import { useReadChapterData } from "../hooks/useReadChapterData.ts";

interface WorkInfoProps {
  work: WorkDTO;
  manageFirstChapter: () => void;
  disableFirstChapter?: boolean;
}

export const WorkInfo: React.FC<WorkInfoProps> = ({ work, manageFirstChapter, disableFirstChapter = false }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthorSubscribed = Boolean(work.subscribedToAuthor);
  const isWorkSubscribed = Boolean(work.subscribedToWork);
  const { isWorkSaved, handdleToggleSaveWork } = useReadChapterData(work.id?.toString() || "");

  const closeModal = () => {
    if (isPaying) return;
    setIsModalOpen(false);
  };

    const handleMercadoPagoClick = async (type: "author" | "work") => {
    try {
      setIsPaying(true);
      const paymentWindow = window.open("", "_blank");
      const res = type === "author"
        ? await subscribeToAuthor(work.creator.id, "mercadopago")
        : await subscribeToWork(work.id, "mercadopago");
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
    } catch (e: unknown) {
        notifyError(e instanceof Error ? e.message : "No se pudo iniciar el pago");
    } finally {
      setIsPaying(false);
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
      disabled={isPaying || isAuthorSubscribed} 
      className="flex-1 bg-[#5c17a6] text-white py-2 rounded-lg text-base font-semibold hover:bg-[#5c17a6]/85 disabled:opacity-50 h-10 cursor-pointer"
    >
      {isAuthorSubscribed ? "Ya suscripto" : "Suscribirse"}
    </button>

    <button
      onClick={handdleToggleSaveWork}
      className={`flex-1 py-2 rounded-lg text-base font-semibold transition-colors h-10 ${
        isWorkSaved
          ? 'text-[#5C17A6] cursor-pointer border border-[#5C17A6]'
          : 'text-white cursor-pointer bg-[#3b245a]/90 disabled:opacity-50 disabled:cursor-not-allowed'
      }`}
    >
      {isWorkSaved ? "Guardado" : "Guardar"}
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
            <span className="text-[16px] font-semibold text-gray-700">1.7k</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span className="text-[16px] font-semibold text-gray-700"></span>
        </div>
      </div>

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

      <button onClick={manageFirstChapter} disabled={disableFirstChapter} className="w-full bg-[#5c17a6] text-white py-3 rounded-lg text-base font-semibold hover:bg-[#3c2a50] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        Primer capítulo →
      </button>

       {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-8 w-full max-w-5xl relative shadow-xl min-h-[600px]">
            <div className="absolute top-4 right-4">
              <Button text="" onClick={closeModal} disabled={isPaying} colorClass="cursor-pointer">
                <img src="/img/PopUpCierre.png" className="w-9 h-9 hover:opacity-60" alt="Cerrar" />
              </Button>
            </div>

            <div className="max-w-[800px] mx-auto">
              <h3 className="text-3xl font-bold mb-8 text-center text-[#5C17A6]">Selecciona tu suscripción</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center">
                <div className="border-1 border-[#6a5a8c] rounded-xl p-6 text-center shadow-2xl bg-[#e0d9f0] w-[350px] min-h-[350px]">
                  <h3 className="font-bold text-3xl mb-15 text-[#3c2a50]">Suscribirse al Autor</h3>
                  <h2 className="font-semibold text-8xl text-[#3c2a50] mb-15">$20</h2>
                  <p className="text-gray-600 text-2xl mb-15 min-h-[60px]">
                    Acceso total a todas las obras y capítulos del autor sin límite
                  </p>
                  <Button 
                    text="Adquirir" 
                    colorClass="bg-[#3c2a50] w-full text-white rounded-lg cursor-pointer hover:scale-103 py-3 font-semibold" 
                    onClick={() => {
                      handleMercadoPagoClick("author");
                    }}
                    disabled={isPaying || isAuthorSubscribed} 
                  />
                </div>

                <div className="border-2 border-[#172FA6] rounded-xl p-6 text-center bg-[#E8EDFC] w-[350px] min-h-[350px] shadow-2xl">
                  <h3 className="font-bold text-3xl mb-15 text-[#172FA6]">Suscribirse a la obra</h3>
                  <h2 className="font-semibold text-8xl text-[#172FA6] mb-15">${work.price}</h2>
                  <p className="text-gray-600 text-2xl mb-23 min-h-[60px]">
                    Acceso completo a todos los capítulos de <span className="font-semibold">{work.title}</span>
                  </p>
                  <Button 
                    text="Adquirir" 
                    colorClass="bg-[#172FA6] w-full text-white rounded-lg cursor-pointer hover:scale-103 py-3 font-semibold" 
                    onClick={() => {
                      handleMercadoPagoClick("work");
                    }}
                    disabled={isPaying || isWorkSubscribed} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}