import { useEffect, useState } from "react";
import { WorkItemSubscriptions } from "./components/WorkItemSubscriptions";
import ProfileMenu from "./components/ProfileMenu";
import type { WorkCardDto } from "../../../domain/dto/WorkCardDTO";
import { GetSubscriptions } from "../../../infrastructure/services/SubscriptionsService";

export const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<WorkCardDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const works = await GetSubscriptions();
        setSubscriptions(works as WorkCardDto[]);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <ProfileMenu />
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center p-8">Cargando suscripciones...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <ProfileMenu />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Suscripciones</h1>
            <p className="text-gray-600 mb-4">Obras y autores a los que estás suscrito</p>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {subscriptions.length} {subscriptions.length === 1 ? 'obra disponible' : 'obras disponibles'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subscriptions.map((work) => (
              <WorkItemSubscriptions key={work.id} work={work} />
            ))}
          </div>

          {subscriptions.length === 0 && (
            <div className="text-center p-8 text-gray-500">
              No tienes suscripciones activas.
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
      </div>
    </div>
  );
};