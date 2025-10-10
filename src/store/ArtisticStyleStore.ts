import { create } from 'zustand';
import { type ArtisticStyleDTO } from '../dto/ArtisticStyleDTO';

interface ArtisticStyleState {
    // --- ESTADO ---
    artisticStyles: ArtisticStyleDTO[];
    selectedArtisticStyle: ArtisticStyleDTO | null;
    isLoading: boolean;
    error: string | null;

    // Para manejar la lista maestra
    setArtisticStyles: (styles: ArtisticStyleDTO[]) => void;
    addArtisticStyle: (style: ArtisticStyleDTO) => void;      
    removeArtisticStyle: (styleId: number) => void;           

    // Para manejar la selección del usuario
    selectArtisticStyle: (style: ArtisticStyleDTO) => void;
    clearSelectedArtisticStyle: () => void;
    
    // Para manejar los estados de carga
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // --- SELECTORES ---
    getArtisticStyleById: (id: number) => ArtisticStyleDTO | undefined; 
}

export const useArtisticStyleStore = create<ArtisticStyleState>((set, get) => ({
    // Estado inicial
    artisticStyles: [],
    selectedArtisticStyle: null,
    isLoading: false,
    error: null,

    setArtisticStyles: (styles) => set({ artisticStyles: styles }),

    addArtisticStyle: (style) => set((state) => ({        
        artisticStyles: [...state.artisticStyles, style]
    })),

    removeArtisticStyle: (styleId) => set((state) => ({    
        artisticStyles: state.artisticStyles.filter(style => style.id !== styleId),
        // Si el estilo eliminado era el que estaba seleccionado, limpiamos la selección
        selectedArtisticStyle: state.selectedArtisticStyle?.id === styleId ? null : state.selectedArtisticStyle
    })),

    selectArtisticStyle: (style) => set({ selectedArtisticStyle: style }),
    clearSelectedArtisticStyle: () => set({ selectedArtisticStyle: null }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    // Selectores
    getArtisticStyleById: (id) => {                          
        return get().artisticStyles.find(style => style.id === id);
    },
}));