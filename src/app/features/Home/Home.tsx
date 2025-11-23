import { useEffect, useState, useRef } from "react";
import { useCategories } from "../../../infrastructure/services/CategoryService";
import type { WorkDTO } from "../../../domain/dto/WorkDTO";
import BannerHome from "../../components/BannerHome";
import { getHomeWorkList } from "../../../infrastructure/services/HomeService";
import { useUserStore } from "../../../infrastructure/store/UserStorage";
import WorkCarousel from "../../components/WorkCarousel";
import ScrollArrow from "../../components/ScrollArrow";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { categories, isLoading, error } = useCategories();

  const [top10, setTop10] = useState<WorkDTO[]>([]);
  const [newReleases, setNewReleases] = useState<WorkDTO[]>([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState<WorkDTO[]>([]);
  const [continueReading, setContinueReading] = useState<WorkDTO[]>([]);
  const [preferences, setPreferences] = useState<WorkDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const uniquePreferences = preferences.filter(
  (work, index, self) =>
    self.findIndex(w => w.id === work.id) === index
);

  useEffect(() => {
    const fetchData = async () => {

      try {
        setLoading(true);
        const workList = await getHomeWorkList(user?.userId || 0);
        setTop10(workList.topTen);
        if(workList.currentlyReading){
            setContinueReading(workList.currentlyReading);
        }
        setNewReleases(workList.newReleases);
        setRecentlyUpdated(workList.recentlyUpdated);
        setPreferences(workList.userPreferences);
      }
      catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.userId]);

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
  }, [categories, isLoading]);

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

  if (loading) {
    return <div className="p-8 text-center text-lg">Cargando...</div>;
  }

  const bannerBooks = top10
    .filter((work) => work.banner && work.banner.trim() !== '') 
    .slice(0, 3)
    .map((work) => ({
      id: work.id,
      title: work.title,
      banner: work.banner,
      categories: work.categories?.map(cat => cat.name) || [],
      description: work.description,
    }));

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
            onScroll={() => {
              if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                setShowLeft(scrollLeft > 20);
                setShowRight(scrollLeft + clientWidth < scrollWidth - 20);
              }
            }}
          >
            {isLoading ? (
              <p className="text-gray-500">Cargando categorías...</p>
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