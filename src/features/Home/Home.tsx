import { useEffect, useState } from "react";
import { getTop10Works} from "../../services/workService";
import { getAllCategories, getCategorias } from "../../services/categoryService";
import { getUserReadingList } from "../../services/userService";
import type { WorkDTO } from "../../dto/WorkDTO";
import type { BookDTO } from "../../dto/BookDTO";
import Section from "../../components/Section";
import Top10Section from "../../components/Top10Section";


interface TopBook {
  id: number;
  title: string;
  cover: string; 
  position: number;
}

const Home = () => {
  const [top10, setTop10] = useState<TopBook[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [seguirLeyendo, setSeguirLeyendo] = useState<BookDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = 1; // ID del usuario logueado

    const fetchData = async () => {
      try {
        setLoading(true);

        const top10Data = await getTop10Works();
        setTop10(
          top10Data.map((work: WorkDTO, index: number) => ({
            id: work.id,
            title: work.title,
            cover: work.coverUrl, 
            position: index + 1,
          }))
        );

        const categoriesData = await getCategorias(); //cambiar despues por getAllCategories (vienen del back)
        setCategorias(categoriesData.map((category) => category.name));

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

      <Top10Section books={top10} />

      <div className="px-6 mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="w-full">
          <Section title="SEGUIR LEYENDO" books={seguirLeyendo} /> 
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">CATEGORIAS</h2>
          <div className="flex flex-wrap gap-3">
            {categorias.map((cat) => (
              <button
                key={cat}
                className="bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-100 transition text-sm font-medium"
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;

