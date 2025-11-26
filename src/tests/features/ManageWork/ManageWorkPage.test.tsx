import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ManageWorkPage } from '../../../app/features/ManageWork/ManageWorkPage';
import { useManageWorkData } from '../../../app/features/ManageWork/hooks/useManageWorkData';
import type { WorkDTO } from '../../../domain/dto/WorkDTO';

vi.mock('../../../app/features/ManageWork/hooks/useManageWorkData');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'test-id' }),
  };
});

vi.mock('../../../infrastructure/services/ArtisticStylesService', () => ({
  useArtisticStyles: () => ({ data: [], isLoading: false, error: null }),
}));

vi.mock('../../../infrastructure/services/ColorPaletteService', () => ({
  useColorPalettes: () => ({ data: [], isLoading: false, error: null }),
}));

vi.mock('../../../infrastructure/services/CompositionService', () => ({
  useCompositions: () => ({ data: [], isLoading: false, error: null }),
}));

const mockUseManageWorkData = vi.mocked(useManageWorkData);

function expectTextToBeInDocument(text: string) {
  expect(screen.getByText(text)).toBeInTheDocument();
}

function expectTextNotInDocument(text: string) {
  expect(screen.queryByText(text)).not.toBeInTheDocument();
}

function expectImageWithAlt(altText: string, src?: string) {
  const image = screen.getByAltText(altText);
  expect(image).toBeInTheDocument();
  if (src) {
    expect(image).toHaveAttribute('src', src);
  }
}

function expectButtonWithName(name: RegExp | string) {
  expect(screen.getByRole('button', { name })).toBeInTheDocument();
}

function expectCheckboxToBeChecked(name: RegExp | string) {
  const checkbox = screen.getByRole('checkbox', { name });
  expect(checkbox).toBeChecked();
}

function expectInputWithValue(value: string) {
  expect(screen.getByDisplayValue(value)).toBeInTheDocument();
}

function expectInputWithPlaceholder(placeholder: string, value?: string) {
  const input = screen.getByPlaceholderText(placeholder);
  expect(input).toBeInTheDocument();
  if (value !== undefined) {
    expect(input).toHaveValue(value);
  }
}

function expectFunctionToHaveBeenCalledTimes(mockFn: any, times: number) {
  expect(mockFn).toHaveBeenCalledTimes(times);
}

function clickButtonWithName(name: RegExp | string) {
  const button = screen.getByRole('button', { name });
  button.click();
}

