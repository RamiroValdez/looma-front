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

  const expectLoadingMessage = () => {
    expect(screen.getByRole("status")).toBeInTheDocument();
};

  const expectErrorMessage = () => {
    expect(screen.getByText('No se pudo cargar el capítulo.')).toBeInTheDocument();
  };

  const expectChapterTitle = (title: string) => {
    expect(screen.getByText(title)).toBeInTheDocument();
  };

  const expectTextViewer = () => {
    expect(screen.getByTestId('text-viewer')).toBeInTheDocument();
  };

  const expectContent = (content: string) => {
    expect(screen.getByText(content)).toBeInTheDocument();
  };

  const expectNavigationCall = (path: string) => {
    expect(mockNavigate).toHaveBeenCalledWith(path);
  };

  const expectButtonDisabled = (buttonName: string) => {
    const button = screen.getByRole('button', { name: new RegExp(buttonName, 'i') });
    expect(button).toBeDisabled();
  };

  const expectElementNotInDocument = (testId: string) => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  };

  const expectElementInDocument = (testId: string) => {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  };

  const expectTranslatingMessage = () => {
    expect(screen.getByText('Traduciendo contenido...')).toBeInTheDocument();
  };

  const expectChapterCount = (count: number) => {
    const chaptersContainer = getChaptersContainer();
    expect(within(chaptersContainer!).getAllByText(/capítulo \d+/i)).toHaveLength(count);
  };

  const expectCurrentChapterStyle = (chapterNumber: number) => {
    const chaptersContainer = getChaptersContainer();
    const allChapter = within(chaptersContainer!).getAllByText(`Capítulo ${chapterNumber}`);
    const chapterContainer = allChapter.find(el => el.closest('.bg-gray-300'));
    expect(chapterContainer?.closest('.bg-gray-300')).toBeInTheDocument();
  };

  const expectLockIcon = (chapterNumber: number) => {
    const chapterRow = getChapterInSidebar(chapterNumber);
    const lockIcon = chapterRow.querySelector('svg path[d*="M144 144v48"]');
    expect(lockIcon).toBeInTheDocument();
  };

  const expectFunctionCall = (mockFn: any, ...args: any[]) => {
    if (args.length === 0) {
      expect(mockFn).toHaveBeenCalledTimes(1);
    } else {
      expect(mockFn).toHaveBeenCalledWith(...args);
    }
  };

  const expectModalTitle = (title: string) => {
    expect(screen.getByText(title)).toBeInTheDocument();
  };

  const expectModalSubtitle = (subtitle: string) => {
    expect(screen.getByText(subtitle)).toBeInTheDocument();
  };

  const expectLikeButtonState = (action: string, fill: string, stroke?: string) => {
    const allLikeButtons = screen.getAllByLabelText(`${action} like`);
    const likeButton = allLikeButtons[0];
    const svg = likeButton.querySelector('svg');
    expect(svg).toHaveAttribute('fill', fill);
    if (stroke) {
      expect(svg).toHaveAttribute('stroke', stroke);
    }
  };

  const expectSubscribeButton = (text: string, disabled: boolean = false) => {
    const button = screen.getByRole('button', { name: new RegExp(text, 'i') });
    expect(button).toBeInTheDocument();
    if (disabled) {
      expect(button).toBeDisabled();
    }
  };

  const expectNoSubscribeButton = () => {
    expect(screen.queryByRole('button', { name: /suscribir/i })).not.toBeInTheDocument();
  };

  const expectNoSubscribedButton = () => {
    expect(screen.queryByRole('button', { name: /suscrito/i })).not.toBeInTheDocument();
  };

  const expectWorkTitle = (title: string) => {
    const sidebar = getChaptersContainer()?.parentElement;
    expect(within(sidebar!).getByText(title)).toBeInTheDocument();
  };

  const expectImageStyle = (element: HTMLElement, imageUrl: string) => {
    expect(element).toHaveStyle({ backgroundImage: `url("${imageUrl}")` });
  };

  const expectImageSource = (altText: string, src: string) => {
    const img = screen.getByAltText(altText);
    expect(img).toHaveAttribute('src', src);
  };

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

  vi.mock('../../../app/features/WorkDetail/components/SubscriptionModal', () => ({
  default: ({ isOpen }: any) => isOpen ? (
    <div>
      <h2>Suscribirse a la Obra</h2>
      <p>Selecciona un método de pago</p>
    </div>
  ) : null,
}));

