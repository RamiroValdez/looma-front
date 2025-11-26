import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLanguages, getLanguagesFromStore } from '../../infrastructure/services/LanguageService';
import { useApiQuery } from '../../infrastructure/api/useApiQuery';
import { useLanguageStore } from '../../infrastructure/store/LanguageStore';
import { renderHook } from '@testing-library/react';

vi.mock('../../infrastructure/api/useApiQuery', () => ({
  useApiQuery: vi.fn()
}));

vi.mock('../../infrastructure/store/LanguageStore', () => ({
  useLanguageStore: vi.fn(),
}));

const mockSetLanguages = vi.fn();
const mockSetLoading = vi.fn();
const mockSetError = vi.fn();

Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_GET_LANGUAGES_URL: '/languages/obtain-all'
  },
  configurable: true
});

const expectApiQueryCalled = () => {
  expect(useApiQuery).toHaveBeenCalledWith(
    ['languages'],
    expect.objectContaining({
      url: '/languages/obtain-all',
      method: 'GET'
    }),
    expect.objectContaining({
      staleTime: 5 * 60 * 1000
    })
  );
};

const expectReturnedLanguages = (result: any, expectedLanguages: any[]) => {
  expect(result.languages).toEqual(expectedLanguages);
};

const expectReturnedLoading = (result: any, expectedLoading: boolean) => {
  expect(result.isLoading).toBe(expectedLoading);
};

const expectReturnedError = (result: any, expectedError: string | null) => {
  expect(result.error).toBe(expectedError);
};

const expectStoreGetStateCalled = () => {
  expect(useLanguageStore.getState).toHaveBeenCalled();
};

const expectReturnedLanguagesArray = (languages: any[], expectedLength: number) => {
  expect(languages).toHaveLength(expectedLength);
};

const setupEmptyLanguageStore = () => {
  vi.mocked(useLanguageStore).mockReturnValue({
    languages: [],
    setLanguages: mockSetLanguages,
    setLoading: mockSetLoading,
    setError: mockSetError,
    selectedLanguage: null,
    isLoading: false,
    error: null,
    addLanguage: vi.fn(),
    updateLanguage: vi.fn(),
    deleteLanguage: vi.fn(),
    selectLanguage: vi.fn(),
    clearLanguages: vi.fn()
  });
};

const setupLanguageStoreWithData = (languages: any[]) => {
  vi.mocked(useLanguageStore).mockReturnValue({
    languages,
    setLanguages: mockSetLanguages,
    setLoading: mockSetLoading,
    setError: mockSetError,
    selectedLanguage: null,
    isLoading: false,
    error: null,
    addLanguage: vi.fn(),
    updateLanguage: vi.fn(),
    deleteLanguage: vi.fn(),
    selectLanguage: vi.fn(),
    clearLanguages: vi.fn()
  });
};

const setupSuccessfulApiQuery = (data: any) => {
  vi.mocked(useApiQuery).mockReturnValue({
    data,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    isError: false,
    isPending: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: true,
    status: 'success',
    fetchStatus: 'idle',
    errorUpdatedAt: 0,
    dataUpdatedAt: Date.now(),
    errorUpdateCount: 0,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isInitialLoading: false,
    isPlaceholderData: false,
    isPreviousData: false,
    isRefetching: false,
    isStale: false,
    failureCount: 0,
    failureReason: null
  } as any);
};

const setupLoadingApiQuery = () => {
  vi.mocked(useApiQuery).mockReturnValue({
    data: undefined,
    isLoading: true,
    error: null,
    refetch: vi.fn(),
    isError: false,
    isPending: true,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: false,
    status: 'pending',
    fetchStatus: 'fetching',
    errorUpdatedAt: 0,
    dataUpdatedAt: 0,
    errorUpdateCount: 0,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: true,
    isInitialLoading: true,
    isPlaceholderData: false,
    isPreviousData: false,
    isRefetching: false,
    isStale: false,
    failureCount: 0,
    failureReason: null
  } as any);
};

const setupErrorApiQuery = (errorMessage: string) => {
  vi.mocked(useApiQuery).mockReturnValue({
    data: undefined,
    isLoading: false,
    error: new Error(errorMessage),
    refetch: vi.fn(),
    isError: true,
    isPending: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: false,
    status: 'error',
    fetchStatus: 'idle',
    errorUpdatedAt: Date.now(),
    dataUpdatedAt: 0,
    errorUpdateCount: 1,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isInitialLoading: false,
    isPlaceholderData: false,
    isPreviousData: false,
    isRefetching: false,
    isStale: false,
    failureCount: 1,
    failureReason: new Error(errorMessage)
  } as any);
};

