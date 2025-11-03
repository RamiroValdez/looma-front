import { type WorkDTO } from "../../../../domain/dto/WorkDTO";
import React, { useState } from "react";
import { notifyError, notifySuccess } from "../../../../infrastructure/services/ToastProviderService.ts";
import { subscribeToAuthor, subscribeToWork } from "../../../../infrastructure/services/paymentService.ts";
import Button from "../../../components/Button";
import LikeButton from "../../../components/LikeButton";
import { useNavigate } from "react-router-dom";
import StarRating from "../../../components/StarRating.tsx";
import Tag from "../../../components/Tag.tsx";

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
  const navigate = useNavigate();

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
        <button 
            onClick={() => {
              setIsModalOpen(true);
            }}
            disabled={isPaying || isAuthorSubscribed} 
            className="font-semibold w-1/2 flex-1 bg-[#5c17a6] text-white py-2 rounded-lg text-base hover:bg-[#5c17a6]/85 disabled:opacity-50 h-10 cursor-pointer"
          >
            {isAuthorSubscribed ? "Ya suscripto" : "Suscribirse"}
          </button>
          <button 
          disabled={isAuthorSubscribed}
          className="font-semibold cursor-pointer flex-1 bg-[#3c2a50] hover:bg-[#3c2a50]/85 text-white py-2 rounded-lg text-base h-10 items-center justify-center flex w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => navigate('/saved')}        
        >
          {isAuthorSubscribed ? "Guardado" : "Guardar"}
        </button>
      </div>

      <div className="flex items-center gap-6 ">
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
              stroke="#3b82f6"
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
      </div>
        <div className="flex flex-col mt-4 items-center">
            <StarRating workId={work.id} initialValue={work.averageRating} />
        </div>
      <button disabled={true} className="bg-[#172fa6] text-white py-2 px-4 sm:px-8 rounded-lg text-sm disabled:opacity-50 cursor-not-allowed w-full sm:w-auto sm:min-w-[162px]">
          Exportar EPUB
        </button>
      <div className="flex items-center justify-between gap-6 px-8">
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
          <span className="text-[16px] font-semibold text-gray-700">Descargar</span>
        </div>
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
          <div className="bg-[#E3E3E3] rounded-xl p-8 w-full max-w-3xl relative shadow-xl">
            <div className="absolute top-4 right-4">
              <Button text="" onClick={closeModal} disabled={isPaying} colorClass="cursor-pointer">
                <img src="/img/PopUpCierre.png" className="w-9 h-9 hover:opacity-60" alt="Cerrar" />
              </Button>
            </div>

            <h3 className="text-3xl font-bold mb-8 text-center">Selecciona tu suscripción</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Opción Autor */}
              <div className="border-2 border-[#172FA6] rounded-xl p-6 transition text-center shadow-2xl bg-white">
                <h3 className="font-bold text-2xl mb-2">Suscribirse al Autor</h3>
                <h2 className="font-semibold text-2xl text-[#5C17A6] mb-4">Desde $20</h2>
                <p className="text-gray-600 mb-6 min-h-[60px]">
                  Acceso total a todas las obras y capítulos del autor sin límite
                </p>
                <Button 
                  text="Adquirir" 
                  colorClass="bg-[#172FA6] w-full text-white rounded-lg cursor-pointer hover:scale-103 py-3 font-semibold" 
                  onClick={() => {
                    handleMercadoPagoClick("author");
                  }}
                  disabled={isPaying || isAuthorSubscribed} 
                />
              </div>

              {/* Opción Obra */}
              <div className="border-2 border-[#172FA6] rounded-xl p-6 transition text-center bg-white shadow-2xl">
                <h3 className="font-bold text-2xl mb-2">Suscribirse a la obra</h3>
                <h2 className="font-semibold text-2xl text-[#5C17A6] mb-4">Desde $5</h2>
                <p className="text-gray-600 mb-6 min-h-[60px]">
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