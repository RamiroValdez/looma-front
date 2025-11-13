import { useRef, useState, useEffect } from "react";
import TopBookCard from "./TopBookCard";
import ScrollArrow from "./ScrollArrow";

interface Book {
    id: number;
    title: string;
    cover: string;
    position?: number; 
}

interface WorkCarouselProps {
    title: string;         
    books: Book[];
    showPosition?: boolean; 
}

const WorkCarousel: React.FC<WorkCarouselProps> = ({ 
    title, 
    books, 
    showPosition = false 
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeft(scrollLeft > 0);
            setShowRight(scrollLeft + clientWidth < scrollWidth);
        }
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -clientWidth : clientWidth,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (el) el.addEventListener("scroll", checkScroll);
        return () => {
            if (el) el.removeEventListener("scroll", checkScroll);
        };
    }, [books]);

    if (books.length === 0) {
        return null;
    }

    return (
        <section className="relative">
            <h2 className="text-2xl font-bold mb-8 ml-10">{title}</h2>

            <ScrollArrow direction="left" onClick={() => scroll("left")} isVisible={showLeft} />

             <div
                ref={scrollRef}
                className="flex justify-start max-w-[1800px] ml-12 gap-10 overflow-x-auto scroll-smooth pl-12 pr-12 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            >
                {books.map((book, index) => (
                    <TopBookCard
                        key={book.id}
                        position={showPosition ? (book.position || index + 1) : undefined}
                        cover={book.cover}
                        title={book.title}
                        idWork={book.id}
                    />
                ))}
            </div>

            <ScrollArrow direction="right" onClick={() => scroll("right")} isVisible={showRight} />
        </section>
    );
};

export default WorkCarousel;