vi.mock('../../../app/features/WorkDetail/components/ChapterPurchaseModal', () => ({
  default: ({ isOpen }: any) => isOpen ? (
    <div>
      <h2>Adquirir Capítulo</h2>
      <p>Selecciona un método de pago</p>
    </div>
  ) : null,
}));

vi.mock('../../../app/components/LikeButton', () => ({
  default: ({
    chapterId,
    onClick,
    disabled,
    type,
    liked,
    count,
  }: any) => (
    <button
      aria-label={
        type === 'chapter'
          ? liked
            ? 'Quitar like'
            : 'Agregar like'
          : 'Agregar like'
      }
      disabled={disabled}
      onClick={() => !disabled && onClick && onClick(chapterId)}
    >
      <svg
        fill={liked ? '#c026d3' : 'none'}
        stroke="#c026d3"
        data-testid="like-svg"
      />
      <span>{count}</span>
    </button>
  ),
}));

  describe('Renderizado y Estados de Carga', () => {
    it('dado que está cargando, cuando se renderiza, entonces muestra mensaje de carga', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isLoading: true, chapterData: null })
      );

      renderComponent();

      expectLoadingMessage();
    });

    it('dado que hay error de datos, cuando se renderiza, entonces muestra mensaje de error', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isLoading: false, chapterData: null })
      );

      renderComponent();

      expectErrorMessage();
    });

    it('dado que hay datos disponibles, cuando se renderiza, entonces muestra el contenido completo', () => {
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent();

      expectChapterTitle('Capítulo de Prueba');
      expectTextViewer();
      expectContent('Contenido del capítulo');
      expect(screen.getAllByText(/capítulo/i).length).toBeGreaterThan(0);
    });
  });

  describe('Navegación', () => {
    it('dado que se hace click en volver, cuando se ejecuta, entonces navega a la obra', async () => {
      const user = userEvent.setup();
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent();

      const backButton = screen.getByRole('button', { name: /volver/i });
      await user.click(backButton);

      expectNavigationCall('/work/100');
    });

    it('dado que se hace click en capítulo anterior, cuando se ejecuta, entonces navega al previo', async () => {
      const user = userEvent.setup();
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent('2');

      const prevButton = screen.getByRole('button', { name: /capítulo anterior/i });
      await user.click(prevButton);

      expectNavigationCall('/work/chapter/1/read');
    });

    it('dado que se hace click en capítulo siguiente, cuando se ejecuta, entonces navega al siguiente', async () => {
      const user = userEvent.setup();
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent('2');

      const nextButton = screen.getByRole('button', { name: /capítulo siguiente/i });
      await user.click(nextButton);

      expectNavigationCall('/work/chapter/3/read');
    });

    it('dado que está en primer capítulo, cuando se renderiza, entonces botón anterior está deshabilitado', () => {
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent('1');

      expectButtonDisabled('capítulo anterior');
    });

    it('dado que está en último capítulo, cuando se renderiza, entonces botón siguiente está deshabilitado', () => {
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent('3');

      expectButtonDisabled('capítulo siguiente');
    });

    it('dado que está en fullscreen, cuando se renderiza, entonces botón volver no se muestra', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isFullScreen: true })
      );

      renderComponent();

      expect(screen.queryByRole('button', { name: /volver/i })).not.toBeInTheDocument();
    });
  });

  describe('Fullscreen y Footer', () => {
    it('dado que está en fullscreen y showFooter es false, cuando se renderiza, entonces footer no se muestra', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isFullScreen: true, showFooter: false })
      );

      renderComponent();

      expectElementNotInDocument('footer-lector');
    });

    it('dado que está en fullscreen y showFooter es true, cuando se renderiza, entonces footer se muestra', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isFullScreen: true, showFooter: true })
      );

      renderComponent();

      expectElementInDocument('footer-lector');
    });

    it('dado que se hace click en toggle fullscreen, cuando se ejecuta, entonces llama a toggleFullScreen', async () => {
      const user = userEvent.setup();
      const toggleFullScreen = vi.fn();
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ toggleFullScreen })
      );

      renderComponent();

      const toggleButton = screen.getByTestId('toggle-fullscreen');
      await user.click(toggleButton);

      expectFunctionCall(toggleFullScreen);
    });

    it('dado que no está en fullscreen, cuando se renderiza, entonces footer siempre se muestra', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isFullScreen: false })
      );

      renderComponent();

      expectElementInDocument('footer-lector');
    });
  });

  describe('Traducción de Contenido', () => {
    it('dado que está traduciendo, cuando se renderiza, entonces muestra mensaje de traducción', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isTranslating: true })
      );

      renderComponent();

      expectTranslatingMessage();
      expectElementNotInDocument('text-viewer');
    });

    it('dado que no está traduciendo, cuando se renderiza, entonces muestra contenido traducido', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({
          isTranslating: false,
          translatedContent: 'Contenido traducido al inglés',
        })
      );

      renderComponent();

      expectTextViewer();
      expectContent('Contenido traducido al inglés');
    });

    it('dado que se cambia idioma, cuando se hace click, entonces llama a handleLanguageChange', async () => {
      const user = userEvent.setup();
      const handleLanguageChange = vi.fn();
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ handleLanguageChange })
      );

      renderComponent();

      const changeLanguageButton = screen.getByTestId('language-change');
      await user.click(changeLanguageButton);

      expectFunctionCall(handleLanguageChange, 'en');
    });
  });

  describe('Lista de Capítulos (Sidebar)', () => {
    it('dado que hay capítulos, cuando se renderiza, entonces muestra lista ordenada', () => {
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent();

      expectChapterCount(3);
    });

    it('dado que está en capítulo específico, cuando se renderiza, entonces tiene estilo diferente', () => {
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent('2');

      expectCurrentChapterStyle(2);
    });

    it('dado que hay capítulos bloqueados, cuando se renderiza, entonces muestra ícono de candado', () => {
      const isChapterUnlocked = vi.fn((id: number) => id !== 3);
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isChapterUnlocked })
      );

      renderComponent();

      expectLockIcon(3);
    });

    it('dado que se hace click en capítulo desbloqueado, cuando se ejecuta, entonces llama a handleChapterClick', async () => {
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

    it('dado que se hace click en capítulo bloqueado, cuando se ejecuta, entonces abre modal de pago', async () => {
      const user = userEvent.setup();
      const isChapterUnlocked = vi.fn((id: number) => id !== 3);
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isChapterUnlocked })
      );

      renderComponent('1');

      const chapter3 = getChapterInSidebar(3);
      await user.click(chapter3);

      expectModalTitle('Adquirir Capítulo');
      expectModalSubtitle('Selecciona un método de pago');
    });

    it('dado que está en fullscreen, cuando se renderiza, entonces sidebar no se muestra', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isFullScreen: true })
      );

      renderComponent();

      expect(screen.queryByText('Capítulos')).not.toBeInTheDocument();
    });
  });

  describe('Sistema de Likes', () => {
    it('dado que no está liked, cuando se renderiza, entonces muestra corazón vacío', () => {
mockUseReadChapterData.mockReturnValue(
  createMockHookReturn({
    localLikes: { 1: 15, 2: 25 },
    chapters: [
      { id: 1, chapterNumber: 1, title: 'Cap 1', publicationStatus: 'PUBLISHED', likes: 10 },
      { id: 2, chapterNumber: 2, title: 'Cap 2', publicationStatus: 'PUBLISHED', likes: 20 },
    ],
  })
);

      renderComponent('1');

      expectLikeButtonState('Agregar', 'none', '#c026d3');
    });

    it('dado que el capítulo está bloqueado, cuando se renderiza, entonces like está deshabilitado', () => {
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


  describe('Suscripción a la Obra', () => {
    it('dado que se hace click en suscribir, cuando se ejecuta, entonces abre modal de suscripción', async () => {
      const user = userEvent.setup();
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isAuthor: false })
      );

      renderComponent();

      const subscribeButton = screen.getByRole('button', { name: /suscribir/i });
      await user.click(subscribeButton);

      expectModalTitle('Suscribirse a la Obra');
      expectModalSubtitle('Selecciona un método de pago');
    });

    it('dado que está suscrito a la obra, cuando se renderiza, entonces muestra botón suscrito deshabilitado', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isWorkSubscribed: true, isAuthor: false })
      );

      renderComponent();

      expectSubscribeButton('suscrito', true);
    });

    it('dado que está suscrito al autor, cuando se renderiza, entonces muestra botón suscrito deshabilitado', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isAuthorSubscribed: true, isAuthor: false })
      );

      renderComponent();

      expectSubscribeButton('suscrito', true);
    });

    it('dado que está procesando pago, cuando se renderiza, entonces botón está deshabilitado', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isPaying: true, isAuthor: false })
      );

      renderComponent();

      expectButtonDisabled('suscribir');
    });

    it('dado que es el autor, cuando se renderiza, entonces no muestra botones de suscripción', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({ isAuthor: true })
      );

      renderComponent();

      expectNoSubscribeButton();
      expectNoSubscribedButton();
    });
  });

  describe('Información de la Obra (Sidebar)', () => {
    it('dado que hay imágenes personalizadas, cuando se renderiza, entonces muestra banner y portada específicos', () => {
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
      
      expectImageStyle(bannerDiv, '/img/custom-banner.jpg');
      expectImageSource('Obra de Prueba', '/img/custom-cover.jpg');
    });

    it('dado que hay título de obra, cuando se renderiza, entonces muestra título correcto', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({
          work: createMockWork({ title: 'Mi Obra Fantástica' }),
        })
      );

      renderComponent();

      expectWorkTitle('Mi Obra Fantástica');
    });

    it('dado que no hay título de obra, cuando se renderiza, entonces usa título de chapterData', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({
          work: createMockWork({ title: undefined as any }),
          chapterData: createMockChapterData({ workName: 'Título desde Chapter' }),
        })
      );

      renderComponent();

      expectWorkTitle('Título desde Chapter');
    });

    it('dado que no hay imágenes personalizadas, cuando se renderiza, entonces usa imágenes por defecto', () => {
      mockUseReadChapterData.mockReturnValue(
        createMockHookReturn({
          work: createMockWork({ banner: undefined, cover: undefined }),
        })
      );

      renderComponent();

      const sidebar = screen.getByText('Capítulos').closest('aside');
      const bannerDiv = sidebar!.querySelector('.bg-cover.bg-center') as HTMLElement;

      expectImageStyle(bannerDiv, '/img/portadas/banner1.jpg');
      expectImageSource('Obra de Prueba', '/img/portadas/banner1.jpg');
    });
  });

  describe('Integración con el Hook', () => {
    it('dado que hay chapterId en params, cuando se renderiza, entonces usa useReadChapterData con ID correcto', () => {
      mockUseReadChapterData.mockReturnValue(createMockHookReturn());

      renderComponent('42');

      expectFunctionCall(mockUseReadChapterData, '42');
    });

    it('dado que no hay chapterId en params, cuando se renderiza, entonces usa useReadChapterData con string vacío', () => {
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

      expectFunctionCall(mockUseReadChapterData, '');
    });
  });
})})
