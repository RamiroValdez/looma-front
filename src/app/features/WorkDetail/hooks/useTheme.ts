import { useState, useEffect } from 'react';

export type ThemeType = 'light' | 'dark' | 'paper' | 'sepia';
export type FontSizeType = 'small' | 'normal' | 'large' | 'xlarge'; 

export interface Theme {
  id: ThemeType;
  name: string;
  bgColor: string;
  textColor: string;
  iconBg: string;
}

export const fontSizes: Record<FontSizeType, { label: string; size: string }> = {
  small: { label: 'Pequeña', size: '1rem' }, 
  normal: { label: 'Normal', size: '1.25rem' },      
  large: { label: 'Grande', size: '1.60rem' },    
  xlarge: { label: 'Gigante', size: '2rem' }, 
};

export const themes: Theme[] = [
  {
    id: 'light',
    name: 'Claro',
    bgColor: '#ffffff',
    textColor: '#080a0ee3',
    iconBg: '#f3f4f6',
  },
  {
    id: 'dark',
    name: 'Oscuro',
    bgColor: '#07080ebe',
    textColor: '#f9fafb',
    iconBg: '#374151',
  },
  {
    id: 'paper',
    name: 'Papel',
    bgColor: '#fef3c7',
    textColor: '#92400e',
    iconBg: '#fde68a',
  },
  {
    id: 'sepia',
    name: 'Sepia',
    bgColor: '#f5f1e8',
    textColor: '#3e2723',
    iconBg: '#e8dcc5',
  },
];

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');
  const [fontSize, setFontSize] = useState<FontSizeType>('normal'); 

  useEffect(() => {
    const savedTheme = localStorage.getItem('readerTheme') as ThemeType;
    const savedFontSize = localStorage.getItem('readerFontSize') as FontSizeType;
    
    if (savedTheme && themes.find(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
    }
    
    if (savedFontSize && fontSizes[savedFontSize]) {
      setFontSize(savedFontSize);
    }
  }, []);

  const changeTheme = (themeId: ThemeType) => {
    setCurrentTheme(themeId);
    localStorage.setItem('readerTheme', themeId);
  };

  const changeFontSize = (size: FontSizeType) => { 
    setFontSize(size);
    localStorage.setItem('readerFontSize', size);
  };

  const getTheme = () => themes.find(t => t.id === currentTheme) || themes[0];
  
  const getFontSize = () => fontSizes[fontSize]; 

  return {
    currentTheme,
    fontSize, 
    changeTheme,
    changeFontSize, 
    getTheme,
    getFontSize,
    themes,
  };
};