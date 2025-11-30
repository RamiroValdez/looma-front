import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useManageWorkData } from '../../app/features/ManageWork/hooks/useManageWorkData';
import type { CategoryDTO } from '../../domain/dto/CategoryDTO';

type HookResult = { current: ReturnType<typeof useManageWorkData> };

function expectWorkToBeNull(result: HookResult) {
  expect(result.current.work).toBeNull();
}

function expectLoadingToBe(result: HookResult, expected: boolean) {
  expect(result.current.loading).toBe(expected);
}

function expectErrorToBeNull(result: HookResult) {
  expect(result.current.error).toBeNull();
}

function expectSelectedCategoriesToEqual(result: HookResult, expected: CategoryDTO[]) {
  expect(result.current.selectedCategories).toEqual(expected);
}

function expectCurrentTagsToEqual(result: HookResult, expected: string[]) {
  expect(result.current.currentTags).toEqual(expected);
}

function expectIsAddingTagToBe(result: HookResult, expected: boolean) {
  expect(result.current.isAddingTag).toBe(expected);
}

function expectNewTagTextToBe(result: HookResult, expected: string) {
  expect(result.current.newTagText).toBe(expected);
}

function expectPriceToBe(result: HookResult, expected: string) {
  expect(result.current.price).toBe(expected);
}

function expectAllowSubscriptionToBe(result: HookResult, expected: boolean) {
  expect(result.current.allowSubscription).toBe(expected);
}

function expectFunctionToBeDefined(result: HookResult, functionName: keyof ReturnType<typeof useManageWorkData>) {
  expect(result.current[functionName]).toBeDefined();
}

function expectShortMessageValue(result: HookResult, expected: string) {
  expect(result.current.shortMessage).toBe(expected);
}

function expectAiSuggestionMessageValue(result: HookResult, expected: string) {
  expect(result.current.aiSuggestionMessage).toBe(expected);
}

function expectIsDescriptionValidToBe(result: HookResult, expected: boolean) {
  expect(result.current.isDescriptionValid).toBe(expected);
}

function expectSelectedCategoriesToContain(result: HookResult, category: CategoryDTO) {
  expect(result.current.selectedCategories).toContain(category);
}

function expectCategoryMenuToBeClosed(result: HookResult) {
  expect(result.current.isCategoryMenuOpen).toBe(false);
}

function expectSelectedCategoriesToHaveLength(result: HookResult, length: number) {
  expect(result.current.selectedCategories).toHaveLength(length);
}

function expectCategoryMenuToBeOpen(result: HookResult) {
  expect(result.current.isCategoryMenuOpen).toBe(true);
}

vi.mock('../../infrastructure/services/CreateWorkService', () => ({
  handleAddTag: vi.fn(),
  validateFile: vi.fn(),
  useClickOutside: vi.fn(),
}));

