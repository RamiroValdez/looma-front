import { useEffect } from "react";

export function useClickOutside(
  refs: React.RefObject<HTMLElement>[] | React.RefObject<HTMLElement>,
  handler: () => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: MouseEvent) {
      const refArray = Array.isArray(refs) ? refs : [refs];
      const clickedInside = refArray.some(
        (ref) => ref.current && ref.current.contains(event.target as Node)
      );
      if (!clickedInside) {
        handler();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [refs, handler, enabled]);
}