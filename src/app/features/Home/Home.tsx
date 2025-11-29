import BannerHome from "../../components/BannerHome";
import WorkCarousel from "../../components/WorkCarousel";
import { useHomeWorks } from "./hooks/useHomeWorks";
import { Loader } from "../../components/Loader";
import {CategoryList} from "./CategoryList.tsx";

const Home = () => {
  const {
    loading,
    top10,
    newReleases,
    recentlyUpdated,
    continueReading,
    uniquePreferences,
    bannerBooks,
  } = useHomeWorks();


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

      <CategoryList/>

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