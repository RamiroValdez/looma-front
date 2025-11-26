import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateFile,
  handleAddCategory,
  handleAddTag,
  createFormDataForWork,
  createFormDataForIa,
  urlToFile,
  useCreateWork,
  useGenerateCover,
  type CreateWorkDTO
} from '../../infrastructure/services/CreateWorkService';
import { useAuthStore } from '../../infrastructure/store/AuthStore';
import { useApiMutation } from '../../infrastructure/api/useApiMutation';
import type { CoverIaFormDTO } from '../../domain/dto/FormCoverIaDTO';

vi.mock('../../infrastructure/store/AuthStore', () => ({
  useAuthStore: vi.fn()
}));

vi.mock('../../infrastructure/api/useApiMutation', () => ({
  useApiMutation: vi.fn()
}));

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const mockImage = vi.fn();
globalThis.Image = mockImage;

const mockCreateObjectURL = vi.fn();
globalThis.URL = { createObjectURL: mockCreateObjectURL } as any;

Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_POST_CREATE_WORK_URL: '/create-work/save',
    VITE_API_POST_CREATE_COVER_IA_URL: '/images/generate'
  },
  configurable: true
});

const expectValidationSuccess = (result: { valid: boolean; error?: string }) => {
  expect(result.valid).toBe(true);
  expect(result.error).toBeUndefined();
};

const expectValidationFailure = (result: { valid: boolean; error?: string }, expectedError: string) => {
  expect(result.valid).toBe(false);
  expect(result.error).toBe(expectedError);
};

const expectFormDataContains = (formData: FormData, key: string, expectedType: string) => {
  const value = formData.get(key);
  expect(value).toBeDefined();
  if (expectedType === 'File') {
    expect(value).toBeInstanceOf(File);
  } else if (expectedType === 'Blob') {
    expect(value).toBeInstanceOf(Blob);
  }
};

const expectFormDataNotContains = (formData: FormData, key: string) => {
  const value = formData.get(key);
  expect(value).toBeNull();
};

