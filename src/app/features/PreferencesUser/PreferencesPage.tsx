import React, { useState } from "react";
import { useCategories } from "../../../infrastructure/services/CategoryService";
import { useFormats } from "../../../infrastructure/services/FormatService";
import { sendPreferences } from "../../../infrastructure/services/PreferencesService";
import { useNavigate } from "react-router-dom"; 

const PreferencesPage: React.FC = () => {
  const { categories, isLoading: loadingCategories } = useCategories();
  const { formats, isLoading: loadingFormats } = useFormats();

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const toggleSelection = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleSubmit = async () => {
    setSending(true);
    setError(null);
    try {
      await sendPreferences(selectedGenres, selectedFormats);
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f4f2f9] p-6 overflow-hidden">

      <div className="bg-white shadow-[0_0_25px_5px_rgba(92,23,166,0.4)] rounded-2xl p-10 w-full max-w-[720px] z-10">


        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          ¿Cuáles son tus géneros favoritos para leer?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Elegí al menos un género para empezar con las recomendaciones personalizadas.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {loadingCategories ? (
            <span className="text-gray-400">Cargando géneros...</span>
          ) : (
            categories.map((genre: any) => (
              <button
                key={genre.id || genre.name}
                type="button"
                onClick={() =>
                  toggleSelection(genre.name, selectedGenres, setSelectedGenres)
                }
                className={`px-4 py-1 rounded-full border text-sm transition-all ${selectedGenres.includes(genre.name)
                  ? "bg-[#5c17a6] text-white border-[#5c17a6]"
                  : "bg-white text-black border-[#5c17a6] hover:bg-gray-100"
                  }`}
              >
                {genre.name}
              </button>
            ))
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Selecciona tus preferencias
        </h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {loadingFormats ? (
            <span className="text-gray-400">Cargando formatos...</span>
          ) : (
            formats.map((format: any) => (
              <button
                key={format.id || format.name}
                type="button"
                onClick={() =>
                  toggleSelection(format.name, selectedFormats, setSelectedFormats)
                }
                className={`px-4 py-1 rounded-full border text-sm transition-all ${selectedFormats.includes(format.name)
                  ? "bg-[#3c2a50] text-white border-[#3c2a50]"
                  : "bg-white text-black border-[#172FA6] hover:bg-gray-100"
                  }`}
              >
                {format.name}
              </button>
            ))
          )}
        </div>

        {error && (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        )}

        <button
          type="button"
          disabled={selectedGenres.length === 0 || sending}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${selectedGenres.length === 0 || sending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#172FA6] hover:bg-[#0f23a8]"
            }`}
        >
          {sending ? "Enviando..." : "Continuar"}
        </button>
      </div>

      <img
        src="/img/loomiPensando.png"
        alt="Libro pensador"
        className="
    absolute 
    z-20
    animate-[float_3s_ease-in-out_infinite]
    w-28 sm:w-36 md:w-44 lg:w-52
    bottom-[2rem] sm:bottom-[2.5rem] md:bottom-[4.5rem]
    left-[calc(50%-440px)] sm:left-[calc(50%-460px)] md:left-[calc(50%-480px)] lg:left-[calc(50%-500px)]
  "
      />

    </div>
  );
};

export default PreferencesPage;