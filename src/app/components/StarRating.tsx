import React, { useState, useEffect } from "react";
import {getMyRatings, getRatingsCount, sendRating} from "../../infrastructure/services/RatingService";

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
  const [isVisible, setIsVisible] = useState(false);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (success) {
      setIsVisible(true);
      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
      }, 2500); 
      
      const hideTimer = setTimeout(() => {
        setSuccess(false);
      }, 3000); 
      
      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [success]);

  const fetchRatings = async (averageRating: number | undefined) => {
      if(averageRating !== undefined) {
          setAverage(averageRating);
      }
      setAverage(initialValue);
  };

  const fetchTotalRatings = async () => {
      const total = await getRatingsCount(workId);
      setTotal(total);
  };

  const fetchMyRating = async () => {
        const myRating = await getMyRatings(workId);
        if (myRating !== null && myRating !== undefined) {
          setRating(myRating);
        } else {
          setRating(initialValue);
        }
  }

  useEffect(() => {
    fetchRatings(undefined);
    fetchTotalRatings();
    fetchMyRating();
  }, [workId, initialValue]);

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
        const response = await sendRating(workId, rating);
        setSuccess(true);
        fetchRatings(response.averageRating);
    } catch (e: any) {
      setErrorMsg("Error al enviar la valoración");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2 mb-2 w-full">
      <div className="flex items-end gap-2">
        <span className="font-semibold text-3xl text-yellow-600">
          {average !== null ? average.toFixed(1) : "—"}
        </span>
        <span className="text-gray-500 ml-0.2 mb-1 text-sm">
          ({total})
        </span>
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
                  style={half ? { width: "57%", overflow: "hidden" } : { width: "100%" }}
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

        </button>
      </div>
      <div className="mt-2 flex flex-col gap-1 -ml-2 h-5">
        {success && (
          <div className={`text-green-600 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <svg 
              xmlns="http://www.w3.org/2000-svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        )}
        {errorMsg && (
          <div className="text-red-600">
            <svg 
              xmlns="http://www.w3.org/2000-svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default StarRating;