const expectApiMutationCalledWith = (url: string, method: string, token: string) => {
  expect(useApiMutation).toHaveBeenCalledWith({
    url,
    method,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

const expectFileCreated = (file: File, filename: string, mimeType: string) => {
  expect(file).toBeInstanceOf(File);
  expect(file.name).toBe(filename);
  expect(file.type).toBe(mimeType);
};

const expectFetchCalledWith = (url: string) => {
  expect(mockFetch).toHaveBeenCalledWith(url);
};

const expectSetStateCalledWith = (mockSetState: any, expectedValue: any) => {
  expect(mockSetState).toHaveBeenCalledWith(expectedValue);
};

const setupMockFile = (name: string, size: number, type: string = 'image/jpeg') => {
  const blob = new Blob(['test content'], { type });
  Object.defineProperty(blob, 'name', { value: name, writable: false });
  Object.defineProperty(blob, 'lastModified', { value: Date.now(), writable: false });
  Object.defineProperty(blob, 'size', { value: size, writable: false });
  Object.defineProperty(blob, 'webkitRelativePath', { value: '', writable: false });
  return blob as File;
};

const setupMockImage = (width: number, height: number, shouldLoad: boolean = true) => {
  const img = {
    width,
    height,
    onload: null as (() => void) | null,
    onerror: null as (() => void) | null,
    src: ''
  };
  
  mockImage.mockImplementation(() => {
    setTimeout(() => {
      if (shouldLoad && img.onload) {
        img.onload();
      } else if (!shouldLoad && img.onerror) {
        img.onerror();
      }
    }, 0);
    return img;
  });
  
  return img;
};

const setupValidFile = () => {
  return setupMockFile('test.jpg', 1024 * 1024, 'image/jpeg'); 
};

const setupOversizedFile = () => {
  return setupMockFile('large.jpg', 6 * 1024 * 1024, 'image/jpeg'); 
};

const setupValidImage = () => {
  return setupMockImage(800, 600, true);
};

const setupOversizedImage = () => {
  return setupMockImage(2000, 1500, true);
};

const setupInvalidImage = () => {
  return setupMockImage(0, 0, false);
};

const setupAuthToken = (token: string) => {
  vi.mocked(useAuthStore).mockReturnValue({
    token,
    isAuthenticated: !!token,
    setToken: vi.fn(),
    logout: vi.fn()
  });
};

const setupMockSetStates = () => {
  const setSelectedCategories = vi.fn();
  const setIsCategoryMenuOpen = vi.fn();
  const setCurrentTags = vi.fn();
  const setIsAddingTag = vi.fn();
  const setNewTagText = vi.fn();
  const setIsSuggestionMenuOpen = vi.fn();
  
  return {
    setSelectedCategories,
    setIsCategoryMenuOpen,
    setCurrentTags,
    setIsAddingTag,
    setNewTagText,
    setIsSuggestionMenuOpen
  };
};

const setupSuccessfulFetchResponse = (blobData: Blob) => {
  mockFetch.mockResolvedValue({
    ok: true,
    blob: vi.fn().mockResolvedValue(blobData)
  });
};

const setupFailedFetchResponse = () => {
  mockFetch.mockRejectedValue(new Error('Failed to fetch'));
};

const setupCreateWorkDTO = (): CreateWorkDTO => ({
  title: 'Test Work',
  description: 'Test Description',
  formatId: 1,
  originalLanguageId: 2,
  categoryIds: [1, 2],
  tagIds: ['tag1', 'tag2'],
  price: 9.99,
  coverIaUrl: 'https://example.com/cover.jpg'
});

const setupCoverIaFormDTO = (): CoverIaFormDTO => ({
  artisticStyleId: '1',
  colorPaletteId: '2',
  compositionId: '3',
  description: 'Test description for AI cover generation'
});

describe('CreateWorkService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateObjectURL.mockReturnValue('blob:test-url');
  });

  describe('handleAddCategory', () => {
    it('dado que categoría no existe en lista, cuando se ejecuta handleAddCategory, entonces agrega categoría', () => {
      const { setSelectedCategories, setIsCategoryMenuOpen } = setupMockSetStates();
      const selectedCategories = ['existing-category'];

      handleAddCategory('new-category', selectedCategories, setSelectedCategories, setIsCategoryMenuOpen);

      expect(setSelectedCategories).toHaveBeenCalledWith(['existing-category', 'new-category']);
    });

    it('dado que se ejecuta handleAddCategory, cuando termina proceso, entonces cierra menú de categorías', () => {
      const { setSelectedCategories, setIsCategoryMenuOpen } = setupMockSetStates();
      const selectedCategories = ['existing-category'];

      handleAddCategory('new-category', selectedCategories, setSelectedCategories, setIsCategoryMenuOpen);

      expectSetStateCalledWith(setIsCategoryMenuOpen, false);
    });

    it('dado que categoría ya existe en lista, cuando se ejecuta handleAddCategory, entonces no agrega categoría duplicada', () => {
      const { setSelectedCategories, setIsCategoryMenuOpen } = setupMockSetStates();
      const selectedCategories = ['existing-category'];

      handleAddCategory('existing-category', selectedCategories, setSelectedCategories, setIsCategoryMenuOpen);

      expect(setSelectedCategories).not.toHaveBeenCalled();
    });

    it('dado que categoría ya existe, cuando se ejecuta handleAddCategory, entonces cierra menú de categorías', () => {
      const { setSelectedCategories, setIsCategoryMenuOpen } = setupMockSetStates();
      const selectedCategories = ['existing-category'];

      handleAddCategory('existing-category', selectedCategories, setSelectedCategories, setIsCategoryMenuOpen);

      expectSetStateCalledWith(setIsCategoryMenuOpen, false);
    });

    it('dado que se agrega categoría, cuando se ejecuta handleAddCategory, entonces cierra menú de categorías', () => {
      const { setSelectedCategories, setIsCategoryMenuOpen } = setupMockSetStates();
      const selectedCategories: string[] = [];

      handleAddCategory('new-category', selectedCategories, setSelectedCategories, setIsCategoryMenuOpen);

      expectSetStateCalledWith(setIsCategoryMenuOpen, false);
    });
  });

  describe('handleAddTag', () => {
    it('dado que tag no existe en lista, cuando se ejecuta handleAddTag, entonces agrega tag normalizado', () => {
      const { setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen } = setupMockSetStates();
      const currentTags = ['existing-tag'];

      handleAddTag('New Tag', currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);

      expect(setCurrentTags).toHaveBeenCalledWith(['existing-tag', 'new-tag']);
    });

    it('dado que se ejecuta handleAddTag, cuando termina proceso, entonces marca como no agregando tag', () => {
      const { setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen } = setupMockSetStates();
      const currentTags = ['existing-tag'];

      handleAddTag('New Tag', currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);

      expectSetStateCalledWith(setIsAddingTag, false);
    });

    it('dado que se ejecuta handleAddTag, cuando termina proceso, entonces limpia texto de nuevo tag', () => {
      const { setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen } = setupMockSetStates();
      const currentTags = ['existing-tag'];

      handleAddTag('New Tag', currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);

      expectSetStateCalledWith(setNewTagText, '');
    });

    it('dado que se ejecuta handleAddTag, cuando termina proceso, entonces cierra menú de sugerencias', () => {
      const { setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen } = setupMockSetStates();
      const currentTags = ['existing-tag'];

      handleAddTag('New Tag', currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);

      expectSetStateCalledWith(setIsSuggestionMenuOpen, false);
    });

    it('dado que tag ya existe, cuando se ejecuta handleAddTag, entonces no agrega tag duplicado', () => {
      const { setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen } = setupMockSetStates();
      const currentTags = ['existing-tag'];

      handleAddTag('existing-tag', currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);

      expect(setCurrentTags).not.toHaveBeenCalled();
    });

    it('dado que tag ya existe, cuando se ejecuta handleAddTag, entonces marca como no agregando tag', () => {
      const { setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen } = setupMockSetStates();
      const currentTags = ['existing-tag'];

      handleAddTag('existing-tag', currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);

      expectSetStateCalledWith(setIsAddingTag, false);
    });

    it('dado que tag tiene espacios y mayúsculas, cuando se ejecuta handleAddTag, entonces normaliza tag correctamente', () => {
      const { setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen } = setupMockSetStates();
      const currentTags: string[] = [];

      handleAddTag('My New Tag', currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);

      expect(setCurrentTags).toHaveBeenCalledWith(['my-new-tag']);
    });

    it('dado que tag tiene espacios y mayúsculas, cuando se ejecuta handleAddTag, entonces marca como no agregando tag', () => {
      const { setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen } = setupMockSetStates();
      const currentTags: string[] = [];

      handleAddTag('My New Tag', currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);

      expectSetStateCalledWith(setIsAddingTag, false);
    });

    it('dado que closeMenu es false, cuando se ejecuta handleAddTag, entonces no cierra menú de sugerencias', () => {
      const { setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen } = setupMockSetStates();
      const currentTags: string[] = [];

      handleAddTag('new-tag', currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen, false);

      expect(setIsSuggestionMenuOpen).not.toHaveBeenCalled();
    });

    it('dado que tag está vacío, cuando se ejecuta handleAddTag, entonces procesa tag vacío', () => {
      const { setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen } = setupMockSetStates();
      const currentTags: string[] = [];

      handleAddTag('   ', currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);

      expect(setCurrentTags).toHaveBeenCalled();
    });

    it('dado que tag está vacío, cuando se ejecuta handleAddTag, entonces marca como no agregando tag', () => {
      const { setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen } = setupMockSetStates();
      const currentTags: string[] = [];

      handleAddTag('   ', currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);

      expectSetStateCalledWith(setIsAddingTag, false);
    });
  });

  describe('validateFile', () => {
    it('dado que archivo es válido, cuando se ejecuta validateFile, entonces retorna validación exitosa', async () => {
      const file = setupValidFile();
      setupValidImage();
      const options = { maxSizeMB: 5, maxWidth: 1920, maxHeight: 1080 };

      const result = await validateFile(file, options);

      expectValidationSuccess(result);
    });

    it('dado que archivo excede tamaño máximo, cuando se ejecuta validateFile, entonces retorna error de tamaño', async () => {
      const file = setupOversizedFile();
      const options = { maxSizeMB: 5, maxWidth: 1920, maxHeight: 1080 };

      const result = await validateFile(file, options);

      expectValidationFailure(result, 'El archivo supera el tamaño máximo permitido (5MB).');
    });

    it('dado que imagen excede dimensiones máximas, cuando se ejecuta validateFile, entonces retorna error de dimensiones', async () => {
      const file = setupValidFile();
      setupOversizedImage();
      const options = { maxSizeMB: 5, maxWidth: 1920, maxHeight: 1080 };

      const result = await validateFile(file, options);

      expectValidationFailure(result, 'Las dimensiones del archivo exceden el tamaño permitido (Máximo 1920x1080px).');
    });

    it('dado que archivo no es imagen válida, cuando se ejecuta validateFile, entonces retorna error de formato', async () => {
      const file = setupValidFile();
      setupInvalidImage();
      const options = { maxSizeMB: 5, maxWidth: 1920, maxHeight: 1080 };

      const result = await validateFile(file, options);

      expectValidationFailure(result, 'El archivo no es una imagen válida.');
    });

    it('dado que se valida archivo, cuando se ejecuta validateFile, entonces crea URL de objeto', async () => {
      const file = setupValidFile();
      setupValidImage();
      const options = { maxSizeMB: 5, maxWidth: 1920, maxHeight: 1080 };

      await validateFile(file, options);

      expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
    });
  });

  describe('createFormDataForWork', () => {
    it('dado que WorkDTO es válido, cuando se ejecuta createFormDataForWork, entonces crea FormData con work', () => {
      const workDTO = setupCreateWorkDTO();

      const formData = createFormDataForWork(workDTO);

      expectFormDataContains(formData, 'work', 'Blob');
    });

    it('dado que se incluye banner, cuando se ejecuta createFormDataForWork, entonces agrega banner a FormData', () => {
      const workDTO = setupCreateWorkDTO();
      const bannerFile = setupValidFile();
      const coverFile = setupValidFile();

      const formData = createFormDataForWork(workDTO, bannerFile, coverFile);

      expectFormDataContains(formData, 'banner', 'File');
    });

    it('dado que se incluye cover, cuando se ejecuta createFormDataForWork, entonces agrega cover a FormData', () => {
      const workDTO = setupCreateWorkDTO();
      const bannerFile = setupValidFile();
      const coverFile = setupValidFile();

      const formData = createFormDataForWork(workDTO, bannerFile, coverFile);

      expectFormDataContains(formData, 'cover', 'File');
    });

    it('dado que no se incluyen archivos, cuando se ejecuta createFormDataForWork, entonces no incluye banner', () => {
      const workDTO = setupCreateWorkDTO();

      const formData = createFormDataForWork(workDTO);

      expectFormDataNotContains(formData, 'banner');
    });

    it('dado que no se incluyen archivos, cuando se ejecuta createFormDataForWork, entonces no incluye cover', () => {
      const workDTO = setupCreateWorkDTO();

      const formData = createFormDataForWork(workDTO);

      expectFormDataNotContains(formData, 'cover');
    });

    it('dado que solo se incluye banner, cuando se ejecuta createFormDataForWork, entonces incluye banner', () => {
      const workDTO = setupCreateWorkDTO();
      const bannerFile = setupValidFile();

      const formData = createFormDataForWork(workDTO, bannerFile);

      expectFormDataContains(formData, 'banner', 'File');
    });

    it('dado que solo se incluye banner, cuando se ejecuta createFormDataForWork, entonces no incluye cover', () => {
      const workDTO = setupCreateWorkDTO();
      const bannerFile = setupValidFile();

      const formData = createFormDataForWork(workDTO, bannerFile);

      expectFormDataNotContains(formData, 'cover');
    });
  });

  describe('createFormDataForIa', () => {
    it('dado que CoverIaFormDTO es válido, cuando se ejecuta createFormDataForIa, entonces crea FormData correcto', () => {
      const formCoverDTO = setupCoverIaFormDTO();

      const formData = createFormDataForIa(formCoverDTO);

      expectFormDataContains(formData, 'coverIa', 'Blob');
    });

    it('dado que se crea FormData, cuando se ejecuta createFormDataForIa, entonces usa content-type JSON', () => {
      const formCoverDTO = setupCoverIaFormDTO();

      const formData = createFormDataForIa(formCoverDTO);

      const blob = formData.get('coverIa') as Blob;
      expect(blob.type).toBe('application/json');
    });
  });

  describe('useCreateWork', () => {
    it('dado que usuario tiene token, cuando se ejecuta useCreateWork, entonces configura mutación con autenticación', () => {
      setupAuthToken('valid-token');

      useCreateWork();

      expectApiMutationCalledWith('/create-work/save', 'POST', 'valid-token');
    });

    it('dado que usuario no tiene token, cuando se ejecuta useCreateWork, entonces configura mutación sin token', () => {
      setupAuthToken('');

      useCreateWork();

      expect(useApiMutation).toHaveBeenCalledWith({
        url: '/create-work/save',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '
        }
      });
    });
  });

  describe('useGenerateCover', () => {
    it('dado que usuario tiene token, cuando se ejecuta useGenerateCover, entonces configura mutación con autenticación', () => {
      setupAuthToken('valid-token');

      useGenerateCover();

      expectApiMutationCalledWith('/images/generate', 'POST', 'valid-token');
    });

    it('dado que usuario no tiene token, cuando se ejecuta useGenerateCover, entonces configura mutación sin token', () => {
      setupAuthToken('');

      useGenerateCover();

      expect(useApiMutation).toHaveBeenCalledWith({
        url: '/images/generate',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '
        }
      });
    });
  });

  describe('urlToFile', () => {
    it('dado que URL es válida, cuando se ejecuta urlToFile, entonces llama fetch con URL correcta', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      setupSuccessfulFetchResponse(mockBlob);

      await urlToFile('https://example.com/image.jpg', 'test.jpg', 'image/jpeg');

      expectFetchCalledWith('https://example.com/image.jpg');
    });

    it('dado que URL es válida, cuando se ejecuta urlToFile, entonces crea File con propiedades correctas', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      setupSuccessfulFetchResponse(mockBlob);

      const result = await urlToFile('https://example.com/image.jpg', 'test.jpg', 'image/jpeg');

      expectFileCreated(result, 'test.jpg', 'image/jpeg');
    });

    it('dado que fetch falla, cuando se ejecuta urlToFile, entonces lanza error', async () => {
      setupFailedFetchResponse();

      await expect(urlToFile('https://invalid-url.com/image.jpg', 'test.jpg', 'image/jpeg'))
        .rejects.toThrow('Failed to fetch');
    });

    it('dado que respuesta es exitosa, cuando se ejecuta urlToFile, entonces crea File con propiedades correctas', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      setupSuccessfulFetchResponse(mockBlob);

      const result = await urlToFile('https://example.com/image.jpg', 'custom-name.png', 'image/png');

      expectFileCreated(result, 'custom-name.png', 'image/png');
    });
  });

  describe('Casos edge complejos', () => {
    it('dado que archivo tiene tamaño exacto del límite, cuando se ejecuta validateFile, entonces valida correctamente', async () => {
      const file = setupMockFile('exact.jpg', 5 * 1024 * 1024, 'image/jpeg'); // Exactly 5MB
      setupValidImage();
      const options = { maxSizeMB: 5, maxWidth: 1920, maxHeight: 1080 };

      const result = await validateFile(file, options);

      expectValidationSuccess(result);
    });

    it('dado que imagen tiene dimensiones exactas del límite, cuando se ejecuta validateFile, entonces valida correctamente', async () => {
      const file = setupValidFile();
      setupMockImage(1920, 1080, true); 
      const options = { maxSizeMB: 5, maxWidth: 1920, maxHeight: 1080 };

      const result = await validateFile(file, options);

      expectValidationSuccess(result);
    });

    it('dado que tag tiene solo espacios y guiones, cuando se ejecuta handleAddTag, entonces normaliza correctamente', () => {
      const { setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen } = setupMockSetStates();
      const currentTags: string[] = [];

      handleAddTag('  My   Special   Tag  ', currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);

      expect(setCurrentTags).toHaveBeenCalledWith(['-my-special-tag-']);
    });
  });
});