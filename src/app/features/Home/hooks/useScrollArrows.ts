import { useRef, useState, useEffect } from "react";

export function useScrollArrows(deps: any[] = []) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

    useEffect(() => {
        const checkInitialScroll = () => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                setShowLeft(scrollLeft > 20);
                setShowRight(scrollLeft + clientWidth < scrollWidth - 20);
            }
        };
        const timer = setTimeout(checkInitialScroll, 100);
        return () => clearTimeout(timer);
    }, deps);

    const onScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeft(scrollLeft > 20);
            setShowRight(scrollLeft + clientWidth < scrollWidth - 20);
        }
    };

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const buttons = container.querySelectorAll('button');
        if (buttons.length === 0) return;
        const containerRect = container.getBoundingClientRect();
        const padding = 48;
        if (direction === "right") {
            for (let i = 0; i < buttons.length; i++) {
                const buttonRect = buttons[i].getBoundingClientRect();
                if (buttonRect.left >= containerRect.right - padding) {
                    buttons[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                    return;
                }
            }
        } else {
            for (let i = buttons.length - 1; i >= 0; i--) {
                const buttonRect = buttons[i].getBoundingClientRect();
                if (buttonRect.right <= containerRect.left + padding) {
                    buttons[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
                    return;
                }
            }
        }
    };

    return { scrollRef, showLeft, showRight, onScroll, scroll };
}