const setupLanguageStoreGetState = (languages: any[]) => {
  (useLanguageStore as any).getState = vi.fn().mockReturnValue({
    languages,
    setLanguages: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
    selectedLanguage: null,
    isLoading: false,
    error: null,
    addLanguage: vi.fn(),
    updateLanguage: vi.fn(),
    deleteLanguage: vi.fn(),
    selectLanguage: vi.fn(),
    clearLanguages: vi.fn()
  });
};

describe('LanguageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useLanguages', () => {
    describe('Casos de store vacío', () => {
      it('dado que store está vacío, cuando se ejecuta useLanguages, entonces configura API query correctamente', () => {
        setupEmptyLanguageStore();
        setupSuccessfulApiQuery([]);

        renderHook(() => useLanguages());

        expectApiQueryCalled();
      });

      it('dado que API está cargando, cuando se ejecuta useLanguages, entonces retorna loading true', () => {
        setupEmptyLanguageStore();
        setupLoadingApiQuery();

        const { result } = renderHook(() => useLanguages());

        expectReturnedLoading(result.current, true);
      });

      it('dado que API retorna datos normalizados, cuando se ejecuta useLanguages, entonces retorna los datos', () => {
        setupEmptyLanguageStore();
        setupSuccessfulApiQuery([{ id: 1, code: 'es', name: 'Español' }]);

        const { result } = renderHook(() => useLanguages());

        expectReturnedLanguages(result.current, [{ id: 1, code: 'es', name: 'Español' }]);
      });

      it('dado que API retorna error, cuando se ejecuta useLanguages, entonces retorna error como string', () => {
        setupEmptyLanguageStore();
        setupErrorApiQuery('Network error');

        const { result } = renderHook(() => useLanguages());

        expectReturnedError(result.current, 'Error: Network error');
      });
    });

    describe('Casos de store con datos', () => {
      it('dado que store tiene datos, cuando se ejecuta useLanguages, entonces retorna datos del store', () => {
        const storeLanguages = [{ id: 1, code: 'en', name: 'English' }];
        setupLanguageStoreWithData(storeLanguages);
        setupSuccessfulApiQuery([]);

        const { result } = renderHook(() => useLanguages());

        expectReturnedLanguages(result.current, storeLanguages);
      });

      it('dado que store tiene datos, cuando se ejecuta useLanguages, entonces no está en loading', () => {
        setupLanguageStoreWithData([{ id: 1, code: 'fr', name: 'Français' }]);
        setupLoadingApiQuery();

        const { result } = renderHook(() => useLanguages());

        expectReturnedLoading(result.current, false);
      });
    });

    describe('Manejo de respuestas complejas', () => {
      it('dado que API retorna objeto con propiedad languages, cuando se ejecuta useLanguages, entonces normaliza correctamente', () => {
        setupEmptyLanguageStore();
        setupSuccessfulApiQuery({ languages: [{ id: 1, code: 'de', name: 'Deutsch' }] });

        const { result } = renderHook(() => useLanguages());

        expectReturnedLanguages(result.current, [{ id: 1, code: 'de', name: 'Deutsch' }]);
      });

      it('dado que API retorna objeto con propiedad data, cuando se ejecuta useLanguages, entonces normaliza correctamente', () => {
        setupEmptyLanguageStore();
        setupSuccessfulApiQuery({ data: [{ id: 1, code: 'it', name: 'Italiano' }] });

        const { result } = renderHook(() => useLanguages());

        expectReturnedLanguages(result.current, [{ id: 1, code: 'it', name: 'Italiano' }]);
      });

      it('dado que API retorna datos inválidos, cuando se ejecuta useLanguages, entonces retorna array vacío', () => {
        setupEmptyLanguageStore();
        setupSuccessfulApiQuery('invalid data');

        const { result } = renderHook(() => useLanguages());

        expectReturnedLanguagesArray(result.current.languages, 0);
      });
    });
  });

  describe('getLanguagesFromStore', () => {
    describe('Casos de acceso directo al store', () => {
      it('dado que se llama getLanguagesFromStore, cuando se ejecuta, entonces accede al estado del store', () => {
        setupLanguageStoreGetState([]);

        getLanguagesFromStore();

        expectStoreGetStateCalled();
      });

      it('dado que store tiene idiomas, cuando se ejecuta getLanguagesFromStore, entonces retorna array de idiomas', () => {
        const languages = [{ id: 1, code: 'pt', name: 'Português' }];
        setupLanguageStoreGetState(languages);

        const result = getLanguagesFromStore();

        expectReturnedLanguages({ languages: result }, languages);
      });

      it('dado que store está vacío, cuando se ejecuta getLanguagesFromStore, entonces retorna array vacío', () => {
        setupLanguageStoreGetState([]);

        const result = getLanguagesFromStore();

        expectReturnedLanguagesArray(result, 0);
      });
    });
  });
});