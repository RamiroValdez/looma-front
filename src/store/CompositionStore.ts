import { create } from 'zustand';
import { type CompositionDTO } from '../dto/CompositionDTO';

interface CompositionState {
    // --- ESTADO ---
    compositions: CompositionDTO[];
    selectedComposition: CompositionDTO | null;
    isLoading: boolean;
    error: string | null;

    // --- ACCIONES ---
    // Para manejar la lista maestra
    setCompositions: (compositions: CompositionDTO[]) => void;
    addComposition: (composition: CompositionDTO) => void;
    removeComposition: (compositionId: number) => void;

    // Para manejar la selección del usuario
    selectComposition: (composition: CompositionDTO) => void;
    clearSelectedComposition: () => void;
    
    // Para manejar los estados de carga
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // --- SELECTORES ---
    getCompositionById: (id: number) => CompositionDTO | undefined;
}

export const useCompositionStore = create<CompositionState>((set, get) => ({
    // Estado inicial
    compositions: [],
    selectedComposition: null,
    isLoading: false,
    error: null,

    // Acciones
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

    // Selectores
    getCompositionById: (id) => {
        return get().compositions.find(comp => comp.id === id);
    },
}));