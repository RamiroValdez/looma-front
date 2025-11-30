import type {LanguageDTO} from "../../../domain/dto/LanguageDTO.ts";
import { useState, useMemo } from "react";
import { useLanguages } from "../../../infrastructure/services/LanguageService.ts"; // cambio: usar hook que hace fetch
import { Loader } from "../Loader.tsx";

interface Props {
    availableLanguages: LanguageDTO[];
    defaultLanguageCode: LanguageDTO;
    onLanguageSelect?: (languageCode: string) => void;
    activeLanguageCode?: string;
    disabled?: boolean;
    onAddLanguage?: (language: LanguageDTO) => void;
}

export default function AdvancedTools({ availableLanguages, defaultLanguageCode, onLanguageSelect, activeLanguageCode, disabled, onAddLanguage }: Props) {
  const { languages, isLoading: isLoadingLanguages, error: languagesError } = useLanguages(); // usar hook de carga
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>("");

  // Códigos ya disponibles para filtrar candidatos
  const availableCodes = useMemo(() => new Set(availableLanguages.map(l => l.code)), [availableLanguages]);

  // Idiomas disponibles en el store que aún no están agregados
  const candidateLanguages = useMemo(() => (languages || []).filter(l => !availableCodes.has(l.code)), [languages, availableCodes]);
  const canAddMore = candidateLanguages.length > 0;

  const handleConfirmAdd = () => {
    if (!onAddLanguage) return;
    const lang = candidateLanguages.find(l => l.code === selectedCode) || candidateLanguages[0];
    if (!lang) return;
    onAddLanguage(lang);
    setShowAddModal(false);
    setSelectedCode("");
  };

  return (
    <div className="w-full max-w-full rounded-t-2xl overflow-hidden border border-gray-300 bg-[#E8E4EF]">
      {/* Header */}
      <div className="bg-[#3B2C56] text-white text-center font-semibold py-4 rounded-t-2xl">Versiones</div>
      {/* Lista de idiomas */}
      <div className="divide-y divide-gray-300 bg-[#F0EEF6]">
        {availableLanguages.map(language => {
          const isActive = activeLanguageCode === language.code || (!activeLanguageCode && language.id === defaultLanguageCode.id);
          const isDisabledBtn = disabled || isLoadingLanguages || isActive; // mantener disabled funcional
          return (
            <button
              key={language.id}
              type="button"
              className={`w-full text-left py-2 px-4 flex justify-between items-center hover:bg-[#E0DEE8] ${isActive ? 'bg-[#D9D5E3] font-semibold cursor-default' : 'cursor-pointer'} ${(!isActive && isDisabledBtn) ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={isDisabledBtn || !onLanguageSelect || isActive ? undefined : () => onLanguageSelect(language.code)}
              disabled={isDisabledBtn}
            >
              <span>{language.name}</span>
              <div className="flex gap-2 items-center">
                {language.id === defaultLanguageCode.id && (
                  <span className="bg-[#172FA6] text-white text-xs px-3 py-1 rounded-full font-semibold">Original</span>
                )}
                {isActive && (
                  <span className="bg-[#4C3B63] text-white text-xs px-3 py-1 rounded-full font-semibold">Activo</span>
                )}
              </div>
            </button>
          );
        })}
        <div className="flex justify-center py-3 bg-white flex-col items-center gap-2">
          <button
            className={`px-4 py-2 bg-[#172fa6] font-semibold text-white rounded-full shadow hover:bg-[#0e1c80] cursor-pointer`}
            disabled={disabled || isLoadingLanguages}
            onClick={() => setShowAddModal(true)}
          >Agregar versión</button>
          {isLoadingLanguages && 
                <div className="min-h-screen flex items-center justify-center bg-[#f4f0f7]">
                  <Loader size="md" color="primary" />
                </div>}
          {languagesError && !isLoadingLanguages && <p className="text-xs text-red-600">Error al cargar idiomas.</p>}
        </div>
      </div>
      {/* Modal agregar idioma */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddModal(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Agregar versión</h3>
            {isLoadingLanguages ? (
              
      <div className="min-h-screen flex items-center justify-center bg-[#f4f0f7]">
        <Loader size="md" color="primary" />
      </div>
            ) : languagesError ? (
              <p className="text-sm text-red-600">No se pudieron cargar los idiomas.</p>
            ) : canAddMore ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Seleccioná un idioma</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5C17A6]"
                    value={selectedCode || (candidateLanguages[0]?.code ?? '')}
                    onChange={(e) => setSelectedCode(e.target.value)}
                  >
                    {candidateLanguages.map(l => (
                      <option key={l.id} value={l.code}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => setShowAddModal(false)}>Cancelar</button>
                  <button type="button" className="px-4 py-2 rounded-md bg-[#172FA6] text-white hover:bg-[#0e1c80]" onClick={handleConfirmAdd}>Agregar</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No hay más idiomas disponibles para agregar.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
