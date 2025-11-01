import { useState } from "react";
import { likeWork, unlikeWork, likeChapter, unlikeChapter } from "../../infrastructure/services/LikeService";

export function useLike({ 
  initialLiked = false, 
  initialCount = 0, 
  type = "work", 
  workId, 
  chapterId
}: {
  initialLiked?: boolean;
  initialCount?: number;
  type: "work" | "chapter";
  workId: number;
  chapterId?: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    setLoading(true);
    try {
      let response;
      if (!liked) {
        response = type === "work"
          ? await likeWork(workId)
          : await likeChapter(workId, chapterId!);
        setLiked(true);
      } else {
        response = type === "work"
          ? await unlikeWork(workId)
          : await unlikeChapter(workId, chapterId!);
        setLiked(false);
      }
      setCount(response.likeCount); // <-- Actualiza con el valor real del backend
    } finally {
      setLoading(false);
    }
  };

  return { liked, count, loading, handleLike };
}