import React from "react";
import { useLike } from "../../app/hooks/useLike";

interface LikeButtonProps {
  workId: number;
  chapterId?: number;
  initialLiked?: boolean;
  initialCount?: number;
  type?: "work" | "chapter";
  disabled?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  workId,
  chapterId,
  initialLiked = false,
  initialCount = 0,
  type = "work",
  disabled=false,
}) => {
  const { liked, count, loading, handleLike } = useLike({
    initialLiked,
    initialCount,
    type,
    workId,
    chapterId,
  });

    const likesFormatted = count >= 1000 ? (count / 1000).toFixed(1) + "k" : count;

  return (
    <button
      onClick={handleLike}
      disabled={loading || disabled}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        opacity: loading ? 0.5 : 1,
      }}
      aria-label={liked ? "Quitar like" : "Dar like"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={liked ? "#c026d3" : "none"}
        stroke="#c026d3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
       <span className="ml-2 text-[16px] font-semibold text-gray-700">{likesFormatted}</span> 
    </button>
  );
};

export default LikeButton;