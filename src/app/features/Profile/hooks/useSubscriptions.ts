import { useEffect, useState } from "react";
import { GetSubscriptions } from "../../../../infrastructure/services/SubscriptionsService";
import type { WorkCardDto } from "../../../../domain/dto/WorkCardDTO";

export function useSubscriptions() {
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

  return { subscriptions, isLoading };
}