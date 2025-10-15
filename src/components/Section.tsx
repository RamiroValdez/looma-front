import { useRef, useState, useEffect } from "react";
import type { BookDTO } from "../dto/BookDTO";
import BookCard from "./BookCard";
import ScrollArrow from "./ScrollArrow"; 

interface Props {
  title: string;
  books: BookDTO[];
}

  const Section: React.FC<Props> = ({ title, books }) => {
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
  }, []);

  return (
    <section className="relative">
      <h2 className="font-bold text-xl mb-4 px-6">{title}</h2>

      {/* Flecha izquierda */}
      <ScrollArrow direction="left" onClick={() => scroll("left")} isVisible={showLeft} />

      {/* Contenedor scroll */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      >
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Flecha derecha */}
      <ScrollArrow direction="right" onClick={() => scroll("right")} isVisible={showRight} />
    </section>
  );
};

export default Section;

