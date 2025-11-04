interface FooterLectorProps {
  selectedLanguages: { code: string; name: string }[];
  chapterTitle: string;
  onLanguageChange: (languageCode: string) => void;
  disableLanguageSelect?: boolean;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
}

const FooterLector = ({ selectedLanguages, chapterTitle, onLanguageChange, disableLanguageSelect = false, onToggleFullScreen, isFullScreen = false }: FooterLectorProps) => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#3b245a] text-white px-6 py-3 flex items-center justify-between flex-wrap z-50">

      <div className="flex items-end gap-6">

        <div className="flex flex-col justify-center leading-tight">
          <span className="text-base font-semibold">{chapterTitle}</span>
          <div className="flex items-center gap-3 text-xs text-gray-300 mt-[2px]">
            <span className="flex items-center gap-1">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-white"
              >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
              <span>1k</span>
            </span>
            <span className="flex items-center gap-1">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <span>7k</span>
            </span>
          </div>
        </div>

        <div className="h-10 w-[1px] bg-gray-400"></div>

        <div className="flex items-center gap-8 text-gray-300">

          <div className="flex flex-col items-center leading-tight">
            <span className="text-lg">A</span>
            <span className="text-[10px] uppercase">Estilo</span>
          </div>

          <div className="flex flex-col items-center leading-tight text-white">
            <span className="text-[10px] uppercase mb-1">Idiomas</span>
            <select
              className={`bg-transparent text-white font-bold text-sm border border-gray-300 rounded-md px-2 py-1 focus:text-black focus:bg-white ${"disabled:opacity-60"
                }`}
              onChange={(e) => onLanguageChange(e.target.value)}
              disabled={disableLanguageSelect}
            >
              {selectedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-black">
                  {lang.name} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>

          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-gray-300 hover:text-white cursor-pointer text-xs mt-2 sm:mt-0" onClick={onToggleFullScreen}>
        {isFullScreen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mb-[1px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mb-[1px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 3H5a2 2 0 00-2 2v3m0 8v3a2 2 0 002 2h3m8-18h3a2 2 0 012 2v3m0 8v3a2 2 0 01-2 2h-3"
            />
          </svg>
        )}
        <span>Screen</span>
      </div>
    </footer>
  );
};

export default FooterLector;

