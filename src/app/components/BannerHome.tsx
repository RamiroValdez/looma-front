import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface BannerBook {
  id: number;
  title: string;
  banner: string;
  categories: string[];
  description?: string;
}

interface FeaturedBookBannerProps {
  books: BannerBook[];
}

const FeaturedBookBanner: React.FC<FeaturedBookBannerProps> = ({ books}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (books.length === 0) return; 

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % books.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [books.length]);

  if (books.length === 0) {
    return null;
  }

  const currentBook = books[currentIndex];

  return (
  <div className="relative w-full h-[40vh] sm:h-[60vh] md:h-[75vh] lg:h-[500px] flex items-end overflow-hidden shadow-lg">
    <div 
      className="absolute inset-0 transition-all duration-1000"
      style={{ 
        backgroundImage: `url(${currentBook.banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

    <div className="relative z-10 p-4 sm:p-6 text-white max-w-lg sm:max-w-xl md:max-w-2xl mb-6 sm:mb-8 ml-2 sm:ml-4">
      <h1 className="text-xl sm:text-3xl md:text-6xl font-bold mb-2 sm:mb-4">
        {currentBook.title}
      </h1>
      <div className="flex flex-wrap gap-2 mb-2">
        {currentBook.categories.map((category, index) => (
          <span
            key={index}
            className="bg-white/20 rounded-full px-2 py-1 sm:px-3 sm:py-1 backdrop-blur-sm text-sm sm:text-lg"
          >
            {category}
          </span>
        ))}
      </div>
      <p className="text-xs sm:text-sm md:text-lg text-gray-200 mb-2 sm:mb-3 line-clamp-2">
        {currentBook.description}
      </p>
      <div className="flex gap-4 mt-4 sm:mt-8">
        <button 
          onClick={() => navigate(`/work/${currentBook.id}`)}
          className="bg-white text-black px-3 py-1 sm:px-4 sm:py-2 rounded-3xl font-semibold hover:bg-gray-300 transition text-sm sm:text-lg cursor-pointer">
          Leer Ahora
        </button>
      </div>
    </div>

    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
      {books.map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
            i === currentIndex ? "bg-white" : "bg-white/40"
          } transition`}
        />
      ))}
    </div>
  </div>
);
};

export default FeaturedBookBanner;