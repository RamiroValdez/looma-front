import { useSubscriptions } from "./hooks/useSubscriptions";
import { WorkItemSearch } from "../../components/WorkItemSearch";

export const Subscriptions = () => {
  const { subscriptions, isLoading } = useSubscriptions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full">
        <div className="text-center p-8">Cargando suscripciones...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 container p-4 flex flex-col mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#000000]">Mis Suscripciones</h2>
      <p className="text-gray-600 mb-4">Obras y autores a los que estás suscrito</p>
      <p className="text-sm text-gray-500 mb-4">
        {subscriptions.length} {subscriptions.length === 1 ? 'obra disponible' : 'obras disponibles'}
      </p>
      <div className="flex flex-row flex-wrap gap-6 mt-2">
        {subscriptions.map((work) => (
          <WorkItemSearch key={work.id} work={work} />
        ))}
      </div>
      {subscriptions.length === 0 && (
        <div className="flex flex-col items-center justify-center p-16 text-gray-500 min-h-[20hv]">
          <img src="/img/triste_1.png" alt="no subscriptions" className="w-70 h-70 mb-8" />
          <div>No tienes suscripciones activas.</div>
        </div>
      )}
      {subscriptions.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Las suscripciones incluyen obras de autores suscritos y obras individuales
          </p>
        </div>
      )}
    </div>
  );
};