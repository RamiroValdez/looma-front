import React, { useState } from "react";
import { type WorkDTO } from "../../../../domain/dto/WorkDTO";
import Button from "../../../components/Button";
import { notifyError, notifySuccess } from "../../../../infrastructure/services/ToastProviderService.ts";
import { subscribeToAuthor, subscribeToWork } from "../../../../infrastructure/services/paymentService.ts";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  work: WorkDTO;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, work }) => {
  const [isPaying, setIsPaying] = useState(false);
  const isAuthorSubscribed = Boolean(work.subscribedToAuthor);
  const isWorkSubscribed = Boolean(work.subscribedToWork);

  const authorPrice = work.creator?.money ?? 0;
  const workPrice = work.price ?? 0;
  const hasAuthorPlan = authorPrice > 0;
  const hasWorkPlan = workPrice > 0;

  const showAuthorCard = hasAuthorPlan && !isAuthorSubscribed;
  const showWorkCard = hasWorkPlan && !isWorkSubscribed;
  const visibleCards = (showAuthorCard ? 1 : 0) + (showWorkCard ? 1 : 0);

  const handleMercadoPagoClick = async (type: "author" | "work") => {
    try {
      setIsPaying(true);
      const paymentWindow = window.open("", "_blank");
      if (type === "author") {
        const authorId = work.creator?.id;
        if (!authorId) {
          notifyError("No se encontró el autor");
          if (paymentWindow && !paymentWindow.closed) paymentWindow.close();
          return;
        }
        const res = await subscribeToAuthor(authorId, "mercadopago");
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
          onClose();
        } else {
          if (paymentWindow && !paymentWindow.closed) paymentWindow.close();
          notifyError("No se recibió URL de pago");
        }
      } else {
        const res = await subscribeToWork(work.id, "mercadopago");
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
          onClose();
        } else {
          if (paymentWindow && !paymentWindow.closed) paymentWindow.close();
          notifyError("No se recibió URL de pago");
        }
      }
    } catch (e: unknown) {
      notifyError(e instanceof Error ? e.message : "No se pudo iniciar el pago");
    } finally {
      setIsPaying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl relative shadow-xl max-h-[80vh] overflow-y-auto flex justify-center p-4 sm:p-6 md:p-8 min-h-[400px] md:min-h-[600px]">
        <div className="absolute top-3 -right-1 md:top-4 md:right-4">
          <Button text="" onClick={() => { if (!isPaying) onClose(); }} disabled={isPaying} colorClass="cursor-pointer">
            <img src="/img/PopUpCierre.png" className="w-7 h-7 md:w-9 md:h-9 hover:opacity-60" alt="Cerrar" />
          </Button>
        </div>

        <div className="w-full">
          <div className="gap-4 w-full max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-[#5C17A6]">Selecciona tu suscripción</h3>
              <div className={`${visibleCards === 1 ? 'flex justify-center' : 'grid grid-cols-1 gap-6 md:grid-cols-2 justify-items-center'} w-full`}>
                {showAuthorCard && (
                  <div className="border-1 border-[#6a5a8c] rounded-xl p-4 sm:p-6 text-center shadow-2xl bg-[#e0d9f0] w-full max-w-[320px] sm:max-w-[340px] md:w-[350px] min-h-[280px] md:min-h-[350px]">
                    <h3 className="font-bold text-2xl sm:text-3xl m-1 md:mb-15 text-[#3c2a50]">Suscribirse al Autor</h3>
                    <h2 className="font-semibold text-5xl md:text-7xl xl:text-8xl text-[#3c2a50] m-1 md:mb-15">${authorPrice}</h2>
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-600 m-1 md:mb-15 min-h-[60px]">
                      Acceso total a todas las obras y capítulos del autor sin límite
                    </p>
                    <Button
                      text="Adquirir"
                      colorClass="bg-[#3c2a50] w-full text-white rounded-lg cursor-pointer hover:scale-103 py-3 font-semibold "
                      onClick={() => handleMercadoPagoClick("author")}
                      disabled={isPaying || isAuthorSubscribed}
                    />
                  </div>
                )}

                {showWorkCard && (
                  <div className="border-2 border-[#172FA6] rounded-xl p-4 sm:p-6 text-center bg-[#E8EDFC] w-full max-w-[320px] sm:max-w-[340px] md:w-[350px] min-h-[280px] md:min-h-[350px] shadow-2xl">
                    <h3 className="font-bold text-2xl sm:text-3xl m-1 md:mb-15 text-[#172FA6]">Suscribirse a la obra</h3>
                    <h2 className="font-semibold text-5xl md:text-7xl xl:text-8xl text-[#172FA6] m-1 md:mb-15">${workPrice}</h2>
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-600 m-1 md:mb-15 min-h-[60px]">
                      Acceso completo a todos los capítulos de <span className="font-semibold">{work.title}</span>
                    </p>
                    <Button
                      text="Adquirir"
                      colorClass="bg-[#172FA6] w-full text-white rounded-lg cursor-pointer hover:scale-103 py-3 font-semibold"
                      onClick={() => handleMercadoPagoClick("work")}
                      disabled={isPaying || isWorkSubscribed}
                    />
                  </div>
                )}

                { (isAuthorSubscribed || !hasAuthorPlan) && (isWorkSubscribed || !hasWorkPlan) && (
                  <div className="col-span-full text-center mt-4">
                    <p className="text-lg font-semibold text-gray-600">Ya posees todas las suscripciones disponibles para esta obra.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
