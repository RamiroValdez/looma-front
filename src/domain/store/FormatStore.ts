import { create } from 'zustand';
import type { WorkFormatDTO } from '../dto/WorkFormatDTO';

interface FormatState {
    formats: WorkFormatDTO[];
    selectedFormat: WorkFormatDTO | null;
    isLoading: boolean;
    error: string | null;

    setFormats: (formats: WorkFormatDTO[]) => void;
    addFormat: (format: WorkFormatDTO) => void;
    removeFormat: (formatId: number) => void;
    selectFormat: (format: WorkFormatDTO) => void;
    clearSelectedFormat: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    getFormatById: (id: number) => WorkFormatDTO | undefined;
    getFormatByName: (name: string) => WorkFormatDTO | undefined;
}

export const useFormatStore = create<FormatState>((set, get) => ({
    formats: [],
    selectedFormat: null,
    isLoading: false,
    error: null,

    setFormats: (formats) => set({ formats }),

    addFormat: (format) => set((state) => ({
        formats: [...state.formats, format]
    })),

    removeFormat: (formatId) => set((state) => ({
        formats: state.formats.filter(format => format.id !== formatId),
        selectedFormat: state.selectedFormat?.id === formatId ? null : state.selectedFormat
    })),

    selectFormat: (format) => set({ selectedFormat: format }),

    clearSelectedFormat: () => set({ selectedFormat: null }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    getFormatById: (id) => {
        return get().formats.find(format => format.id === id);
    },

    getFormatByName: (name) => {
        return get().formats.find(format => format.name.toLowerCase() === name.toLowerCase());
    },
}));