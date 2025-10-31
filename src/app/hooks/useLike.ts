import { useState } from "react";

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
  const storageKey = type === "work"
    ? `like-work-${workId}`
    : `like-chapter-${workId}-${chapterId}`;

  // Leer el estado inicial desde localStorage
  const [liked, setLiked] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? stored === "true" : initialLiked;
  });
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    setLoading(true);
    try {
      let newCount = count;
      if (!liked) {
        // Aquí iría la llamada al servicio real
        newCount = count + 1;
        setLiked(true);
        localStorage.setItem(storageKey, "true");
      } else {
        newCount = count - 1;
        setLiked(false);
        localStorage.setItem(storageKey, "false");
      }
      setCount(newCount);
    } finally {
      setLoading(false);
    }
  };

  return { liked, count, loading, handleLike };
}