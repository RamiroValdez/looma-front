/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ReadChapterNovel from '../../../app/features/WorkDetail/ReadChapterNovel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockUseReadChapterData = vi.fn();
vi.mock('../../../app/features/WorkDetail/hooks/useReadChapterData', () => ({
  useReadChapterData: (chapterId: string) => mockUseReadChapterData(chapterId),
}));

vi.mock('../../../app/components/FooterLector', () => ({
  default: ({ onLanguageChange, onToggleFullScreen, isFullScreen }: any) => (
    <div data-testid="footer-lector">
      <button data-testid="language-change" onClick={() => onLanguageChange('en')}>
        Change Language
      </button>
      <button data-testid="toggle-fullscreen" onClick={onToggleFullScreen}>
        {isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      </button>
    </div>
  ),
}));

vi.mock('../../../app/features/Chapter/TextViewer', () => ({
  default: ({ content }: any) => <div data-testid="text-viewer">{content}</div>,
}));

vi.mock('@milkdown/react', () => ({
  MilkdownProvider: ({ children }: any) => <div data-testid="milkdown-provider">{children}</div>,
}));

const createMockChapterData = (overrides = {}) => ({
  id: 1,
  title: 'Capítulo de Prueba',
  content: 'Contenido del capítulo',
  chapterNumber: 1,
  workId: 100,
  workName: 'Obra de Prueba',
  languageDefaultCode: { code: 'es' },
  publicationStatus: 'PUBLISHED',
  likes: 10,
  ...overrides,
});

const createMockWork = (overrides = {}) => ({
  id: 100,
  title: 'Obra de Prueba',
  banner: '/img/portadas/banner1.jpg',
  cover: '/img/portadas/cover1.jpg',
  ...overrides,
});

const createMockChapters = () => [
  { id: 1, chapterNumber: 1, title: 'Cap 1', publicationStatus: 'PUBLISHED', likes: 10 },
  { id: 2, chapterNumber: 2, title: 'Cap 2', publicationStatus: 'PUBLISHED', likes: 20 },
  { id: 3, chapterNumber: 3, title: 'Cap 3', publicationStatus: 'PUBLISHED', likes: 30 },
];

const createMockHookReturn = (overrides = {}) => ({
  chapterData: createMockChapterData(),
  work: createMockWork(),
  chapters: createMockChapters(),
  translatedContent: 'Contenido del capítulo',
  isTranslating: false,
  sortedLanguages: [
    { id: 1, name: 'Español', code: 'es' },
    { id: 2, name: 'Inglés', code: 'en' },
  ],
  liked: {},
  localLikes: {},
  isFullScreen: false,
  showFooter: false,
  isPaying: false,
  isLoading: false,
  isAuthor: false,
  isWorkSubscribed: false,
  isAuthorSubscribed: false,
  toggleFullScreen: vi.fn(),
  toggleLike: vi.fn(),
  handleChapterClick: vi.fn(),
  handleLanguageChange: vi.fn(),
  handleSubscribeWork: vi.fn(),
  handleChapterPayment: vi.fn(),
  isChapterUnlocked: vi.fn(() => true),
  ...overrides,
});

describe('ReadChapterNovel', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
  });

  const renderComponent = (chapterId = '1') => {
    return render(
      <MemoryRouter initialEntries={[`/work/chapter/${chapterId}/read`]}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/work/chapter/:chapterId/read" element={<ReadChapterNovel />} />
          </Routes>
        </QueryClientProvider>
      </MemoryRouter>
    );
  };

  const getChaptersContainer = () => {
    return screen.getByText('Capítulos').parentElement;
  };

  const getChapterInSidebar = (chapterNumber: number) => {
    const chaptersContainer = getChaptersContainer();
    const allChapters = within(chaptersContainer!).getAllByText(`Capítulo ${chapterNumber}`);
    return allChapters[0].closest('div') as HTMLElement;
  };

  describe('Renderizado y Estados de Carga', () => {
    it('muestra mensaje "Cargando capítulo..." cuando isLoading es true', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isLoading: true, chapterData: null })
      );

      renderComponent();

      expect(screen.getByText('Cargando capítulo...')).toBeInTheDocument();
    });

    it('muestra mensaje de error cuando chapterData es null', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isLoading: false, chapterData: null })
      );

      renderComponent();

      expect(screen.getByText('No se pudo cargar el capítulo.')).toBeInTheDocument();
    });

    it('renderiza correctamente el contenido del capítulo cuando los datos están disponibles', () => {
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent();

      expect(screen.getByText('Capítulo de Prueba')).toBeInTheDocument();
      expect(screen.getByTestId('text-viewer')).toBeInTheDocument();
      expect(screen.getByText('Contenido del capítulo')).toBeInTheDocument();
      expect(screen.getAllByText(/capítulo/i).length).toBeGreaterThan(0);
    });
  });

  describe('Navegación', () => {
    it('el botón "Volver" navega a /work/{workId} correctamente', async () => {
      const user = userEvent.setup();
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent();

      const backButton = screen.getByRole('button', { name: /volver/i });
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/work/100');
    });

    it('el botón "Capítulo anterior" navega al capítulo previo publicado', async () => {
      const user = userEvent.setup();
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent('2');

      const prevButton = screen.getByRole('button', { name: /capítulo anterior/i });
      await user.click(prevButton);

      expect(mockNavigate).toHaveBeenCalledWith('/work/chapter/1/read');
    });

    it('el botón "Capítulo siguiente" navega al capítulo siguiente publicado', async () => {
      const user = userEvent.setup();
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent('2');

      const nextButton = screen.getByRole('button', { name: /capítulo siguiente/i });
      await user.click(nextButton);

      expect(mockNavigate).toHaveBeenCalledWith('/work/chapter/3/read');
    });

    it('el botón "Capítulo anterior" está deshabilitado en el primer capítulo', () => {
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent('1');

      const prevButton = screen.getByRole('button', { name: /capítulo anterior/i });
      expect(prevButton).toBeDisabled();
    });

    it('el botón "Capítulo siguiente" está deshabilitado en el último capítulo', () => {
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent('3');

      const nextButton = screen.getByRole('button', { name: /capítulo siguiente/i });
      expect(nextButton).toBeDisabled();
    });

    it('el botón "Volver" NO se muestra en modo fullscreen', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isFullScreen: true })
      );

      renderComponent();

      expect(screen.queryByRole('button', { name: /volver/i })).not.toBeInTheDocument();
    });
  });

  describe('Fullscreen y Footer', () => {
    it('el footer NO se muestra en modo fullscreen cuando showFooter es false', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isFullScreen: true, showFooter: false })
      );

      renderComponent();

      expect(screen.queryByTestId('footer-lector')).not.toBeInTheDocument();
    });

    it('el footer se muestra en modo fullscreen cuando showFooter es true', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isFullScreen: true, showFooter: true })
      );

      renderComponent();

      expect(screen.getByTestId('footer-lector')).toBeInTheDocument();
    });

    it('toggleFullScreen es llamado al hacer click en el botón del footer', async () => {
      const user = userEvent.setup();
      const toggleFullScreen = vi.fn();
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ toggleFullScreen })
      );

      renderComponent();

      const toggleButton = screen.getByTestId('toggle-fullscreen');
      await user.click(toggleButton);

      expect(toggleFullScreen).toHaveBeenCalledTimes(1);
    });

    it('el footer siempre se muestra cuando NO está en fullscreen', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isFullScreen: false })
      );

      renderComponent();

      expect(screen.getByTestId('footer-lector')).toBeInTheDocument();
    });
  });

  describe('Traducción de Contenido', () => {
    it('muestra "Traduciendo contenido..." cuando isTranslating es true', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isTranslating: true })
      );

      renderComponent();

      expect(screen.getByText('Traduciendo contenido...')).toBeInTheDocument();
      expect(screen.queryByTestId('text-viewer')).not.toBeInTheDocument();
    });

    it('renderiza TextViewer con el contenido traducido cuando no está traduciendo', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({
          isTranslating: false,
          translatedContent: 'Contenido traducido al inglés',
        })
      );

      renderComponent();

      expect(screen.getByTestId('text-viewer')).toBeInTheDocument();
      expect(screen.getByText('Contenido traducido al inglés')).toBeInTheDocument();
    });

    it('handleLanguageChange es llamado al cambiar el idioma en el footer', async () => {
      const user = userEvent.setup();
      const handleLanguageChange = vi.fn();
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ handleLanguageChange })
      );

      renderComponent();

      const changeLanguageButton = screen.getByTestId('language-change');
      await user.click(changeLanguageButton);

      expect(handleLanguageChange).toHaveBeenCalledWith('en');
    });
  });

  describe('Lista de Capítulos (Sidebar)', () => {
    it('renderiza la lista de capítulos publicados ordenados', () => {
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent();

      const sidebar = getChaptersContainer();
      expect(within(sidebar!).getAllByText(/capítulo \d+/i)).toHaveLength(3);
    });

    it('el capítulo actual tiene estilo diferente (bg-gray-300)', () => {
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent('2');

      const chaptersContainer = getChaptersContainer();
      const allChapter2 = within(chaptersContainer!).getAllByText('Capítulo 2');
      const chapter2Container = allChapter2.find(el => el.closest('.bg-gray-300'));

      expect(chapter2Container?.closest('.bg-gray-300')).toBeInTheDocument();
    });

    it('los capítulos bloqueados muestran el ícono de candado', () => {
      const isChapterUnlocked = vi.fn((id: number) => id !== 3);
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isChapterUnlocked })
      );

      renderComponent();

      const chapter3Row = getChapterInSidebar(3);
      const lockIcon = chapter3Row.querySelector('svg path[d*="M144 144v48"]');
      
      expect(lockIcon).toBeInTheDocument();
    });

    it('click en capítulo desbloqueado llama a handleChapterClick', async () => {
      const user = userEvent.setup();
      const handleChapterClick = vi.fn();
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ handleChapterClick })
      );

      renderComponent('1');

      const chapter2 = getChapterInSidebar(2);
      await user.click(chapter2);

      expect(handleChapterClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: 2, chapterNumber: 2 })
      );
    });

    it('click en capítulo bloqueado llama a handleChapterPayment', async () => {
      const user = userEvent.setup();
      const handleChapterPayment = vi.fn();
      const isChapterUnlocked = vi.fn((id: number) => id !== 3);
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ handleChapterPayment, isChapterUnlocked })
      );

      renderComponent('1');

      const chapter3 = getChapterInSidebar(3);
      await user.click(chapter3);

      expect(handleChapterPayment).toHaveBeenCalledWith(3);
    });

    it('el sidebar NO se muestra en modo fullscreen', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isFullScreen: true })
      );

      renderComponent();

      expect(screen.queryByText('Capítulos')).not.toBeInTheDocument();
    });
  });

  describe('Sistema de Likes', () => {
    it('el botón de like muestra el ícono de corazón vacío cuando no está liked', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ liked: { 1: false } })
      );

      renderComponent('1');

      const allLikeButtons = screen.getAllByLabelText('Agregar like');
      const likeButton = allLikeButtons[0];
      const svg = likeButton.querySelector('svg');

      expect(svg).toHaveAttribute('fill', 'none');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });

    it('el botón de like muestra el ícono de corazón lleno cuando está liked', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ liked: { 1: true } })
      );

      renderComponent('1');

      const likeButton = screen.getByLabelText('Quitar like');
      const svg = likeButton.querySelector('svg');

      expect(svg).toHaveAttribute('fill', 'currentColor');
    });

    it('click en like de capítulo desbloqueado llama a toggleLike', async () => {
      const user = userEvent.setup();
      const toggleLike = vi.fn();
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ toggleLike, liked: { 1: false } })
      );

      renderComponent('1');

      const allLikeButtons = screen.getAllByLabelText('Agregar like');
      const likeButton = allLikeButtons[0];

      await user.click(likeButton);

      expect(toggleLike).toHaveBeenCalledWith(1);
    });

    it('el like está deshabilitado para capítulos bloqueados', () => {
      const isChapterUnlocked = vi.fn((id: number) => id !== 3);
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isChapterUnlocked })
      );

      renderComponent('1');

      const chaptersContainer = getChaptersContainer();
      const allChapter3 = within(chaptersContainer!).getAllByText('Capítulo 3');
      const chapter3Row = allChapter3[0].closest('.p-4') as HTMLElement;
      const likeButton = within(chapter3Row!).getByLabelText(/like/i);

      expect(likeButton).toBeDisabled();
    });

    it('muestra el contador de likes correctamente usando localLikes', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({
          localLikes: { 1: 15, 2: 25 },
        })
      );

      renderComponent('1');

      const chaptersContainer = getChaptersContainer();
      
      expect(within(chaptersContainer!).getByText('15')).toBeInTheDocument();
      expect(within(chaptersContainer!).getByText('25')).toBeInTheDocument();
    });
  });

  describe('Suscripción a la Obra', () => {
    it('el botón "Suscribir" llama a handleSubscribeWork', async () => {
      const user = userEvent.setup();
      const handleSubscribeWork = vi.fn();
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ handleSubscribeWork, isAuthor: false })
      );

      renderComponent();

      const subscribeButton = screen.getByRole('button', { name: /suscribir/i });
      await user.click(subscribeButton);

      expect(handleSubscribeWork).toHaveBeenCalledTimes(1);
    });

    it('el botón muestra "Suscrito" cuando isWorkSubscribed es true', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isWorkSubscribed: true, isAuthor: false })
      );

      renderComponent();

      const subscribeButton = screen.getByRole('button', { name: /suscrito/i });
      expect(subscribeButton).toBeInTheDocument();
      expect(subscribeButton).toBeDisabled();
    });

    it('el botón muestra "Suscrito" cuando isAuthorSubscribed es true', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isAuthorSubscribed: true, isAuthor: false })
      );

      renderComponent();

      const subscribeButton = screen.getByRole('button', { name: /suscrito/i });
      expect(subscribeButton).toBeInTheDocument();
      expect(subscribeButton).toBeDisabled();
    });

    it('el botón está deshabilitado cuando isPaying es true', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isPaying: true, isAuthor: false })
      );

      renderComponent();

      const subscribeButton = screen.getByRole('button', { name: /suscribir/i });
      expect(subscribeButton).toBeDisabled();
    });

    it('los botones de suscripción NO se muestran si isAuthor es true', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isAuthor: true })
      );

      renderComponent();

      expect(screen.queryByRole('button', { name: /suscribir/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /suscrito/i })).not.toBeInTheDocument();
    });
  });

  describe('Información de la Obra (Sidebar)', () => {
    it('muestra el banner y portada de la obra', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({
          work: createMockWork({
            banner: '/img/custom-banner.jpg',
            cover: '/img/custom-cover.jpg',
          }),
        })
      );

      renderComponent();

      const sidebar = screen.getByText('Capítulos').closest('aside');
      const bannerDiv = sidebar!.querySelector('.bg-cover.bg-center') as HTMLElement;
      const cover = screen.getByAltText('Obra de Prueba');

      expect(bannerDiv).toHaveStyle({ backgroundImage: 'url("/img/custom-banner.jpg")' });
      expect(cover).toHaveAttribute('src', '/img/custom-cover.jpg');
    });

    it('muestra el título de la obra', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({
          work: createMockWork({ title: 'Mi Obra Fantástica' }),
        })
      );

      renderComponent();

      const sidebar = getChaptersContainer()?.parentElement;
      expect(within(sidebar!).getByText('Mi Obra Fantástica')).toBeInTheDocument();
    });

    it('usa el título del chapterData como fallback si no hay work.title', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({
          work: createMockWork({ title: undefined as any }),
          chapterData: createMockChapterData({ workName: 'Título desde Chapter' }),
        })
      );

      renderComponent();

      const sidebar = getChaptersContainer()?.parentElement;
      expect(within(sidebar!).getByText('Título desde Chapter')).toBeInTheDocument();
    });

    it('usa imágenes por defecto si no hay banner/cover', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({
          work: createMockWork({ banner: undefined, cover: undefined }),
        })
      );

      renderComponent();

      const sidebar = screen.getByText('Capítulos').closest('aside');
      const bannerDiv = sidebar!.querySelector('.bg-cover.bg-center') as HTMLElement;
      const cover = screen.getByAltText('Obra de Prueba');

      expect(bannerDiv).toHaveStyle({ backgroundImage: 'url("/img/portadas/banner1.jpg")' });
      expect(cover).toHaveAttribute('src', '/img/portadas/banner1.jpg');
    });
  });

  describe('Integración con el Hook', () => {
    it('usa correctamente useReadChapterData con el chapterId de los params', () => {
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent('42');

      expect(mockUseReadChapterData).toHaveBeenCalledWith('42');
    });

    it('maneja correctamente cuando no hay chapterId en los params', () => {
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      render(
        <MemoryRouter initialEntries={['/work/chapter/read']}>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/work/chapter/read" element={<ReadChapterNovel />} />
            </Routes>
          </QueryClientProvider>
        </MemoryRouter>
      );

      expect(mockUseReadChapterData).toHaveBeenCalledWith('');
    });
  });
});
