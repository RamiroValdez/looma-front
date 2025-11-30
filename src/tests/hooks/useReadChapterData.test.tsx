import { renderHook, act, waitFor } from "@testing-library/react";
import { useReadChapterData } from "../../app/features/WorkDetail/hooks/useReadChapterData";
import { vi } from "vitest";

vi.mock("../../infrastructure/services/ChapterService", () => ({
  getChapterById: vi.fn().mockReturnValue({
    data: {
      id: 1,
      title: "Capítulo de prueba",
      content: "Contenido del capítulo",
      chapterNumber: 1,
      workId: 1,
      workName: "Obra de prueba",
      languageDefaultCode: { code: "es", name: "Español" },
      allowAiTranslation: true,
    },
    isLoading: false,
    error: null,
  }),
  fetchChapterContent: vi.fn().mockResolvedValue({
    id: 1,
    title: 'Capítulo de prueba',
    content: 'Contenido existente en inglés',
    chapterNumber: 1,
    workId: '1',
    workName: 'Obra de prueba',
    languageDefaultCode: { code: 'es', name: 'Español' },
    availableLanguages: [{ code: 'en', name: 'English' }],
    allowAiTranslation: true,
    price: 0, last_update: '', likes: 0, publicationStatus: 'PUBLISHED', scheduledPublicationDate: '', publishedAt: '', isLiked: false
  })
}));

vi.mock("../../infrastructure/services/WorkService", () => ({
  WorkService: {
    getWorkById: vi.fn().mockResolvedValue({
      id: 1,
      title: "Obra de prueba",
      banner: "/banner.jpg",
      cover: "/cover.jpg",
      creator: { id: 2, name: "Autor", surname: "Test" },
      chapters: [
        { id: 1, title: "Cap 1", likes: 10, publicationStatus: "PUBLISHED", price: 0 },
        { id: 2, title: "Cap 2", likes: 5, publicationStatus: "PUBLISHED", price: 10 },
      ],
      subscribedToWork: false,
      subscribedToAuthor: false,
      unlockedChapters: [],
      originalLanguage: { name: "Español" },
    }),
  },
}));

vi.mock("../../infrastructure/services/LanguageService", () => ({
  useLanguages: vi.fn().mockReturnValue({
    languages: [
      { code: "es", name: "Español" },
      { code: "en", name: "English" },
    ],
  }),
}));

vi.mock("../../infrastructure/services/TranslateService", () => ({
  translateContent: vi.fn().mockResolvedValue("Contenido traducido"),
}));

vi.mock("../../infrastructure/services/paymentService", () => ({
  subscribeToWork: vi.fn().mockResolvedValue({
    fetchStatus: 200,
    redirectUrl: "https://mercadopago.com/checkout"
  }),
  subscribeToChapter: vi.fn().mockResolvedValue({
    fetchStatus: 200,
    redirectUrl: "https://mercadopago.com/checkout"
  }),
}));

vi.mock("../../infrastructure/services/ToastProviderService", () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
}));

