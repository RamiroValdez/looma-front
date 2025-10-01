import { useEffect, useState } from "react";
import { getUserData } from "../../services/userService";
import type { BookDTO } from "../../types/BookDTO";
import Section from "../../components/Section";

const Home = () => {
  const [seguirLeyendo, setSeguirLeyendo] = useState<BookDTO[]>([]);
  const [recomendados, setRecomendados] = useState<BookDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = 1; // Temporal
    const fetchData = async () => {
      try {
        const data = await getUserData(userId);
        setSeguirLeyendo(data.seguirLeyendo);
        setRecomendados(data.recomendados);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="px-6 flex flex-col justify-center min-h-screen bg-[#f0eef6]">
    <Section title="SEGUIR LEYENDO" books={seguirLeyendo} />
    <Section title="EN BASE A TUS GUSTOS" books={recomendados} />
  </div>
  );
};

export default Home;