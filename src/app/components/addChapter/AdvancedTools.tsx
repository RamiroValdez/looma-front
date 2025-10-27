import type {LanguageDTO} from "../../../domain/dto/LanguageDTO.ts";

interface Props {
    availableLanguages: LanguageDTO[];
    defaultLanguageCode: LanguageDTO;
    onLanguageSelect?: (languageCode: string) => void;
}

export default function AdvancedTools({ availableLanguages, defaultLanguageCode, onLanguageSelect }: Props) {
  return (
    <div className="w-full max-w-full rounded-t-2xl overflow-hidden border border-gray-300 bg-[#E8E4EF]">
  
      <div className="bg-[#3B2C56] text-white text-center font-semibold py-2 rounded-t-2xl">
        Versiones
      </div>

      <div className="divide-y divide-gray-300 bg-[#F0EEF6]">

          {availableLanguages.map(language => (
              <div key={language.id} className="py-2 px-4 flex justify-between items-center hover:bg-[#E0DEE8] cursor-pointer" onClick={onLanguageSelect ? () => onLanguageSelect(language.code) : undefined}>
                  {language.name}
                  <div>
                      {language.id === defaultLanguageCode.id && (
                          <span className="bg-[#172FA6] text-white text-xs px-3 py-1 rounded-full font-semibold">
                            Original
                      </span>
                      )}
                  </div>
              </div>
          ))}

        <div className="flex justify-center py-3 bg-white">

          <button className="bg-[#172FA6] hover:bg-[#0e1c80] text-white font-semibold text-sm px-4 py-1.5 rounded-md disabled:bg-[#A0A0A0]"
          disabled
          >
            Agregar versión
          </button>
        </div>

      </div>
    </div>
  );
}

