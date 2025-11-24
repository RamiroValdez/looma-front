import React from "react";
import { useCategories } from "../../../infrastructure/services/CategoryService";
import { usePreferences } from "../../hooks/usePreferences";

const PreferencesPage: React.FC = () => {
  const { categories, isLoading: loadingCategories } = useCategories();

  const {
    selectedGenres,
    sending,
    error,
    toggleSelection,
    handleSubmit,
  } = usePreferences();

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
                onClick={() => toggleSelection(genre.id)}
                className={`px-4 py-1 rounded-full border text-sm cursor-pointer transition-all ${selectedGenres.includes(genre.id)
                  ? "bg-[#5c17a6] text-white border-[#5c17a6]"
                  : "bg-white text-black border-[#5c17a6] hover:bg-gray-100"
                  }`}
              >
                {genre.name}
              </button>
            ))
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <button
          type="button"
          disabled={selectedGenres.length === 0 || sending}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-lg text-white cursor-pointer font-semibold transition-all ${selectedGenres.length === 0 || sending
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