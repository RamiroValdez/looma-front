import { create } from 'zustand';
import { type ArtisticStyleDTO } from '../../domain/dto/ArtisticStyleDTO';

interface ArtisticStyleState {
    artisticStyles: ArtisticStyleDTO[];
    selectedArtisticStyle: ArtisticStyleDTO | null;
    isLoading: boolean;
    error: string | null;

    setArtisticStyles: (styles: ArtisticStyleDTO[]) => void;
    addArtisticStyle: (style: ArtisticStyleDTO) => void;      
    removeArtisticStyle: (styleId: number) => void;           

    selectArtisticStyle: (style: ArtisticStyleDTO) => void;
    clearSelectedArtisticStyle: () => void;
    
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    getArtisticStyleById: (id: number) => ArtisticStyleDTO | undefined; 
}

export const useArtisticStyleStore = create<ArtisticStyleState>((set, get) => ({
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
        selectedArtisticStyle: state.selectedArtisticStyle?.id === styleId ? null : state.selectedArtisticStyle
    })),

    selectArtisticStyle: (style) => set({ selectedArtisticStyle: style }),
    clearSelectedArtisticStyle: () => set({ selectedArtisticStyle: null }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    getArtisticStyleById: (id) => {                          
        return get().artisticStyles.find(style => style.id === id);
    },
}));