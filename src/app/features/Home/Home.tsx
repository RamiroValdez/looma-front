 
import { useEffect, useState } from "react";
import { getTop10Works} from "../../../infrastructure/services/WorkService";
import { useCategories } from "../../../infrastructure/services/CategoryService";
import { getUserReadingList } from "../../../infrastructure/services/UserService";
import type { WorkDTO } from "../../../domain/dto/WorkDTO";
import type { BookDTO } from "../../../domain/dto/BookDTO";
import Top10Section from "../../components/Top10Section";
import BannerHome from "../../components/BannerHome";

interface TopBook {
  id: number;
  title: string;
  cover: string; 
  position: number;
}

const Home = () => {
  const { categories, isLoading, error } = useCategories();

  const [top10, setTop10] = useState<TopBook[]>([]);
  const [seguirLeyendo, setSeguirLeyendo] = useState<BookDTO[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("Top 10:", top10);
  console.log("Seguir Leyendo:", seguirLeyendo);
  useEffect(() => {
    const userId = 1; 

    const fetchData = async () => {
      try {
        setLoading(true);

        const top10Data = await getTop10Works();
        setTop10(
          top10Data?.data?.map((work: WorkDTO, index: number) => ({
            id: work.id,
            title: work.title,
            cover: work.cover, 
            position: index + 1,
          })) || []
        );

        const readingList = await getUserReadingList(userId);
        setSeguirLeyendo(readingList);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-lg">Cargando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f0f7]">
      <BannerHome
  books={[
    {
      title: "El principito",
      cover: "/img/banner2.jpg",
      categories: ["filosofía", "aventura"],
      description: "Un cuento poético que explora la amistad, el amor y la esencia de la naturaleza humana a través de los ojos de un pequeño príncipe que viaja de planeta en planeta."
    },
    {
      title: "Fahrenheit 451",
      cover: "/img/portadas/banner2.jpg",
      categories: ["ciencia ficción"],
      description: "Un clásico distópico sobre la censura y el poder de la literatura en una sociedad que prohíbe los libros."
    },
    {
      title: "La odisea de Homero",
      cover: "/img/portadas/banner3.jpg",
      categories: ["aventura"],
      description: "El épico viaje de Odiseo de regreso a Ítaca tras la guerra de Troya, repleto de dioses, monstruos y aventuras legendarias."
    },
  ]}
/>

      <Top10Section />

      <div className="px-6 mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">CATEGORIAS</h2>
          <div className="flex flex-wrap gap-3">
            {isLoading ? (
              <p className="text-gray-500">Cargando categorías...</p>
            ) : error ? (
              <p className="text-red-500">Error al cargar categorías</p>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  className="bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-100 transition text-sm font-medium"
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

