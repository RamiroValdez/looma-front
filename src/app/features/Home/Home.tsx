import { useCategories } from "../../hooks/useCategories";
import BannerHome from "../../components/BannerHome";
import WorkCarousel from "../../components/WorkCarousel";
import ScrollArrow from "../../components/ScrollArrow";
import { useNavigate } from "react-router-dom";
import { useHomeWorks } from "./hooks/useHomeWorks";
import { useScrollArrows } from "./hooks/useScrollArrows";
import { Loader } from "../../components/Loader";

const Home = () => {
  const { categories, isLoading, error } = useCategories();
  const navigate = useNavigate();

  const {
    loading,
    top10,
    newReleases,
    recentlyUpdated,
    continueReading,
    uniquePreferences,
    bannerBooks,
  } = useHomeWorks();

  const { scrollRef, showLeft, showRight, onScroll, scroll } = useScrollArrows([categories, isLoading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f0f7]">
        <Loader size="md" color="primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f0f7]">
      {bannerBooks.length > 0 && <BannerHome books={bannerBooks} />}

      <div className="relative mt-6 mb-8 sm:mt-10 sm:mb-12">
        <div className="relative px-2 sm:px-6 md:px-12">
          {showLeft && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden sm:block">
              <ScrollArrow direction="left" onClick={() => scroll("left")} isVisible={true} />
            </div>
          )}

          <div
            ref={scrollRef}
            className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scroll-smooth px-2 sm:px-4 md:px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            onScroll={onScroll}
          >
            {isLoading ? (
              
      <div className="min-h-screen flex items-center justify-center bg-[#f4f0f7]">
        <Loader size="md" color="primary" />
      </div>
            ) : error ? (
              <p className="text-red-500">Error al cargar categorías</p>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => navigate(`/explore?categoryIds=${category.id}`)}
                  className="flex-shrink-0 bg-[#5C17A6] text-white hover:bg-[#4a186f] cursor-pointer px-3 py-2 sm:px-6 sm:py-3 rounded-full shadow-sm transition font-medium min-w-[90px] sm:min-w-[120px] md:min-w-[140px] text-xs sm:text-base"
                >
                  {category.name}
                </button>
              ))
            )}
          </div>

          {showRight && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden sm:block">
              <ScrollArrow direction="right" onClick={() => scroll("right")} isVisible={true} />
            </div>
          )}
        </div>
      </div>

      <div className="px-2 sm:px-2 md:px-4">
        <WorkCarousel title="Top 10 en Argentina" books={top10} showPosition={true} />
        {continueReading.length > 0 && (
          <WorkCarousel title="Seguir Leyendo" books={continueReading} />
        )}
        {uniquePreferences.length > 0 && (
          <WorkCarousel title="Recomendados para ti" books={uniquePreferences} />
        )}
        {newReleases.length > 0 && (
          <WorkCarousel title="Nuevos lanzamientos" books={newReleases} />
        )}
        {recentlyUpdated.length > 0 && (
          <WorkCarousel title="Actualizados recientemente" books={recentlyUpdated} />
        )}
      </div>
    </div>
  );
};

export default Home;