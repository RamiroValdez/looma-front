import { create } from 'zustand';
import { type ColorPaletteDTO } from '../../domain/dto/ColorPaletteDTO.ts';

interface ColorPaletteState {
    colorPalettes: ColorPaletteDTO[];
    selectedColorPalette: ColorPaletteDTO | null;
    isLoading: boolean;
    error: string | null;

    setColorPalettes: (palettes: ColorPaletteDTO[]) => void;
    addColorPalette: (palette: ColorPaletteDTO) => void;
    removeColorPalette: (paletteId: number) => void;

    selectColorPalette: (palette: ColorPaletteDTO) => void;
    clearSelectedColorPalette: () => void;
    
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    getColorPaletteById: (id: number) => ColorPaletteDTO | undefined;
}

export const useColorPaletteStore = create<ColorPaletteState>((set, get) => ({
    colorPalettes: [],
    selectedColorPalette: null,
    isLoading: false,
    error: null,

    setColorPalettes: (palettes) => set({ colorPalettes: palettes }),

    addColorPalette: (palette) => set((state) => ({
        colorPalettes: [...state.colorPalettes, palette]
    })),

    removeColorPalette: (paletteId) => set((state) => ({
        colorPalettes: state.colorPalettes.filter(palette => palette.id !== paletteId),
        selectedColorPalette: state.selectedColorPalette?.id === paletteId ? null : state.selectedColorPalette
    })),

    selectColorPalette: (palette) => set({ selectedColorPalette: palette }),
    clearSelectedColorPalette: () => set({ selectedColorPalette: null }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    getColorPaletteById: (id) => {
        return get().colorPalettes.find(palette => palette.id === id);
    },
}));