vi.mock("../../infrastructure/store/UserStorage", () => ({
  useUserStore: vi.fn().mockReturnValue({
    user: { userId: 2, name: "Usuario Test" },
  }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../../infrastructure/services/MySavesService", () => ({
  IsWorkSaved: vi.fn().mockResolvedValue(false),
}));

import * as ChapterService from "../../infrastructure/services/ChapterService";
import { WorkService } from "../../infrastructure/services/WorkService";
import { translateContent } from "../../infrastructure/services/TranslateService";
import { subscribeToWork, subscribeToChapter } from "../../infrastructure/services/paymentService";
import { notifyError, notifySuccess } from "../../infrastructure/services/ToastProviderService";
import { useUserStore } from "../../infrastructure/store/UserStorage";

const setupWindowOpenMock = () => {
  const mockWindowInstance = { closed: false, location: { href: "" }, close: vi.fn() };
  const mockOpen = vi.fn().mockReturnValue(mockWindowInstance);
  window.open = mockOpen as any;
  return mockOpen;
};

const expectChapterDataDefined = (result: any) => {
  expect(result.current.chapterData).toBeDefined();
};

const expectChapterTitle = (result: any, title: string) => {
  expect(result.current.chapterData?.title).toBe(title);
};

const expectTranslatedContent = (result: any, content: string) => {
  expect(result.current.translatedContent).toBe(content);
};

const expectWorkServiceCalled = (workId: number) => {
  expect(WorkService.getWorkById).toHaveBeenCalledWith(workId);
};

const expectWorkDefined = (result: any) => {
  expect(result.current.work).toBeDefined();
};

const expectWorkTitle = (result: any, title: string) => {
  expect(result.current.work?.title).toBe(title);
};

const expectChaptersLength = (result: any, length: number) => {
  expect(result.current.chapters).toHaveLength(length);
};

const expectLocalLikes = (result: any, chapterId: number, likes: number) => {
  expect(result.current.localLikes[chapterId]).toBe(likes);
};

const expectNavigationCalled = (mockNavigate: any, route: number) => {
  expect(mockNavigate).toHaveBeenCalledWith(route);
};

const expectErrorNotification = (message: string) => {
  expect(notifyError).toHaveBeenCalledWith(message);
};

const expectTranslateServiceCalled = (from: string, to: string, content: string) => {
  expect(translateContent).toHaveBeenCalledWith(from, to, content);
};

const expectTranslateNotCalled = () => {
  expect(translateContent).not.toHaveBeenCalled();
};

const expectCurrentLanguage = (result: any, language: string) => {
  expect(result.current.currentLanguage).toBe(language);
};

const expectLikedStatus = (result: any, chapterId: number, liked: boolean) => {
  expect(result.current.liked[chapterId]).toBe(liked);
};

const expectFullscreenStatus = (result: any, isFullscreen: boolean) => {
  expect(result.current.isFullScreen).toBe(isFullscreen);
};

const expectFullscreenMethodCalled = (mockMethod: any) => {
  expect(mockMethod).toHaveBeenCalled();
};

const expectSuccessNotification = (message: string) => {
  expect(notifySuccess).toHaveBeenCalledWith(message);
};

const expectPayingStatus = (result: any, isPaying: boolean) => {
  expect(result.current.isPaying).toBe(isPaying);
};

const expectServiceCallCount = (service: any, count: number) => {
  expect(service).toHaveBeenCalledTimes(count);
};

const expectChapterServiceCalled = (chapterId: number, method: string) => {
  expect(subscribeToChapter).toHaveBeenCalledWith(chapterId, 1, method);
};

const expectAuthorStatus = (result: any, isAuthor: boolean) => {
  expect(result.current.isAuthor).toBe(isAuthor);
};

const expectChapterUnlocked = (result: any, chapterId: number, unlocked: boolean) => {
  expect(result.current.isChapterUnlocked(chapterId)).toBe(unlocked);
};

const expectWorkSubscribedToWork = (result: any, subscribed: boolean) => {
  expect(result.current.work?.subscribedToWork).toBe(subscribed);
};

const expectWorkSubscribedToAuthor = (result: any, subscribed: boolean) => {
  expect(result.current.work?.subscribedToAuthor).toBe(subscribed);
};

const expectUnlockedChapters = (result: any, chapters: number[]) => {
  expect(result.current.work?.unlockedChapters).toEqual(chapters);
};

const expectNavigationCallCount = (mockNavigate: any, count: number) => {
  expect(mockNavigate).toHaveBeenCalledTimes(count);
};

const expectChaptersDefined = (result: any) => {
  expect(result.current.chapters).toBeDefined();
};

const expectSortedLanguagesDefined = (result: any) => {
  expect(result.current.sortedLanguages).toBeDefined();
};

const expectFirstLanguageName = (result: any, name: string) => {
  expect(result.current.sortedLanguages[0].name).toBe(name);
};

const expectFirstLanguageCode = (result: any, code: string) => {
  expect(result.current.sortedLanguages[0].code).toBe(code);
};

const expectFetchChapterServiceCalled = (chapterId: number, language: string) => {
  expect(ChapterService.fetchChapterContent).toHaveBeenCalledWith(chapterId, language);
};

const expectFetchChapterCallCount = (count: number) => {
  expect(ChapterService.fetchChapterContent).toHaveBeenCalledTimes(count);
};

const expectWorkId = (result: any, id: number) => {
  expect(result.current.work?.id).toBe(id);
};

const setupFullscreenMocks = () => {
  const mockRequestFullscreen = vi.fn().mockResolvedValue(undefined);
  const mockExitFullscreen = vi.fn().mockResolvedValue(undefined);

  Object.defineProperty(document.documentElement, "requestFullscreen", {
    value: mockRequestFullscreen,
    writable: true,
  });
  Object.defineProperty(document, "exitFullscreen", {
    value: mockExitFullscreen,
    writable: true,
  });

  return { mockRequestFullscreen, mockExitFullscreen };
};

const createMockWork = (overrides = {}) => ({
  id: 1,
  title: "Obra de prueba",
  banner: "/banner.jpg",
  cover: "/cover.jpg",
  creator: { id: 2, name: "Autor", surname: "Test" },
  chapters: [
    { id: 1, title: "Cap 1", likes: 10, publicationStatus: "PUBLISHED", price: 5 },
    { id: 2, title: "Cap 2", likes: 5, publicationStatus: "PUBLISHED", price: 10 },
  ],
  subscribedToWork: false,
  subscribedToAuthor: false,
  unlockedChapters: [],
  originalLanguage: { name: "Español" },
  ...overrides,
});

const setupUserMock = (userId: number) => {
  const mockUser = { userId, name: "Usuario Test" };
  vi.mocked(useUserStore).mockClear();
  vi.mocked(useUserStore).mockReset();
  (useUserStore as any).mockReturnValue({
    user: mockUser,
  } as any);
};

const setupDefaultMocks = () => {
};

const setupWorkMock = (workData?: any) => {
  const defaultWork = createMockWork();
  const mergedWork = { ...defaultWork, ...workData };
  vi.mocked(WorkService.getWorkById).mockResolvedValue(mergedWork);
};

describe("useReadChapterData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultMocks();

    (ChapterService.getChapterById as any).mockReturnValue({
      data: {
        id: 1,
        title: "Capítulo de prueba",
        content: "Contenido del capítulo",
        chapterNumber: 1,
        workId: 1,
        workName: "Obra de prueba",
        languageDefaultCode: { code: "es", name: "Español" },
      },
      isLoading: false,
      error: null,
    } as any);

    (WorkService.getWorkById as any).mockResolvedValue(createMockWork() as any);

    (translateContent as any).mockResolvedValue("Contenido traducido");

    (subscribeToWork as any).mockResolvedValue({
      fetchStatus: 200,
      redirectUrl: "https://mercadopago.com/checkout"
    });

    (subscribeToChapter as any).mockResolvedValue({
      fetchStatus: 200,
      redirectUrl: "https://mercadopago.com/checkout"
    });

    (useUserStore as any).mockReturnValue({
      user: { userId: 2, name: "Usuario Test" },
    } as any);
  });

  describe("Carga de datos", () => {
    it("dado que se proporciona ID de capítulo, cuando se inicializa el hook, entonces define los datos del capítulo", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectChapterDataDefined(result);
      });
    });

    it("dado que se proporciona ID de capítulo, cuando se inicializa el hook, entonces carga el título correcto", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectChapterTitle(result, "Capítulo de prueba");
      });
    });

    it("dado que se proporciona ID de capítulo, cuando se inicializa el hook, entonces carga el contenido traducido", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectTranslatedContent(result, "Contenido del capítulo");
      });
    });

    it("dado que se proporciona ID de capítulo, cuando se inicializa el hook, entonces llama al servicio de obra", async () => {
      renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkServiceCalled(1);
      });
    });

    it("dado que se proporciona ID de capítulo, cuando se inicializa el hook, entonces define los datos de la obra", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
      });
    });

    it("dado que se proporciona ID de capítulo, cuando se inicializa el hook, entonces carga el título de la obra", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkTitle(result, "Obra de prueba");
      });
    });

    it("dado que se proporciona ID de capítulo, cuando se inicializa el hook, entonces carga la lista de capítulos", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectChaptersLength(result, 2);
      });
    });

    it("dado que hay capítulos con likes, cuando se inicializa el hook, entonces inicializa likes del primer capítulo", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectLocalLikes(result, 1, 10);
      });
    });

    it("dado que hay capítulos con likes, cuando se inicializa el hook, entonces inicializa likes del segundo capítulo", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectLocalLikes(result, 2, 5);
      });
    });
  });

  describe("Manejo de errores", () => {
    it("dado que hay error 403, cuando se inicializa el hook, entonces navega hacia atrás", async () => {
      const mockNavigate = vi.fn();
      vi.mocked(ChapterService.getChapterById).mockReturnValueOnce({
        data: undefined,
        isLoading: false,
        error: { response: { status: 403 } },
      } as any);

      const useNavigateMock = await import("react-router-dom");
      vi.spyOn(useNavigateMock, "useNavigate").mockReturnValue(mockNavigate);

      renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectNavigationCalled(mockNavigate, -1);
      });
    });

    it("dado que falla la carga de obra, cuando se inicializa el hook, entonces muestra mensaje de error", async () => {
      vi.mocked(ChapterService.getChapterById).mockReturnValue({
        data: {
          id: 1,
          title: "Capítulo de prueba",
          content: "Contenido del capítulo",
          chapterNumber: 1,
          workId: 1,
          workName: "Obra de prueba",
          languageDefaultCode: { code: "es", name: "Español" },
        },
        isLoading: false,
        error: null,
      } as any);

      vi.mocked(WorkService.getWorkById).mockRejectedValueOnce(new Error("Error de red"));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectChapterDataDefined(result);
      });

      await waitFor(() => {
        expectErrorNotification('No se pudo cargar información de la obra.');
      }, { timeout: 3000 });
    });
  });

  describe("Traducción de contenido", () => {
    it("dado que se cambia a idioma diferente, cuando se ejecuta handleLanguageChange, entonces llama al servicio de traducción", async () => {
      vi.mocked(ChapterService.fetchChapterContent).mockRejectedValueOnce(new Error("Content not found"));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectChapterDataDefined(result);
      });

      await act(async () => {
        await result.current.handleLanguageChange("en");
      });

      expectTranslateServiceCalled("es", "en", "Contenido del capítulo");
    });

    it("dado que se cambia a idioma diferente, cuando se ejecuta handleLanguageChange, entonces actualiza el contenido traducido", async () => {
      vi.mocked(ChapterService.fetchChapterContent).mockRejectedValueOnce(new Error("Content not found"));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectChapterDataDefined(result);
      });

      await act(async () => {
        await result.current.handleLanguageChange("en");
      });

      expectTranslatedContent(result, "Contenido traducido");
    });

    it("dado que se cambia a idioma diferente, cuando se ejecuta handleLanguageChange, entonces actualiza el idioma actual", async () => {
      vi.mocked(ChapterService.fetchChapterContent).mockRejectedValueOnce(new Error("Content not found"));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectChapterDataDefined(result);
      });

      await act(async () => {
        await result.current.handleLanguageChange("en");
      });

      expectCurrentLanguage(result, "en");
    });

    it("dado que se selecciona el mismo idioma, cuando se ejecuta handleLanguageChange, entonces no traduce", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectCurrentLanguage(result, "es");
      });

      await act(async () => {
        await result.current.handleLanguageChange("es");
      });

      expectTranslateNotCalled();
    });

    it("dado que falla la traducción, cuando se ejecuta handleLanguageChange, entonces muestra mensaje de error", async () => {
      vi.mocked(ChapterService.fetchChapterContent).mockRejectedValueOnce(new Error("Content not found"));
      (translateContent as any).mockRejectedValueOnce(new Error("Error de traducción"));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectChapterDataDefined(result);
      });

      await act(async () => {
        await result.current.handleLanguageChange("en");
      });

      expectErrorNotification("No se pudo traducir el contenido.");
    });
  });

  describe("Toggle de likes", () => {
    it("dado que capítulo no tiene like, cuando se ejecuta toggleLike, entonces verifica estado inicial sin like", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectLocalLikes(result, 1, 10);
      });
    });

    it("dado que capítulo no tiene like, cuando se ejecuta toggleLike, entonces cambia estado a liked", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectLocalLikes(result, 1, 10);
      });

      act(() => {
        result.current.toggleLike(1);
      });

      expectLikedStatus(result, 1, true);
    });

    it("dado que capítulo no tiene like, cuando se ejecuta toggleLike, entonces incrementa contador de likes", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectLocalLikes(result, 1, 10);
      });

      act(() => {
        result.current.toggleLike(1);
      });

      expectLocalLikes(result, 1, 11);
    });

    it("dado que capítulo tiene like, cuando se ejecuta toggleLike dos veces, entonces cambia estado a no liked", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectLocalLikes(result, 1, 10);
      });

      act(() => {
        result.current.toggleLike(1);
      });

      act(() => {
        result.current.toggleLike(1);
      });

      expectLikedStatus(result, 1, false);
    });

    it("dado que capítulo tiene like, cuando se ejecuta toggleLike dos veces, entonces restaura contador de likes", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectLocalLikes(result, 1, 10);
      });

      act(() => {
        result.current.toggleLike(1);
      });

      act(() => {
        result.current.toggleLike(1);
      });

      expectLocalLikes(result, 1, 10);
    });
  });

  describe("Fullscreen", () => {
    it("dado que no está en fullscreen, cuando se ejecuta toggleFullScreen, entonces llama al método requestFullscreen", async () => {
      const { mockRequestFullscreen } = setupFullscreenMocks();

      const { result } = renderHook(() => useReadChapterData("1"));

      await act(async () => {
        await result.current.toggleFullScreen();
      });

      expectFullscreenMethodCalled(mockRequestFullscreen);
    });

    it("dado que no está en fullscreen, cuando se ejecuta toggleFullScreen, entonces actualiza el estado a fullscreen", async () => {
      setupFullscreenMocks();

      const { result } = renderHook(() => useReadChapterData("1"));

      await act(async () => {
        await result.current.toggleFullScreen();
      });

      expectFullscreenStatus(result, true);
    });

    it("dado que está en fullscreen, cuando se ejecuta toggleFullScreen, entonces desactiva el modo fullscreen", async () => {
      const { mockExitFullscreen } = setupFullscreenMocks();

      const { result } = renderHook(() => useReadChapterData("1"));

      await act(async () => {
        await result.current.toggleFullScreen();
      });

      Object.defineProperty(document, "fullscreenElement", {
        value: {},
        writable: true,
      });

      await act(async () => {
        await result.current.toggleFullScreen();
      });

      expectFullscreenMethodCalled(mockExitFullscreen);
    });
  });

  describe("Suscripción a obra", () => {
    beforeEach(() => {
      vi.mocked(subscribeToWork).mockResolvedValue({
        fetchStatus: 200,
        redirectUrl: "https://mercadopago.com/checkout"
      });
      vi.mocked(subscribeToChapter).mockResolvedValue({
        fetchStatus: 200,
        redirectUrl: "https://mercadopago.com/checkout"
      });
    });

    it("dado que obra está cargada, cuando se ejecuta handleSubscribeWork, entonces verifica que la obra esté definida", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
      });
    });

    it("dado que obra está cargada, cuando se ejecuta handleSubscribeWork, entonces muestra notificación de éxito", async () => {
      setupWindowOpenMock();
      setupWorkMock();

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectWorkId(result, 1);
      });

      await act(async () => {
        await result.current.handleSubscribeWork();
      });

      expectSuccessNotification("Redirigiendo a MercadoPago...");
    });

    it("dado que está procesando pago, cuando se ejecuta handleSubscribeWork nuevamente, entonces no permite suscribirse", async () => {
      setupWindowOpenMock();

      vi.mocked(subscribeToWork).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({
          fetchStatus: 200,
          redirectUrl: "https://mercadopago.com/checkout"
        }), 200))
      );

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkId(result, 1);
      });
      act(() => {
        result.current.handleSubscribeWork();
      });

      await waitFor(() => {
        expectPayingStatus(result, true);
      }, { timeout: 100 });

      act(() => {
        result.current.handleSubscribeWork();
      });

      await waitFor(() => {
        expectPayingStatus(result, false);
      }, { timeout: 3000 });

      expectServiceCallCount(subscribeToWork, 1);
    });

    it("dado que falla la suscripción, cuando se ejecuta handleSubscribeWork, entonces maneja errores de suscripción", async () => {
      setupWorkMock();
      setupWindowOpenMock();

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
      });

      await waitFor(() => {
        expectWorkId(result, 1);
      });

      vi.mocked(subscribeToWork).mockRejectedValueOnce(new Error("Error de pago"));

      await act(async () => {
        await result.current.handleSubscribeWork();
      });

      await waitFor(() => {
        expectErrorNotification("Error de pago");
      });
    });
  });

  describe("Pago de capítulo", () => {
    beforeEach(() => {
      vi.mocked(subscribeToChapter).mockResolvedValue({
        fetchStatus: 200,
        redirectUrl: "https://mercadopago.com/checkout"
      });
    });


    it("dado que obra está cargada, cuando se ejecuta handleChapterPayment, entonces llama al servicio de pago con parámetros correctos", async () => {
      setupWorkMock();
      setupWindowOpenMock();

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectWorkId(result, 1);
      });

      await act(async () => {
        await result.current.handleChapterPayment(2);
      });

      expectChapterServiceCalled(2, "mercadopago");
    });

    it("dado que obra está cargada, cuando se ejecuta handleChapterPayment, entonces muestra notificación de éxito", async () => {
      setupWindowOpenMock();
      setupWorkMock();

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectWorkId(result, 1);
      });

      await act(async () => {
        await result.current.handleChapterPayment(2);
      });

      expectSuccessNotification("Redirigiendo a MercadoPago...");
    });

    it("dado que falla el pago de capítulo, cuando se ejecuta handleChapterPayment, entonces maneja errores de pago de capítulo", async () => {
      setupWindowOpenMock();

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectWorkId(result, 1);
      });

      vi.mocked(subscribeToChapter).mockRejectedValueOnce(new Error("Error de pago"));

      await act(async () => {
        await result.current.handleChapterPayment(2);
      });

      await waitFor(() => {
        expectErrorNotification("Error de pago");
      });
    });
  });

  describe("Lógica de isChapterUnlocked", () => {
    it("dado que usuario es el autor, cuando se verifica isChapterUnlocked, entonces identifica correctamente el estado de autor", async () => {
      setupUserMock(1);
      setupWorkMock(createMockWork({ creator: { id: 1, name: "Autor", surname: "Test" } }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectAuthorStatus(result, true);
      });
    });

    it("dado que usuario es el autor, cuando se verifica isChapterUnlocked, entonces desbloquea capítulo 1", async () => {
      setupUserMock(1);
      setupWorkMock(createMockWork({ creator: { id: 1, name: "Autor", surname: "Test" } }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectAuthorStatus(result, true);
      });

      expectChapterUnlocked(result, 1, true);
    });

    it("dado que usuario es el autor, cuando se verifica isChapterUnlocked, entonces desbloquea capítulo 2", async () => {
      setupUserMock(2);
      setupWorkMock(createMockWork({ creator: { id: 2, name: "Autor", surname: "Test" } }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectAuthorStatus(result, true);
      });

      expectChapterUnlocked(result, 2, true);
    });

    it("dado que usuario está suscrito a la obra, cuando se verifica isChapterUnlocked, entonces verifica suscripción a obra", async () => {
      setupUserMock(2);
      setupWorkMock(createMockWork({
        subscribedToWork: true,
        subscribedToAuthor: false,
      }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectWorkSubscribedToWork(result, true);
      });
    });

    it("dado que usuario está suscrito a la obra, cuando se verifica isChapterUnlocked, entonces desbloquea capítulo 1", async () => {
      setupUserMock(2);
      setupWorkMock(createMockWork({
        subscribedToWork: true,
        subscribedToAuthor: false,
      }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectChapterUnlocked(result, 1, true);
      });
    });

    it("dado que usuario está suscrito a la obra, cuando se verifica isChapterUnlocked, entonces desbloquea capítulo 2", async () => {
      setupUserMock(2);
      setupWorkMock(createMockWork({
        subscribedToWork: true,
        subscribedToAuthor: false,
      }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectChapterUnlocked(result, 2, true);
      });
    });

    it("dado que usuario está suscrito al autor, cuando se verifica isChapterUnlocked, entonces verifica suscripción al autor", async () => {
      setupUserMock(2);
      setupWorkMock(createMockWork({
        subscribedToWork: false,
        subscribedToAuthor: true,
      }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectWorkSubscribedToAuthor(result, true);
      });
    });

    it("dado que usuario está suscrito al autor, cuando se verifica isChapterUnlocked, entonces desbloquea capítulo 1", async () => {
      setupUserMock(2);
      setupWorkMock(createMockWork({
        subscribedToWork: false,
        subscribedToAuthor: true,
      }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectChapterUnlocked(result, 1, true);
      });
    });

    it("dado que usuario está suscrito al autor, cuando se verifica isChapterUnlocked, entonces desbloquea capítulo 2", async () => {
      setupUserMock(2);
      setupWorkMock(createMockWork({
        subscribedToWork: false,
        subscribedToAuthor: true,
      }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectChapterUnlocked(result, 2, true);
      });
    });

    it("dado que usuario compró capítulos individuales, cuando se verifica isChapterUnlocked, entonces verifica capítulos desbloqueados", async () => {
      setupUserMock(2);
      setupWorkMock(createMockWork({
        subscribedToWork: false,
        subscribedToAuthor: false,
        unlockedChapters: [1],
      }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectUnlockedChapters(result, [1]);
      });
    });

    it("dado que usuario compró capítulos individuales, cuando se verifica isChapterUnlocked, entonces desbloquea capítulo comprado", async () => {
      setupUserMock(2);
      setupWorkMock(createMockWork({
        subscribedToWork: false,
        subscribedToAuthor: false,
        unlockedChapters: [1],
      }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
        expectChapterUnlocked(result, 1, true);
      });
    });

    it("dado que usuario compró capítulos individuales, cuando se verifica isChapterUnlocked, entonces bloquea capítulo no comprado", async () => {
      setupUserMock(3);
      setupWorkMock(createMockWork({
        creator: { id: 2, name: "Autor", surname: "Test" },
        subscribedToWork: false,
        subscribedToAuthor: false,
        unlockedChapters: [1],
      }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectWorkDefined(result);
      });

      expectChapterUnlocked(result, 2, false);
    });
  });

  describe("Navegación entre capítulos", () => {
    it("dado que hay capítulos disponibles, cuando se hace click en un capítulo, entonces navega correctamente", async () => {
      const mockNavigate = vi.fn();
      const useNavigateMock = await import("react-router-dom");
      vi.spyOn(useNavigateMock, "useNavigate").mockReturnValue(mockNavigate);

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectChaptersDefined(result);
      });

      const chapterMock = {
        id: 2,
        title: "Cap 2",
        description: "Descripción"
      };

      act(() => {
        result.current.handleChapterClick(chapterMock);
      });

      expectNavigationCallCount(mockNavigate, 1);
    });
  });

  describe("Idiomas ordenados", () => {
    it("dado que hay idiomas disponibles, cuando se obtiene sortedLanguages, entonces verifica idiomas ordenados definidos", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectSortedLanguagesDefined(result);
      });
    });

    it("dado que hay idiomas disponibles, cuando se obtiene sortedLanguages, entonces primer idioma es Original", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectSortedLanguagesDefined(result);
      });

      expectFirstLanguageName(result, "Original");
    });

    it("dado que hay idiomas disponibles, cuando se obtiene sortedLanguages, entonces primer código es español", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expectSortedLanguagesDefined(result);
      });

      expectFirstLanguageCode(result, "es");
    });
  });

  describe("Lógica de idiomas y traducciones optimizadas", () => {
    it("dado que idioma está disponible, cuando se cambia idioma, entonces llama al servicio con idioma correcto", async () => {
      (ChapterService.getChapterById as any).mockReturnValueOnce({
        data: {
          id: 1,
          title: "Capítulo de prueba",
          content: "Contenido del capítulo",
          chapterNumber: 1,
          workId: 1,
          workName: "Obra de prueba",
          languageDefaultCode: { code: "es", name: "Español" },
          availableLanguages: [{ code: 'en', name: 'English' }],
          allowAiTranslation: true,
        },
        isLoading: false,
        error: null,
      } as any);
      const { result } = renderHook(() => useReadChapterData("1"));
      await waitFor(() => expectChapterDataDefined(result));
      await act(async () => { await result.current.handleLanguageChange('en'); });
      expectFetchChapterServiceCalled(1, 'en');
    });

    it("dado que idioma está disponible, cuando se cambia idioma, entonces actualiza idioma actual", async () => {
      (ChapterService.getChapterById as any).mockReturnValueOnce({
        data: {
          id: 1,
          title: "Capítulo de prueba",
          content: "Contenido del capítulo",
          chapterNumber: 1,
          workId: 1,
          workName: "Obra de prueba",
          languageDefaultCode: { code: "es", name: "Español" },
          availableLanguages: [{ code: 'en', name: 'English' }],
          allowAiTranslation: true,
        },
        isLoading: false,
        error: null,
      } as any);
      const { result } = renderHook(() => useReadChapterData("1"));
      await waitFor(() => expectChapterDataDefined(result));
      await act(async () => { await result.current.handleLanguageChange('en'); });
      expectCurrentLanguage(result, 'en');
    });

    it("dado que idioma no está disponible, cuando se cambia idioma, entonces traduce si no existe versión en el idioma", async () => {
      (ChapterService.getChapterById as any).mockReturnValueOnce({
        data: {
          id: 1,
          title: "Capítulo de prueba",
          content: "Contenido del capítulo",
          chapterNumber: 1,
          workId: 1,
          workName: "Obra de prueba",
          languageDefaultCode: { code: "es", name: "Español" },
          availableLanguages: [],
          allowAiTranslation: true,
        },
        isLoading: false,
        error: null,
      } as any);
      vi.mocked(ChapterService.fetchChapterContent).mockRejectedValueOnce(new Error("Content not found"));

      const { result } = renderHook(() => useReadChapterData("1"));
      await waitFor(() => expectChapterDataDefined(result));
      await act(async () => { await result.current.handleLanguageChange('fr'); });
      expectTranslateServiceCalled('es', 'fr', 'Contenido del capítulo');
    });

    it("dado que idioma no está disponible, cuando se cambia idioma, entonces actualiza idioma actual después de traducir", async () => {
      (ChapterService.getChapterById as any).mockReturnValueOnce({
        data: {
          id: 1,
          title: "Capítulo de prueba",
          content: "Contenido del capítulo",
          chapterNumber: 1,
          workId: 1,
          workName: "Obra de prueba",
          languageDefaultCode: { code: "es", name: "Español" },
          availableLanguages: [],
          allowAiTranslation: true,
        },
        isLoading: false,
        error: null,
      } as any);
      vi.mocked(ChapterService.fetchChapterContent).mockRejectedValueOnce(new Error("Content not found"));

      const { result } = renderHook(() => useReadChapterData("1"));
      await waitFor(() => expectChapterDataDefined(result));
      await act(async () => { await result.current.handleLanguageChange('fr'); });
      expectCurrentLanguage(result, 'fr');
    });

    it("dado que ya se obtuvo traducción, cuando se cambia al mismo idioma nuevamente, entonces usa caché y no repite traducción", async () => {
      (ChapterService.getChapterById as any).mockReturnValueOnce({
        data: {
          id: 1,
          title: "Capítulo de prueba",
          content: "Contenido del capítulo",
          chapterNumber: 1,
          workId: 1,
          workName: "Obra de prueba",
          languageDefaultCode: { code: "es", name: "Español" },
          availableLanguages: [{ code: 'en', name: 'English' }],
          allowAiTranslation: true,
        },
        isLoading: false,
        error: null,
      } as any);
      const { result } = renderHook(() => useReadChapterData("1"));
      await waitFor(() => expectChapterDataDefined(result));
      await act(async () => { await result.current.handleLanguageChange('en'); });
      const initialFetchCalls = (ChapterService.fetchChapterContent as any).mock.calls.length;
      await act(async () => { await result.current.handleLanguageChange('es'); });
      await act(async () => { await result.current.handleLanguageChange('en'); });
      expectFetchChapterCallCount(initialFetchCalls);
    });

    it("dado que allowAiTranslation es false, cuando se intenta cambiar idioma, entonces bloquea traducción", async () => {
      (ChapterService.getChapterById as any).mockReturnValue({
        data: {
          id: 1,
          title: "Capítulo de prueba",
          content: "Contenido del capítulo",
          chapterNumber: 1,
          workId: 1,
          workName: "Obra de prueba",
          languageDefaultCode: { code: "es", name: "Español" },
          availableLanguages: [],
          allowAiTranslation: false,
        },
        isLoading: false,
        error: null,
      } as any);
      vi.mocked(ChapterService.fetchChapterContent).mockRejectedValueOnce(new Error("Content not found"));

      const { result } = renderHook(() => useReadChapterData("1"));
      await waitFor(() => expectChapterDataDefined(result));

      await act(async () => {
        await result.current.handleLanguageChange('en');
      });

      expectErrorNotification('Traduccion AI no permitida para este capitulo.');
    });

    it("dado que allowAiTranslation es false, cuando se intenta cambiar idioma, entonces mantiene idioma original", async () => {
      (ChapterService.getChapterById as any).mockReturnValue({
        data: {
          id: 1,
          title: "Capítulo de prueba",
          content: "Contenido del capítulo",
          chapterNumber: 1,
          workId: 1,
          workName: "Obra de prueba",
          languageDefaultCode: { code: "es", name: "Español" },
          availableLanguages: [],
          allowAiTranslation: false,
        },
        isLoading: false,
        error: null,
      } as any);
      vi.mocked(ChapterService.fetchChapterContent).mockRejectedValueOnce(new Error("Content not found"));

      const { result } = renderHook(() => useReadChapterData("1"));
      await waitFor(() => expectChapterDataDefined(result));

      await act(async () => {
        await result.current.handleLanguageChange('en');
      });

      expectCurrentLanguage(result, 'es');
    });
  });
});
