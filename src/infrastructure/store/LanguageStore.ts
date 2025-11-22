import { create } from 'zustand';
import { type LanguageDTO } from '../../domain/dto/LanguageDTO.ts';

interface LanguageState {
    languages: LanguageDTO[];
    selectedLanguage: LanguageDTO | null;
    isLoading: boolean;
    error: string | null;

    setLanguages: (languages: LanguageDTO[]) => void;
    addLanguage: (language: LanguageDTO) => void;
    removeLanguage: (languageId: number) => void;
    selectLanguage: (language: LanguageDTO) => void;
    clearSelectedLanguage: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    getLanguageById: (id: number) => LanguageDTO | undefined;
    getLanguageByName: (name: string) => LanguageDTO | undefined;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
    languages: [],
    selectedLanguage: null,
    isLoading: false,
    error: null,

    setLanguages: (languages) => set({ languages }),

    addLanguage: (language) => set((state) => ({
        languages: [...state.languages, language]
    })),

    removeLanguage: (languageId) => set((state) => ({
        languages: state.languages.filter(language => language.id !== languageId),
        selectedLanguage: state.selectedLanguage?.id === languageId ? null : state.selectedLanguage
    })),

    selectLanguage: (language) => set({ selectedLanguage: language }),

    clearSelectedLanguage: () => set({ selectedLanguage: null }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    getLanguageById: (id) => {
        return get().languages.find(language => language.id === id);
    },

    getLanguageByName: (name) => {
        return get().languages.find(language => language.name.toLowerCase() === name.toLowerCase());
    },
}));