describe('ManageWorkPage', () => {
  const createMockWork = (overrides?: Partial<WorkDTO>): WorkDTO => ({
    id: 1,
    title: 'Test Work',
    description: 'Test Description',
    cover: 'test-cover.jpg',
    banner: 'test-banner.jpg',
    state: 'InProgress',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    publicationDate: '2024-01-01T00:00:00Z',
    format: { id: 1, name: 'Novela' },
    originalLanguage: { id: 1, name: 'Español' },
    price: 0,
    likes: 0,
    creator: {
      id: 1,
      name: 'Test',
      surname: 'User',
      username: 'testuser',
      photo: '',
      money: 0
    },
    chapters: [],
    categories: [],
    tags: [],
    ...overrides
  });

  const defaultMockData = {
    work: createMockWork(),
    loading: false,
    error: null,
    selectedCategories: [],
    currentTags: [],
    isAddingTag: false,
    newTagText: '',
    isSuggestionMenuOpen: false,
    isCategoryMenuOpen: false,
    showIATooltip: false,
    suggestedTags: [],
    showBannerTooltip: false,
    bannerPreview: null,
    coverPreview: null,
    errorBanner: null,
    errorCover: null,
    pendingCoverFile: null,
    savingCover: false,
    price: '',
    workStatus: '' as const,
    allowSubscription: false,
    isLoadingTagSuggestion: false,
    tagSuggestions: [],
    allowComments: false,
    categories: [],
    isLoadingCategory: false,
    errorCategory: null,
    showCoverModal: false,
    showCoverModalAi: false,
    isAILoading: false,
    nameWork: '',
    descriptionF: '',
    isSaving: false,
    shortMessage: 'Tags con IA: tu descripción tiene menos de 20 caracteres.',
    aiSuggestionMessage: 'Sugerencias de la IA',
    isDescriptionValid: true,
    
    bannerInputRef: { current: null },
    coverInputRef: { current: null },
    suggestionMenuRef: { current: null },
    suggestionCategoryMenuRef: { current: null },
    
    setIsAddingTag: vi.fn(),
    setNewTagText: vi.fn(),
    setIsSuggestionMenuOpen: vi.fn(),
    setIsCategoryMenuOpen: vi.fn(),
    setShowIATooltip: vi.fn(),
    setShowBannerTooltip: vi.fn(),
    setPrice: vi.fn(),
    setWorkStatus: vi.fn(),
    setAllowSubscription: vi.fn(),
    setAllowComments: vi.fn(),
    setCurrentTags: vi.fn(),
    setShowCoverModal: vi.fn(),
    setShowCoverModalAi: vi.fn(),
    
    handleAddCategory: vi.fn(),
    unselectCategory: vi.fn(),
    handleFileChange: vi.fn(),
    handleSaveCover: vi.fn().mockResolvedValue(true),
    handleSaveCoverAI: vi.fn().mockResolvedValue(true),
    handleTagSubmit: vi.fn(),
    handleAISuggestion: vi.fn(),
    handleSuggestedTagClick: vi.fn(),
    handleCreateChapter: vi.fn(),
    handleSaveChanges: vi.fn(),
    handleBannerClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseManageWorkData.mockReturnValue(defaultMockData);
  });

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  const renderComponent = () => {
    const Wrapper = createWrapper();
    return render(
      <Wrapper>
        <ManageWorkPage />
      </Wrapper>
    );
  };

  describe('Renderizado básico', () => {
    it('debería renderizar título de obra cuando está cargada', () => {
      const mockWork = createMockWork({ title: 'Mi Obra Genial' });
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        work: mockWork,
      });

      renderComponent();

      expectTextToBeInDocument('Mi Obra Genial');
      expectTextToBeInDocument('Nombre de la obra:');
    });

    it('debería renderizar formato de obra', () => {
      const mockWork = createMockWork({
        format: { id: 2, name: 'Novela Gráfica' }
      });
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        work: mockWork,
      });

      renderComponent();

      expectTextToBeInDocument('Novela Gráfica');
    });

    it('debería renderizar idioma original de obra', () => {
      const mockWork = createMockWork({
        originalLanguage: { id: 1, name: 'Francés' }
      });
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        work: mockWork,
      });

      renderComponent();

      expectTextToBeInDocument('Francés');
    });

    it('debería renderizar etiqueta de formato', () => {
      mockUseManageWorkData.mockReturnValue(defaultMockData);

      renderComponent();

      expectTextToBeInDocument('Formato:');
    });

    it('debería renderizar etiqueta de idioma original', () => {
      mockUseManageWorkData.mockReturnValue(defaultMockData);

      renderComponent();

      expectTextToBeInDocument('Idioma Original:');
    });

    it('debería renderizar descripción de obra o texto de respaldo', () => {
      const mockWork = createMockWork({ description: '' });
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        work: mockWork,
      });

      renderComponent();

      expectTextToBeInDocument('Sin descripción...');
    });

    it('debería renderizar imagen de portada de obra', () => {
      const mockWork = createMockWork({ cover: 'https://example.com/cover.jpg' });
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        work: mockWork,
      });

      renderComponent();

      expectImageWithAlt('Test Work', 'https://example.com/cover.jpg');
    });

    it('debería renderizar botón editar banner', () => {
      mockUseManageWorkData.mockReturnValue(defaultMockData);

      renderComponent();

      expectButtonWithName(/editar banner/i);
    });

    it('debería renderizar botón editar portada', () => {
      mockUseManageWorkData.mockReturnValue(defaultMockData);

      renderComponent();

      expectButtonWithName(/editar portada/i);
    });

    it('debería renderizar botón agregar capítulo', () => {
      mockUseManageWorkData.mockReturnValue(defaultMockData);

      renderComponent();

      expectButtonWithName(/agregar capítulo/i);
    });

    it('debería renderizar botón guardar', () => {
      mockUseManageWorkData.mockReturnValue(defaultMockData);

      renderComponent();

      expectButtonWithName(/guardar/i);
    });
  });

  describe('Estados de carga y error', () => {
    it('debería mostrar mensaje de carga cuando loading es true', () => {
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        loading: true,
        work: null,
      });

      renderComponent();

      expectTextToBeInDocument('Cargando obra...');
    });

    it('debería ocultar contenido principal cuando está cargando', () => {
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        loading: true,
        work: null,
      });

      renderComponent();

      expectTextNotInDocument('Nombre de la obra:');
    });

    it('debería mostrar mensaje de error cuando hay un error', () => {
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        loading: false,
        work: null,
        error: 'Error al cargar el trabajo',
      });

      renderComponent();

      expectTextToBeInDocument('Error al cargar el trabajo');
    });

    it('debería ocultar contenido principal cuando hay error', () => {
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        loading: false,
        work: null,
        error: 'Error al cargar el trabajo',
      });

      renderComponent();

      expectTextNotInDocument('Nombre de la obra:');
    });

    it('debería mostrar estado de error cuando la obra es nula', () => {
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        loading: false,
        work: null,
        error: null,
      });

      renderComponent();

      expectTextToBeInDocument('Work not found');
    });

    it('debería mostrar error de banner cuando está presente', () => {
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        errorBanner: 'Error al subir el banner',
      });

      renderComponent();

      expectTextToBeInDocument('Error al subir el banner');
    });

    it('debería mostrar error de portada cuando está presente', () => {
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        errorCover: 'Error al subir la portada',
      });

      renderComponent();

      expectTextToBeInDocument('Error al subir la portada');
    });
  });

  describe('Interacciones UI simples', () => {
    it('debería llamar handleCreateChapter cuando se hace clic en botón agregar capítulo', async () => {
      const handleCreateChapterMock = vi.fn();
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        handleCreateChapter: handleCreateChapterMock,
      });

      renderComponent();
      clickButtonWithName(/agregar capítulo/i);

      expectFunctionToHaveBeenCalledTimes(handleCreateChapterMock, 1);
    });

    it('debería llamar handleSaveChanges cuando se hace clic en botón guardar', () => {
      const handleSaveChangesMock = vi.fn();
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        handleSaveChanges: handleSaveChangesMock,
      });

      renderComponent();
      clickButtonWithName(/guardar/i);

      expectFunctionToHaveBeenCalledTimes(handleSaveChangesMock, 1);
    });

    it('debería mostrar tooltip de banner al pasar el cursor', () => {
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        showBannerTooltip: true,
      });

      renderComponent();

      expectTextToBeInDocument('*Se admiten PNG, JPG, JPEG, WEBP de máximo 20mb. (Max 1345x256px).');
    });

    it('debería renderizar botón de sugerencia de IA', () => {
      mockUseManageWorkData.mockReturnValue(defaultMockData);

      renderComponent();

      expectImageWithAlt('Icono IA');
    });

    it('debería mostrar checkbox marcado cuando allowSubscription es true', () => {
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        allowSubscription: true,
      });

      renderComponent();

      expectCheckboxToBeChecked(/permitir suscripción a obra/i);
    });

    it('debería mostrar input de precio con valor cuando price tiene contenido y allowSubscription es true', () => {
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        allowSubscription: true,
        price: '9.99',
      });

      renderComponent();

      expectInputWithValue('9.99');
    });
  });

  describe('Modales de Cover y AI', () => {
    it('debería renderizar botón de editar portada', () => {
      mockUseManageWorkData.mockReturnValue(defaultMockData);

      renderComponent();

      expectButtonWithName(/editar portada/i);
    });

    it('debería renderizar sección de portada con imagen', () => {
      const mockWork = createMockWork({ cover: 'test-cover.jpg' });
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        work: mockWork,
      });

      renderComponent();

      expectButtonWithName(/editar portada/i);
    });

    it('debería renderizar sección de banner', () => {
      const mockWork = createMockWork({ banner: 'test-banner.jpg' });
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        work: mockWork,
      });

      renderComponent();

      expectButtonWithName(/editar banner/i);
    });

    it('debería renderizar área de selección de categorías', () => {
      mockUseManageWorkData.mockReturnValue(defaultMockData);

      renderComponent();

      expectTextToBeInDocument('Categorías:');
    });
  });

  describe('Gestión de tags y categorías', () => {
    it('debería renderizar primera categoría seleccionada', () => {
      const selectedCategories = [
        { id: 1, name: 'Fantasía' }
      ];
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        selectedCategories,
      });

      renderComponent();

      expectTextToBeInDocument('Fantasía');
    });

    it('debería renderizar segunda categoría seleccionada', () => {
      const selectedCategories = [
        { id: 1, name: 'Fantasía' },
        { id: 2, name: 'Romance' }
      ];
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        selectedCategories,
      });

      renderComponent();

      expectTextToBeInDocument('Romance');
    });

    it('debería renderizar primer tag actual', () => {
      const currentTags = ['aventura'];
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        currentTags,
      });

      renderComponent();

      expectTextToBeInDocument('aventura');
    });

    it('debería renderizar segundo tag actual', () => {
      const currentTags = ['aventura', 'magia'];
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        currentTags,
      });

      renderComponent();

      expectTextToBeInDocument('magia');
    });

    it('debería renderizar tercer tag actual', () => {
      const currentTags = ['aventura', 'magia', 'dragones'];
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        currentTags,
      });

      renderComponent();

      expectTextToBeInDocument('dragones');
    });

    it('debería mostrar input de tag cuando isAddingTag es true', () => {
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        isAddingTag: true,
        newTagText: 'nuevo tag',
      });

      renderComponent();

      expectInputWithPlaceholder('Enter para añadir etiqueta', 'nuevo tag');
    });

    it('debería mostrar mensaje de validación cuando no hay categorías', () => {
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        selectedCategories: [],
      });

      renderComponent();

      expectTextToBeInDocument('Selecciona al menos una categoría.');
    });

    it('debería mostrar mensaje de validación cuando no hay tags', () => {
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        currentTags: [],
      });

      renderComponent();

      expectTextToBeInDocument('Debes agregar al menos una etiqueta.');
    });

    it('debería renderizar capítulos cuando la obra tiene capítulos', () => {
      const mockWork = createMockWork({
        chapters: [
          { 
            id: 1, 
            title: 'Capítulo 1', 
            description: 'Descripción cap 1', 
            price: 0, 
            likes: 0, 
            lastModified: '2024-01-01', 
            publishedAt: '2024-01-01',
            publicationStatus: 'PUBLISHED' as const 
          },
          { 
            id: 2, 
            title: 'Capítulo 2', 
            description: 'Descripción cap 2', 
            price: 0, 
            likes: 0, 
            lastModified: '2024-01-01', 
            publicationStatus: 'DRAFT' as const 
          }
        ]
      });
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        work: mockWork,
      });

      renderComponent();

      expectTextToBeInDocument('Capítulos');
    });
  });
});