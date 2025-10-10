import { create } from 'zustand';
import { type ColorPaletteDTO } from '../dto/ColorPaletteDTO';

interface ColorPaletteState {
    // --- ESTADO ---
    colorPalettes: ColorPaletteDTO[];
    selectedColorPalette: ColorPaletteDTO | null;
    isLoading: boolean;
    error: string | null;

    // --- ACCIONES ---
    // Para manejar la lista maestra
    setColorPalettes: (palettes: ColorPaletteDTO[]) => void;
    addColorPalette: (palette: ColorPaletteDTO) => void;
    removeColorPalette: (paletteId: number) => void;

    // Para manejar la selección del usuario
    selectColorPalette: (palette: ColorPaletteDTO) => void;
    clearSelectedColorPalette: () => void;
    
    // Para manejar los estados de carga
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // --- SELECTORES ---
    getColorPaletteById: (id: number) => ColorPaletteDTO | undefined;
}

export const useColorPaletteStore = create<ColorPaletteState>((set, get) => ({
    // Estado inicial
    colorPalettes: [],
    selectedColorPalette: null,
    isLoading: false,
    error: null,

    // Acciones
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

    // Selectores
    getColorPaletteById: (id) => {
        return get().colorPalettes.find(palette => palette.id === id);
    },
}));