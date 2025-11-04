import React, { useState, useEffect } from "react";
import { sendRating, getWorkRatings } from "../../infrastructure/services/RatingService";

type StarRatingProps = {
  workId: number;
  initialValue?: number;
};

const StarRating: React.FC<StarRatingProps> = ({ workId, initialValue = 0 }) => {
  const [rating, setRating] = useState<number>(initialValue);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  const [average, setAverage] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(0);

  const fetchRatings = async () => {
    try {
      const data = await getWorkRatings(workId);
      setAverage(data.averageRating);
      setTotal(data.totalRatings);
    } catch {
      setAverage(null);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [workId]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, starValue: number) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    const isHalf = clickX < width / 2;
    const newRating = isHalf ? starValue - 0.5 : starValue;
    setRating(newRating);
  };

  const handleSendRating = async () => {
    setLoading(true);
    setSuccess(false);
    setErrorMsg(null);
    try {
      await sendRating(workId, rating);
      setSuccess(true);
      fetchRatings(); 
    } catch (e: any) {
      setErrorMsg("Error al enviar la valoración");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col mt-4 scale-90">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-lg text-yellow-600">
          {average !== null ? average.toFixed(1) : "—"}
        </span>
        <span className="text-gray-500 text-sm">
          ({total} valoraciones)
        </span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              viewBox="0 0 24 24"
              fill={average && average >= star ? "#FFD700" : "#d3d3d3"}
              className="w-5 h-5"
            >
              <path d="M12 .587l3.668 7.568L24 9.748l-6 5.85L19.335 24 12 19.897 4.665 24 6 15.598 0 9.748l8.332-1.593z" />
            </svg>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = rating === star - 0.5;
          return (
            <div
              key={star}
              className="relative w-8 h-8 cursor-pointer"
              onClick={(e) => handleClick(e, star)}
              style={{ display: "inline-block" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="#d3d3d3"
                className="w-8 h-8 absolute"
              >
                <path d="M12 .587l3.668 7.568L24 9.748l-6 5.85L19.335 24 12 19.897 4.665 24 6 15.598 0 9.748l8.332-1.593z" />
              </svg>
              {(filled || half) && (
                <div
                  className={`absolute top-0 left-0 h-full ${half ? "w-1/2 overflow-hidden" : "w-full"}`}
                  style={half ? { width: "50%", overflow: "hidden" } : { width: "100%" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="#FFD700"
                    className="w-8 h-8"
                  >
                    <path d="M12 .587l3.668 7.568L24 9.748l-6 5.85L19.335 24 12 19.897 4.665 24 6 15.598 0 9.748l8.332-1.593z" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
        <button
          className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600 transition-colors bg-transparent border-none p-0 text-base font-medium disabled:opacity-40"
          onClick={handleSendRating}
          disabled={loading || rating === 0}
          style={{ marginLeft: "8px" }}
        >
          <span className="text-xs">{loading ? "Enviando..." : "Enviar valoración"}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        {success && <span className="text-green-600">¡Valoración enviada!</span>}
        {errorMsg && <span className="text-red-600">{errorMsg}</span>}
      </div>
    </div>
  );
};

export default StarRating;