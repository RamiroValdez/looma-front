import React, { useState, useEffect } from "react";
import {getMyRatings, getRatingsCount, sendRating} from "../../infrastructure/services/RatingService";

type StarRatingProps = {
  workId: number;
  initialValue?: number;
};

const StarRating: React.FC<StarRatingProps> = ({ workId, initialValue = 0 }) => {
  const [rating, setRating] = useState<number>(initialValue);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [average, setAverage] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(0);

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
    setAverage(initialValue);
    fetchTotalRatings();
    fetchMyRating();
  }, [workId, initialValue]);

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>, starValue: number) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    const isHalf = clickX < width / 2;
    const newRating = isHalf ? starValue - 0.5 : starValue;
    
    setRating(newRating);

    setErrorMsg(null);
    
    try {
      const response = await sendRating(workId, newRating);
      setAverage(response.average_rating);
      
      const updatedTotal = await getRatingsCount(workId);
      setTotal(updatedTotal);
      
    } catch (e: any) {
      setErrorMsg("Error al enviar la valoración");
      setRating(initialValue);
    }
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

      <div 
        className="flex items-center gap-2"
        onMouseLeave={() => setHoverRating(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const displayRating = hoverRating !== null ? hoverRating : rating;
          const filled = displayRating >= star;
          const half = displayRating === star - 0.5;
          const isHovering = hoverRating !== null;
          
          return (
            <div
              key={star}
              className="relative w-8 h-8 cursor-pointer group"
              onClick={(e) => handleClick(e, star)}
              onMouseMove={(e) => {
                const { left, width } = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - left;
                const isHalf = clickX < width / 2;
                setHoverRating(isHalf ? star - 0.5 : star);
              }}
              style={{ display: "inline-block" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="#d3d3d3"
                className="w-8 h-8 absolute transition-colors"
              >
                <path d="M12 .587l3.668 7.568L24 9.748l-6 5.85L19.335 24 12 19.897 4.665 24 6 15.598 0 9.748l8.332-1.593z" />
              </svg>
              {(filled || half) && (
                <div
                  className="absolute top-0 left-0 h-full overflow-hidden"
                  style={{
                    width: "100%",
                    clipPath: half ? "inset(0 50% 0 0)" : "none"
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={isHovering ? "#eab308" : "#FFD700"}
                    className="w-8 h-8 transition-colors duration-200"
                  >
                    <path d="M12 .587l3.668 7.568L24 9.748l-6 5.85L19.335 24 12 19.897 4.665 24 6 15.598 0 9.748l8.332-1.593z" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {errorMsg && (
        <div className="mt-2 -ml-2">
          <div className="text-red-600 flex items-center gap-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg"
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
            <span className="text-sm">{errorMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StarRating;
