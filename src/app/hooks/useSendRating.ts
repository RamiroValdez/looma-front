import { useState } from "react";
import { sendRating } from "../../infrastructure/services/RatingService";

export function useSendRating(workId: number) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRating = async (rating: number) => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      await sendRating(workId, rating);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "Error desconocido");
    }
    setLoading(false);
  };

  return { loading, success, error, submitRating };
}