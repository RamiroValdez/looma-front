interface FooterLectorProps {
  selectedLanguages: { code: string; name: string }[];
  chapterTitle: string;
  onLanguageChange: (languageCode: string) => void;
  disableLanguageSelect?: boolean;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
  onThemeClick?: () => void;
  isThemeModalOpen?: boolean;
  onPreviousChapter?: () => void; 
  onNextChapter?: () => void; 
  currentLanguage?: string; // nuevo prop para controlar el select
}

const FooterLector = ({ 
  selectedLanguages, 
  chapterTitle, 
  onLanguageChange, 
  disableLanguageSelect = false, 
  onToggleFullScreen, 
  isFullScreen = false,
  onThemeClick,
  isThemeModalOpen = false,
  onPreviousChapter, 
  onNextChapter, 
  currentLanguage, // recibir nuevo prop
}: FooterLectorProps) => {
  return (
    <footer 
  className={`fixed bottom-0 left-0 w-full bg-[#3b245a] text-white px-6 py-3 flex flex-col sm:flex-row items-center justify-center sm:justify-between flex-wrap ${isThemeModalOpen ? 'z-[9999]' : 'z-50'}`}
>
      <div className="w-full sm:w-auto flex justify-center items-center mb-2 sm:mb-0">
     <span className="text-base font-semibold text-center w-full">{chapterTitle}</span>
        <div className="h-10 w-[1px] bg-gray-400 hidden sm:block ml-4"></div>
  </div>

      <div className="flex items-center gap-8 text-gray-300">
        <div 
          className="flex flex-col items-center leading-tight cursor-pointer hover:text-white transition-colors"
          onClick={onThemeClick}
        >
          <span className="text-lg">A</span>
          <span className="text-[10px] uppercase">Estilo</span>
        </div>

        <div className="flex flex-col items-center leading-tight text-white">
          <select
            className={`bg-transparent cursor-pointer text-white font-bold text-sm border border-gray-300 rounded-md px-2 py-1 mt-2 focus:text-black focus:bg-white disabled:opacity-60`}
            onChange={(e) => onLanguageChange(e.target.value)}
            disabled={disableLanguageSelect}
            value={currentLanguage} // controlar valor
          >
            {selectedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code} className="text-black">
                {lang.name} ({lang.code.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

<div className="flex items-center gap-4 justify-center w-full sm:w-auto mt-2 sm:mt-0">
          <button
          onClick={onPreviousChapter}
          className="text-gray-300 hover:text-white transition-colors cursor-pointer group relative"
          aria-label="Capítulo anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Capítulo anterior
        </span>
        </button>

        <button
          onClick={onNextChapter}
          className="text-gray-300 hover:text-white transition-colors cursor-pointer group relative"
          aria-label="Capítulo siguiente"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      Capítulo siguiente
    </span>
        </button>

        <div className="flex flex-col items-center text-gray-300 hover:text-white cursor-pointer text-xs" onClick={onToggleFullScreen}>
          {isFullScreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mb-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mb-[1px] mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 00-2 2v3m0 8v3a2 2 0 002 2h3m8-18h3a2 2 0 012 2v3m0 8v3a2 2 0 01-2 2h-3" />
            </svg>
          )}
          <span>Screen</span>
        </div>
      </div>
    </footer>
  );
};

export default FooterLector;