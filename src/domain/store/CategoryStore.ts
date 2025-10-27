import { create } from 'zustand';
import type {CategoryDTO} from '../../domain/dto/CategoryDTO';

interface CategoryState {
    categories: CategoryDTO[];
    selectedCategories: CategoryDTO[];
    isLoading: boolean;
    error: string | null;

    setCategories: (categories: CategoryDTO[]) => void;
    addCategory: (category: CategoryDTO) => void;
    removeCategory: (categoryId: number) => void;
    selectCategory: (category: CategoryDTO) => void;
    unselectCategory: (categoryId: number) => void;
    clearSelectedCategories: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    getCategoryById: (id: number) => CategoryDTO | undefined;
    getSelectedCategoryIds: () => number[];
    isSelectedCategory: (id: number) => boolean;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    selectedCategories: [],
    isLoading: false,
    error: null,

    setCategories: (categories) => set({ categories }),

    addCategory: (category) => set((state) => ({
        categories: [...state.categories, category]
    })),

    removeCategory: (categoryId) => set((state) => ({
        categories: state.categories.filter(cat => cat.id !== categoryId),
        selectedCategories: state.selectedCategories.filter(cat => cat.id !== categoryId)
    })),

    selectCategory: (category) => set((state) => {
        if (!state.selectedCategories.find(cat => cat.id === category.id)) {
            return { selectedCategories: [...state.selectedCategories, category] };
        }
        return state;
    }),

    unselectCategory: (categoryId) => set((state) => ({
        selectedCategories: state.selectedCategories.filter(cat => cat.id !== categoryId)
    })),

    clearSelectedCategories: () => set({ selectedCategories: [] }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    getCategoryById: (id) => {
        return get().categories.find(cat => cat.id === id);
    },

    getSelectedCategoryIds: () => {
        return get().selectedCategories.map(cat => cat.id);
    },

    isSelectedCategory: (id) => {
        return get().selectedCategories.some(cat => cat.id === id);
    },
}));