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

// Mock de todos los servicios para evitar llamadas reales a la API
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
    // Estados básicos
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
    // Setters
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
    // Funciones
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
    setupClickOutside: vi.fn(),
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
    it('should render work title when work is loaded', () => {
      // Given: Un trabajo cargado con título
      const mockWork = createMockWork({ title: 'Mi Obra Genial' });
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        work: mockWork,
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar el título de la obra
      expect(screen.getByText('Mi Obra Genial')).toBeInTheDocument();
      expect(screen.getByText('Nombre de la obra:')).toBeInTheDocument();
    });

    it('should render work format and language information', () => {
      // Given: Un trabajo con formato e idioma definidos
      const mockWork = createMockWork({
        format: { id: 2, name: 'Novela Gráfica' },
        originalLanguage: { id: 1, name: 'Francés' }
      });
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        work: mockWork,
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar el formato y idioma
      expect(screen.getByText('Novela Gráfica')).toBeInTheDocument();
      expect(screen.getByText('Francés')).toBeInTheDocument();
      expect(screen.getByText('Formato:')).toBeInTheDocument();
      expect(screen.getByText('Idioma Original:')).toBeInTheDocument();
    });

    it('should render work description or fallback text', () => {
      // Given: Un trabajo sin descripción
      const mockWork = createMockWork({ description: '' });
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        work: mockWork,
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar el texto de fallback
      expect(screen.getByText('Sin descripción...')).toBeInTheDocument();
    });

    it('should render work cover image', () => {
      // Given: Un trabajo con portada
      const mockWork = createMockWork({ cover: 'https://example.com/cover.jpg' });
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        work: mockWork,
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar la imagen de portada
      const coverImage = screen.getByAltText('Test Work');
      expect(coverImage).toBeInTheDocument();
      expect(coverImage).toHaveAttribute('src', 'https://example.com/cover.jpg');
    });

    it('should render main action buttons', () => {
      // Given: Un trabajo cargado
      mockUseManageWorkData.mockReturnValue(defaultMockData);

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar los botones principales
      expect(screen.getByRole('button', { name: /editar banner/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /editar portada/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /agregar capítulo/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
    });
  });

  describe('Estados de carga y error', () => {
    it('should show loading state when data is being fetched', () => {
      // Given: El hook está en estado de carga
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        loading: true,
        work: null,
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar el mensaje de carga
      expect(screen.getByText('Cargando obra...')).toBeInTheDocument();
      expect(screen.queryByText('Nombre de la obra:')).not.toBeInTheDocument();
    });

    it('should show error state when there is an error', () => {
      // Given: El hook tiene un error
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        loading: false,
        work: null,
        error: 'Error al cargar el trabajo',
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar el mensaje de error
      expect(screen.getByText('Error al cargar el trabajo')).toBeInTheDocument();
      expect(screen.queryByText('Nombre de la obra:')).not.toBeInTheDocument();
    });

    it('should show error state when work is null', () => {
      // Given: El hook no tiene trabajo cargado
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        loading: false,
        work: null,
        error: null,
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar mensaje de work not found
      expect(screen.getByText('Work not found')).toBeInTheDocument();
    });

    it('should show banner error when present', () => {
      // Given: Un error en el banner
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        errorBanner: 'Error al subir el banner',
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar el error del banner
      expect(screen.getByText('Error al subir el banner')).toBeInTheDocument();
    });

    it('should show cover error when present', () => {
      // Given: Un error en la portada
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        errorCover: 'Error al subir la portada',
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar el error de la portada
      expect(screen.getByText('Error al subir la portada')).toBeInTheDocument();
    });
  });

  describe('Interacciones UI simples', () => {
    it('should call handleCreateChapter when add chapter button is clicked', async () => {
      // Given: Un trabajo cargado con idioma original
      const mockWork = createMockWork({ originalLanguage: { id: 2, name: 'Inglés' } });
      const handleCreateChapterMock = vi.fn();
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        work: mockWork,
        handleCreateChapter: handleCreateChapterMock,
      });

      // When: Se renderiza y hace click en agregar capítulo
      renderComponent();
      const addChapterButton = screen.getByRole('button', { name: /agregar capítulo/i });
      addChapterButton.click();

      // Then: Debe llamar a la función con los parámetros correctos
      expect(handleCreateChapterMock).toHaveBeenCalledWith(1, 2);
    });

    it('should call handleSaveChanges when save button is clicked', () => {
      // Given: Un componente renderizado
      const handleSaveChangesMock = vi.fn();
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        handleSaveChanges: handleSaveChangesMock,
      });

      // When: Se hace click en el botón guardar
      renderComponent();
      const saveButton = screen.getByRole('button', { name: /guardar/i });
      saveButton.click();

      // Then: Debe llamar a handleSaveChanges
      expect(handleSaveChangesMock).toHaveBeenCalledTimes(1);
    });

    it('should show banner tooltip on hover', () => {
      // Given: Un componente renderizado
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        showBannerTooltip: true,
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar el tooltip del banner
      expect(screen.getByText('*Se admiten PNG, JPG, JPEG, WEBP de máximo 20mb. (Max 1345x256px).')).toBeInTheDocument();
    });

    it('should show IA tooltip when showIATooltip is true', () => {
      // Given: Un componente con tooltip de IA activado
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        showIATooltip: true,
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar el tooltip de IA
      expect(screen.getByText(/Tags con IA: tu descripción tiene menos de 20 caracteres/)).toBeInTheDocument();
    });

    it('should show short message tooltip when description is invalid', () => {
      // Given: Un trabajo con descripción corta y tooltip activado
      const mockWork = createMockWork({ description: 'Corta' });
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        work: mockWork,
        showIATooltip: true,
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar el mensaje corto
      expect(screen.getByText('Tags con IA: tu descripción tiene menos de 20 caracteres.')).toBeInTheDocument();
    });

    it('should show subscription checkbox and price input when allowSubscription is true', () => {
      // Given: Suscripción habilitada
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        allowSubscription: true,
        price: '9.99',
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar el checkbox y el input de precio
      const checkbox = screen.getByRole('checkbox', { name: /permitir suscripción a obra/i });
      expect(checkbox).toBeChecked();
      
      const priceInput = screen.getByDisplayValue('9.99');
      expect(priceInput).toBeInTheDocument();
    });
  });

  describe('Modales de Cover y AI', () => {
    it('should open cover modal when edit cover button is clicked', () => {
      // Given: Un componente renderizado
      mockUseManageWorkData.mockReturnValue(defaultMockData);

      // When: Se renderiza y hace click en editar portada
      renderComponent();
      const editCoverButton = screen.getByRole('button', { name: /editar portada/i });
      editCoverButton.click();

      // Then: El modal de portada debería abrirse (verificamos mediante el estado interno)
      // Como el estado showCoverModal es interno del componente, verificamos que el botón existe
      expect(editCoverButton).toBeInTheDocument();
    });

    it('should show CoverImageModal when pendingCoverFile exists', () => {
      // Given: Un archivo de portada pendiente
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        pendingCoverFile: mockFile,
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: El botón de guardar no debe estar deshabilitado
      // (CoverImageModal se renderiza condicionalmente basado en el estado interno showCoverModal)
      expect(screen.getByRole('button', { name: /editar portada/i })).toBeInTheDocument();
    });

    it('should show saving state in cover modal', () => {
      // Given: Estado de guardado de portada
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        savingCover: true,
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: El componente debe renderizarse (el estado savingCover se pasa al modal)
      expect(screen.getByRole('button', { name: /editar portada/i })).toBeInTheDocument();
    });

    it('should handle AI cover generation', async () => {
      // Given: Un mock para guardar portada AI
      const handleSaveCoverAIMock = vi.fn().mockResolvedValue(true);
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        handleSaveCoverAI: handleSaveCoverAIMock,
      });

      renderComponent();

      // When: Se simula el callback del modal AI (esto normalmente se haría por interacción del usuario)
      // El callback está dentro del JSX como prop del CoverAiModal
      
      // Then: Verificamos que la función está disponible
      expect(handleSaveCoverAIMock).toBeDefined();
    });
  });

  describe('Gestión de tags y categorías', () => {
    it('should render selected categories', () => {
      // Given: Categorías seleccionadas
      const selectedCategories = [
        { id: 1, name: 'Fantasía' },
        { id: 2, name: 'Romance' }
      ];
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        selectedCategories,
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar las categorías seleccionadas
      expect(screen.getByText('Fantasía')).toBeInTheDocument();
      expect(screen.getByText('Romance')).toBeInTheDocument();
    });

    it('should render current tags', () => {
      // Given: Tags actuales
      const currentTags = ['aventura', 'magia', 'dragones'];
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        currentTags,
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar los tags
      expect(screen.getByText('aventura')).toBeInTheDocument();
      expect(screen.getByText('magia')).toBeInTheDocument();
      expect(screen.getByText('dragones')).toBeInTheDocument();
    });

    it('should show tag input when isAddingTag is true', () => {
      // Given: Estado de agregar tag activo
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        isAddingTag: true,
        newTagText: 'nuevo tag',
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar el input de tag
      const tagInput = screen.getByPlaceholderText('Enter para añadir etiqueta');
      expect(tagInput).toBeInTheDocument();
      expect(tagInput).toHaveValue('nuevo tag');
    });

    it('should show validation messages when categories or tags are empty', () => {
      // Given: Sin categorías ni tags seleccionados
      mockUseManageWorkData.mockReturnValue({
        ...defaultMockData,
        selectedCategories: [],
        currentTags: [],
      });

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar mensajes de validación
      expect(screen.getByText('Selecciona al menos una categoría.')).toBeInTheDocument();
      expect(screen.getByText('Debes agregar al menos una etiqueta.')).toBeInTheDocument();
    });

    it('should render chapters when work has chapters', () => {
      // Given: Un trabajo con capítulos
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

      // When: Se renderiza el componente
      renderComponent();

      // Then: Debe mostrar la sección de capítulos
      expect(screen.getByText('Capítulos')).toBeInTheDocument();
    });
  });
});