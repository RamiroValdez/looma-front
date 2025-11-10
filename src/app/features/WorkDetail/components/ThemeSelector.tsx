import type { Theme, ThemeType , FontSizeType} from '../hooks/useTheme';
import { fontSizes } from '../hooks/useTheme';

interface ThemeSelectorProps {
  themes: Theme[];
  currentTheme: string;
  currentFontSize: FontSizeType;
  onThemeChange: (themeId: ThemeType) => void;
  onFontSizeChange: (size: FontSizeType) => void;
  onClose: () => void;
}

const ThemeSelector = ({ 
  themes, 
  currentTheme, 
  currentFontSize,
  onThemeChange, 
  onFontSizeChange,
  onClose 
}: ThemeSelectorProps) => {
  return (
    <div 
      className="fixed inset-0 z-[100000] flex items-end justify-center bg-black/30"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-2xl p-6 w-full max-w-md mb-20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Estilos de lectura</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-[#5C17A6] mb-3 uppercase tracking-wide">Tema de color</h4>
          <div className="grid grid-cols-4 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer ${
                  currentTheme === theme.id
                    ? 'ring-2 ring-[#5C17A6] bg-purple-50'
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-1 shadow-md"
                  style={{ backgroundColor: theme.iconBg }}
                >
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: theme.textColor }}
                  >
                    A
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-700">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 mb-6"></div>

        <div>
          <h4 className="text-sm font-semibold text-[#5C17A6] mb-3 uppercase tracking-wide">Tamaño de texto</h4>
          <div className="grid grid-cols-4 gap-3">
            {(Object.keys(fontSizes) as FontSizeType[]).map((sizeKey) => (
              <button
                key={sizeKey}
                onClick={() => onFontSizeChange(sizeKey)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer ${
                  currentFontSize === sizeKey
                    ? 'ring-2 ring-[#5C17A6] bg-purple-50'
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span 
                  className="font-bold mb-1"
                  style={{ 
                    fontSize: sizeKey === 'small' ? '16px' :
                             sizeKey === 'normal' ? '20px' :
                             sizeKey === 'large' ? '24px' : '28px'
                  }}
                >
                  Aa
                </span>
                <span className="text-xs font-medium text-gray-700">
                  {fontSizes[sizeKey].label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;