import { type WorkDTO } from "../../../../domain/dto/WorkDTO";
import React, { useState } from "react";
import { notifyError, notifySuccess } from "../../../../infrastructure/services/ToastProviderService.ts";
import { subscribeToAuthor, subscribeToWork } from "../../../../infrastructure/services/paymentService.ts";
import Button from "../../../components/Button";

interface WorkInfoProps {
  work: WorkDTO;
  manageFirstChapter: () => void;
  disableFirstChapter?: boolean;
}

export const WorkInfo: React.FC<WorkInfoProps> = ({ work, manageFirstChapter, disableFirstChapter = false }) => {
  const likesFormatted = work.likes >= 1000 ? (work.likes / 1000).toFixed(1) + "k" : work.likes;
  const [isPaying, setIsPaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"author" | "work" | null>(null);
  const isAuthorSubscribed = Boolean(work.subscribedToAuthor);
  const isWorkSubscribed = Boolean(work.subscribedToWork);

  const handleSubscribeAuthor = () => {
    setModalMode("author");
    setIsModalOpen(true);
  };

  const handleBuyWork = () => {
    setModalMode("work");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isPaying) return;
    setIsModalOpen(false);
    setModalMode(null);
  };

  const handleMercadoPagoClick = async () => {
    if (!modalMode) return;
    try {
      setIsPaying(true);
      const res = modalMode === "author"
        ? await subscribeToAuthor(work.creator.id, "mercadopago")
        : await subscribeToWork(work.id, "mercadopago");
      let url = (res.redirectUrl || "").toString().trim();
      if (url.toLowerCase() === "about:blank") {
        url = "";
      }
      if (url && !/^https?:\/\//i.test(url)) {
        url = `${window.location.origin}${url.startsWith('/') ? url : '/' + url}`;
      }
      if (url) {
        const newWindow = window.open(url, "_blank");
        if (!newWindow) {
          // Fallback if popup was blocked
          window.location.href = url;
        }
        notifySuccess("Redirigiendo a MercadoPago...");
        closeModal();
      } else {
        if (res.fetchStatus === 201) {
          const msg = modalMode === "work" ? "Obra adquirida con exito" : "Suscripción al autor realizada con exito";
          notifySuccess(msg);
          closeModal();
          window.location.reload();
        } else {
          notifyError("No se recibió URL de pago. Intenta nuevamente.");
        }
      }
    } catch (e: unknown) {
        notifyError(e instanceof Error ? e.message : "No se pudo iniciar el pago");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="p-8 bg-white space-y-6 ">
         <div className="flex flex-wrap gap-3">
        <button disabled={true} className=" disabled:opacity-50 cursor-not-allowed flex-1 bg-[#3c2a50] text-white py-2 rounded-lg text-sm">
          Guardar
        </button>
        <button onClick={handleSubscribeAuthor} disabled={isPaying || isAuthorSubscribed} className="flex-1 bg-[#5c17a6] text-white py-2 rounded-lg text-sm  disabled:opacity-50">
          {isAuthorSubscribed ? "Ya suscripto" : "Suscribirse (Autor)"}
        </button>
        <button onClick={handleBuyWork} disabled={isPaying || isWorkSubscribed || isAuthorSubscribed} className="flex-1 bg-[#172fa6] text-white py-2 rounded-lg text-sm disabled:opacity-50">
          {isWorkSubscribed || isAuthorSubscribed ? "Ya adquirido" : "Adquirir Obra"}
        </button>
  
      </div>

      <div className="flex items-center gap-6 ">
        <div className="flex items-center gap-2 text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c026d3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="text-[16px] font-semibold text-gray-700">{likesFormatted}</span>
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
         <button disabled={true} className="flex-1 bg-[#172fa6] text-white py-2 rounded-lg text-sm disabled:opacity-50 cursor-not-allowed">
          Exportar EPUB
        </button>
      </div>

      <p className="text-gray-700 leading-relaxed text-[15px]">{work.description}</p>

      <div className="flex flex-wrap gap-2">
        {work.categories.map((category) => (
          <span
            key={category.id}
            className="bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-100 transition text-sm font-medium"
          >
            {category.name}
          </span>
        ))}
      </div>

      <button onClick={manageFirstChapter} disabled={disableFirstChapter} className="w-full bg-[#5c17a6] text-white py-3 rounded-lg text-base font-semibold hover:bg-[#3c2a50] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        Primer capítulo →
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <div className="absolute top-4 right-4">
              <Button text="" onClick={closeModal} disabled={isPaying} colorClass="cursor-pointer">
                <img src="/img/PopUpCierre.png" className="w-6 h-6 hover:opacity-60" alt="Cerrar" />
              </Button>
            </div>
            <h3 className="text-2xl font-bold mb-4">{modalMode === 'author' ? 'Suscribirse al Autor' : 'Adquirir Obra'}</h3>
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
