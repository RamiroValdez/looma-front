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
    <div className="relative w-full h-[75vh] md:h-[80vh] flex items-end overflow-hidden shadow-lg">
      
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${currentBook.banner})`,
          backgroundSize: '100% 100%'
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <div className="relative z-10 p-6 text-white max-w-2xl mb-8 ml-4">
        <h1 className="text-2xl md:text-6xl font-bold mb-4">
          {currentBook.title}
        </h1>
        <div className="flex flex-wrap gap-2 mb-2">
          {currentBook.categories.map((category, index) => (
            <span
              key={index}
              className="bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm text-lg"
            >
              {category}
            </span>
          ))}
        </div>
        <p className="text-sm md:text-lg text-gray-200 mb-3 line-clamp-2">
          {currentBook.description}
        </p>
        <div className="flex gap-4 mt-8">
          <button 
          onClick={() => navigate(`/work/${currentBook.id}`)}
          className="bg-white text-black px-4 py-2 rounded-3xl font-semibold hover:bg-gray-300 transition text-lg cursor-pointer">
            Leer Ahora
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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