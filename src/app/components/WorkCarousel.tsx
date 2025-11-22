import { useRef, useState, useEffect } from "react";
import TopBookCard from "./TopBookCard";
import ScrollArrow from "./ScrollArrow";
import type { WorkDTO } from "../../domain/dto/WorkDTO";

interface WorkCarouselProps {
    title: string;         
    books: WorkDTO[];
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
        <h2 className="ml-10 mb-8 text-2xl font-bold tracking-wide text-[#172fa6]
               border-l-4 border-[#172fa6] pl-4">
        {title}
        </h2>




            <ScrollArrow direction="left" onClick={() => scroll("left")} isVisible={showLeft} />

             <div
                ref={scrollRef}
                className="flex justify-start max-w-[1800px] ml-12 overflow-x-auto scroll-smooth pl-12 pr-16 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                style={{
                    width: 'calc(100% - 3rem)',
                }}
            >
                {books.map((book, index) => (
                    <div 
                        key={book.id}
                        className="flex-none"
                        style={{ width: '210px', marginRight: '4rem' }}
                    >
                        <TopBookCard
                            position={showPosition ? (index + 1) : undefined}
                            cover={book.cover}
                            title={book.title}
                            idWork={book.id}
                            authorName={`${book.creator?.name || ''} ${book.creator?.surname || ''}`.trim() || book.creator?.username}
                            genre={book.categories?.[0]?.name}
                            format={book.format?.name}
                            likesCount={book.likes}
                            description={book.description}
                            categories={book.categories?.map(cat => ({
                                id: cat.id,
                                name: cat.name
                            })) || []}
                        />
                    </div>
                ))}
            </div>

            <ScrollArrow direction="right" onClick={() => scroll("right")} isVisible={showRight} />
        </section>
    );
};

export default WorkCarousel;