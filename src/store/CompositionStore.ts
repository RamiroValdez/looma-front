import { create } from 'zustand';
import { type CompositionDTO } from '../dto/CompositionDTO';

interface CompositionState {
    compositions: CompositionDTO[];
    selectedComposition: CompositionDTO | null;
    isLoading: boolean;
    error: string | null;

    setCompositions: (compositions: CompositionDTO[]) => void;
    addComposition: (composition: CompositionDTO) => void;
    removeComposition: (compositionId: number) => void;

    selectComposition: (composition: CompositionDTO) => void;
    clearSelectedComposition: () => void;
    
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    getCompositionById: (id: number) => CompositionDTO | undefined;
}

export const useCompositionStore = create<CompositionState>((set, get) => ({
    compositions: [],
    selectedComposition: null,
    isLoading: false,
    error: null,

    setCompositions: (compositions) => set({ compositions: compositions }),

    addComposition: (composition) => set((state) => ({
        compositions: [...state.compositions, composition]
    })),

    removeComposition: (compositionId) => set((state) => ({
        compositions: state.compositions.filter(comp => comp.id !== compositionId),
        selectedComposition: state.selectedComposition?.id === compositionId ? null : state.selectedComposition
    })),

    selectComposition: (composition) => set({ selectedComposition: composition }),
    clearSelectedComposition: () => set({ selectedComposition: null }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    getCompositionById: (id) => {
        return get().compositions.find(comp => comp.id === id);
    },
}));