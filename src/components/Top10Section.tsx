import { useRef, useState, useEffect } from "react";
import TopBookCard from "./TopBookCard";
import ScrollArrow from "./ScrollArrow";
import { getTop10Works } from "../services/workService";
import type { WorkDTO } from "../dto/WorkDTO";

interface TopBook {
    id: number;
    title: string;
    cover: string;
    position: number;
}

const Top10Section: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

    const { data: works, isLoading, isError } = getTop10Works();

    const books: TopBook[] = works?.map((work: WorkDTO, index: number) => ({
        id: work.id,
        title: work.title,
        cover: work.cover || '/default-cover.png',
        position: index + 1
    })) || [];

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
    }, []);

    if (isLoading) {
        return <div className="my-10 px-6">Cargando...</div>;
    }

    if (isError || books.length === 0) {
        return null;
    }

    return (
        <section className="my-10 relative px-6">
            <h2 className="text-2xl font-bold mb-8">TOP 10 EN ARGENTINA</h2>

            <ScrollArrow direction="left" onClick={() => scroll("left")} isVisible={showLeft} />

            <div
                ref={scrollRef}
                className="flex gap-10 overflow-x-auto scroll-smooth pl-12 pr-12 overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            >
                {books.map((book) => (
                    <TopBookCard
                        key={book.id}
                        position={book.position}
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

export default Top10Section;
