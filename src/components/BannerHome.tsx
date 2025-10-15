import React, { useEffect, useState } from "react";

interface Book {
  title: string;
  cover: string;
  categories: string[];
  description: string;
}

interface FeaturedBookBannerProps {
  books: Book[]; 
}

const FeaturedBookBanner: React.FC<FeaturedBookBannerProps> = ({ books }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % books.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [books.length]);

  const currentBook = books[currentIndex];

  return (
    <div
      className="relative w-full h-[60vh] md:h-[70vh] flex items-end bg-cover bg-center overflow-hidden shadow-lg transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url(${currentBook.cover})` }}
    >

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="relative z-10 p-8 text-white max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {currentBook.title}
        </h1>
         <div className="flex flex-wrap gap-2 mb-4">
          {currentBook.categories.map((category, index) => (
            <span
              key={index}
              className="bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm text-sm"
            >
              {category}
            </span>
          ))}
        </div>
          <p className="text-base md:text-lg text-gray-200 mb-5 line-clamp-3">
          {currentBook.description}
        </p>
        <div className="flex gap-4">
          <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
            Próximamente
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {books.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === currentIndex ? "bg-white" : "bg-white/40"
            } transition`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedBookBanner;