vi.mock('../../infrastructure/services/TagSuggestionService', () => ({
  useSuggestTagsMutation: () => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

vi.mock('../../infrastructure/services/ChapterService', () => ({
  addChapter: vi.fn(),
  getWorkById: vi.fn().mockResolvedValue({
    id: 1,
    title: 'Test Work',
    description: 'Test description with more than twenty characters',
    categories: [],
    tags: [],
    price: 0,
    state: 'InProgress'
  }),
}));

vi.mock('../../infrastructure/services/WorkAssetsService', () => ({
  uploadCover: vi.fn(),
  uploadBanner: vi.fn(),
}));

vi.mock('../../infrastructure/services/ToastProviderService', () => ({
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
}));

vi.mock('../../infrastructure/api/apiClient', () => ({
  apiClient: {
    request: vi.fn(),
  },
}));

vi.mock('../../infrastructure/store/AuthStore', () => ({
  useAuthStore: () => ({
    token: 'mock-token',
  }),
}));

vi.mock('../app/hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [],
    isLoading: false,
    error: null,
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('useManageWorkData Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Inicialización del hook', () => {
    it('debería inicializar work como null', () => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
      const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
      const { result } = renderHook(() => useManageWorkData(1), { wrapper });
      expectWorkToBeNull(result);
    });

    it('debería inicializar loading como true', () => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
      const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
      const { result } = renderHook(() => useManageWorkData(1), { wrapper });
      expectLoadingToBe(result, true);
    });

    it('debería inicializar error como null', () => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
      const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
      const { result } = renderHook(() => useManageWorkData(1), { wrapper });
      expectErrorToBeNull(result);
    });

    it('debería inicializar selectedCategories como array vacío', () => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
      const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
      const { result } = renderHook(() => useManageWorkData(1), { wrapper });
      expectSelectedCategoriesToEqual(result, []);
    });

    it('debería inicializar currentTags como array vacío', () => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
      const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
      const { result } = renderHook(() => useManageWorkData(1), { wrapper });
      expectCurrentTagsToEqual(result, []);
    });

    it('debería inicializar isAddingTag como false', () => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
      const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
      const { result } = renderHook(() => useManageWorkData(1), { wrapper });
      expectIsAddingTagToBe(result, false);
    });

    it('debería inicializar newTagText como string vacío', () => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
      const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
      const { result } = renderHook(() => useManageWorkData(1), { wrapper });
      expectNewTagTextToBe(result, '');
    });

    it('debería inicializar price como string vacío', () => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
      const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
      const { result } = renderHook(() => useManageWorkData(1), { wrapper });
      expectPriceToBe(result, '');
    });

    it('debería inicializar allowSubscription como false', () => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
      const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
      const { result } = renderHook(() => useManageWorkData(1), { wrapper });
      expectAllowSubscriptionToBe(result, false);
    });

    it('debera proporcionar función handleAddCategory', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expectFunctionToBeDefined(result, 'handleAddCategory');
    });

    it('debera proporcionar función unselectCategory', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expectFunctionToBeDefined(result, 'unselectCategory');
    });

    it('debera proporcionar función handleFileChange', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expectFunctionToBeDefined(result, 'handleFileChange');
    });

    it('debera proporcionar función handleSaveCover', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expectFunctionToBeDefined(result, 'handleSaveCover');
    });

    it('debera proporcionar función handleTagSubmit', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expect(typeof result.current.handleTagSubmit).toBe('function');
    });

    it('debería proporcionar setter setIsAddingTag', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expect(typeof result.current.setIsAddingTag).toBe('function');
    });

    it('debería proporcionar setter setNewTagText', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expect(typeof result.current.setNewTagText).toBe('function');
    });

    it('debería proporcionar setter setPrice', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expectFunctionToBeDefined(result, 'setPrice');
    });

    it('debería tener valor correcto de shortMessage', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expectShortMessageValue(result, 'Tags con IA: tu descripción tiene menos de 20 caracteres.');
    });

    it('debería tener valor correcto de aiSuggestionMessage', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expectAiSuggestionMessageValue(result, 'Sugerencias de la IA');
    });

    it('debera inicializar isDescriptionValid como false', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expectIsDescriptionValidToBe(result, false);
    });
  });

  describe('Gestión de categorías', () => {
    it('debera agregar categoría a selectedCategories', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });
      const category: CategoryDTO = { id: 1, name: 'Fantasía' };      act(() => {
        result.current.handleAddCategory(category);
      });      expectSelectedCategoriesToContain(result, category);
    });

    it('debera cerrar menú de categorías al agregar categoría', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });
      const category: CategoryDTO = { id: 1, name: 'Fantasía' };      act(() => {
        result.current.handleAddCategory(category);
      });      expectCategoryMenuToBeClosed(result);
    });

    it('no debera agregar categorías duplicadas', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });
      const category: CategoryDTO = { id: 1, name: 'Fantasía' };      act(() => {
        result.current.handleAddCategory(category);
        result.current.handleAddCategory(category);
      });      expectSelectedCategoriesToHaveLength(result, 1);
    });

    it('debera remover categoría de selectedCategories', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });
      const category1: CategoryDTO = { id: 1, name: 'Fantasía' };
      const category2: CategoryDTO = { id: 2, name: 'Romance' };

      act(() => {
        result.current.handleAddCategory(category1);
        result.current.handleAddCategory(category2);
      });      act(() => {
        result.current.unselectCategory(1);
      });      expectSelectedCategoriesToHaveLength(result, 1);
    });
  });

  describe('Gestión de etiquetas', () => {
    it('debera llamar preventDefault cuando se presiona Enter', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });
      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.setNewTagText('nueva-etiqueta');
      });      act(() => {
        result.current.handleTagSubmit(mockEvent);
      });      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('no debera llamar preventDefault para teclas que no son Enter', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });
      const mockEvent = {
        key: 'Space',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;      act(() => {
        result.current.handleTagSubmit(mockEvent);
      });      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('debera proporcionar función handleSuggestedTagClick', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expect(typeof result.current.handleSuggestedTagClick).toBe('function');
    });
  });

  describe('Validación de descripción', () => {
    it('debera retornar false para validaci�n de descripci�n vac�a', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expect(result.current.isDescriptionValid).toBe(false);
    });
  });

  describe('Gestión de estados', () => {
    it('debera actualizar estado isAddingTag', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      act(() => {
        result.current.setIsAddingTag(true);
      });      expect(result.current.isAddingTag).toBe(true);
    });

    it('debera actualizar estado newTagText', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      act(() => {
        result.current.setNewTagText('nuevo-tag');
      });      expect(result.current.newTagText).toBe('nuevo-tag');
    });

    it('debera actualizar estado price', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      act(() => {
        result.current.setPrice('15.99');
      });      expect(result.current.price).toBe('15.99');
    });

    it('debera actualizar estado allowSubscription', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      act(() => {
        result.current.setAllowSubscription(true);
      });      expect(result.current.allowSubscription).toBe(true);
    });

    it('debera actualizar estado workStatus', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      act(() => {
        result.current.setWorkStatus('finished');
      });      expect(result.current.workStatus).toBe('finished');
    });

    it('debera actualizar estado showCoverModal', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      act(() => {
        result.current.setShowCoverModal(true);
      });      expect(result.current.showCoverModal).toBe(true);
    });

    it('debera actualizar estado showCoverModalAi', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      act(() => {
        result.current.setShowCoverModalAi(true);
      });      expect(result.current.showCoverModalAi).toBe(true);
    });

    it('debera actualizar estado isCategoryMenuOpen', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      act(() => {
        result.current.setIsCategoryMenuOpen(true);
      });      expectCategoryMenuToBeOpen(result);
    });

    it('debera actualizar estado isSuggestionMenuOpen', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      act(() => {
        result.current.setIsSuggestionMenuOpen(true);
      });      expect(result.current.isSuggestionMenuOpen).toBe(true);
    });

    it('debera actualizar estado showIATooltip', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      act(() => {
        result.current.setShowIATooltip(true);
      });      expect(result.current.showIATooltip).toBe(true);
    });

    it('debera actualizar estado showBannerTooltip', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      act(() => {
        result.current.setShowBannerTooltip(true);
      });      expect(result.current.showBannerTooltip).toBe(true);
    });
  });

  describe('Referencias', () => {
    it('debera proporcionar bannerInputRef', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expect(result.current.bannerInputRef).toBeDefined();
    });

    it('debera proporcionar coverInputRef', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expect(result.current.coverInputRef).toBeDefined();
    });

    it('debera inicializar bannerInputRef como null', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expect(result.current.bannerInputRef.current).toBeNull();
    });
  });

  describe('Funciones de archivo', () => {
    it('no debera lanzar error cuando se llama handleBannerClick', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expect(() => {
        act(() => {
          result.current.handleBannerClick();
        });
      }).not.toThrow();
    });
  });

  describe('Valores computados', () => {
    it('debera retornar constante shortMessage correcta', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expect(result.current.shortMessage).toBe('Tags con IA: tu descripción tiene menos de 20 caracteres.');
    });

    it('debera retornar constante aiSuggestionMessage correcta', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expect(result.current.aiSuggestionMessage).toBe('Sugerencias de la IA');
    });
  });

  describe('Gestión de etiquetas sugeridas', () => {
    it('debera inicializar suggestedTags como array', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expect(Array.isArray(result.current.suggestedTags)).toBe(true);
    });

    it('debera inicializar suggestedTags como vac�o', () => {      const { result } = renderHook(() => useManageWorkData(1), {
        wrapper: (({ children }: { children: React.ReactNode }) => { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }),
      });      expect(result.current.suggestedTags).toHaveLength(0);
    });
  });
});
