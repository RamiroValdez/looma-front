import { renderHook, act, waitFor } from "@testing-library/react";
import { useReadChapterData } from "../../app/features/WorkDetail/hooks/useReadChapterData";
import { vi } from "vitest";

// ========== Mocks ==========

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
    },
    isLoading: false,
    error: null,
  }),
}));

vi.mock("../../infrastructure/services/WorkService", () => ({
  WorkService: {
    getWorkById: vi.fn().mockResolvedValue({
      id: 1,
      title: "Obra de prueba",
      banner: "/banner.jpg",
      cover: "/cover.jpg",
      creator: { id: 1, name: "Autor", surname: "Test" },
      chapters: [
        { id: 1, title: "Cap 1", likes: 10, publicationStatus: "PUBLISHED" },
        { id: 2, title: "Cap 2", likes: 5, publicationStatus: "PUBLISHED" },
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

vi.mock("../../domain/store/UserStorage", () => ({
  useUserStore: vi.fn().mockReturnValue({
    user: { userId: 2, name: "Usuario Test" },
  }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

import * as ChapterService from "../../infrastructure/services/ChapterService";
import { WorkService } from "../../infrastructure/services/WorkService";
import { translateContent } from "../../infrastructure/services/TranslateService";
import { subscribeToWork, subscribeToChapter } from "../../infrastructure/services/paymentService";
import { notifyError, notifySuccess } from "../../infrastructure/services/ToastProviderService";
import { useUserStore } from "../../domain/store/UserStorage";

// ========== Test Helpers ==========

const setupWindowOpenMock = () => {
  const mockWindowInstance = { closed: false, location: { href: "" }, close: vi.fn() };
  const mockOpen = vi.fn().mockReturnValue(mockWindowInstance);
  window.open = mockOpen as any;
  return mockOpen;
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
  creator: { id: 1, name: "Autor", surname: "Test" },
  chapters: [
    { id: 1, title: "Cap 1", likes: 10, publicationStatus: "PUBLISHED" },
    { id: 2, title: "Cap 2", likes: 5, publicationStatus: "PUBLISHED" },
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
  vi.mocked(useUserStore).mockReturnValue({ user: mockUser } as any);
};

const setupWorkMock = (workData: any) => {
  vi.mocked(WorkService.getWorkById).mockClear();
  vi.mocked(WorkService.getWorkById).mockReset();
  vi.mocked(WorkService.getWorkById).mockResolvedValue(workData as any);
};

describe("useReadChapterData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
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

    vi.mocked(WorkService.getWorkById).mockResolvedValue(createMockWork() as any);

    vi.mocked(translateContent).mockResolvedValue("Contenido traducido");
    
    vi.mocked(subscribeToWork).mockResolvedValue({ 
      fetchStatus: 200, 
      redirectUrl: "https://mercadopago.com/checkout" 
    });
    
    vi.mocked(subscribeToChapter).mockResolvedValue({ 
      fetchStatus: 200, 
      redirectUrl: "https://mercadopago.com/checkout" 
    });

    vi.mocked(useUserStore).mockReturnValue({
      user: { userId: 2, name: "Usuario Test" },
    } as any);
  });

  describe("Carga de datos", () => {
    it("carga correctamente los datos del capítulo", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.chapterData).toBeDefined();
        expect(result.current.chapterData?.title).toBe("Capítulo de prueba");
        expect(result.current.translatedContent).toBe("Contenido del capítulo");
      });
    });

    it("carga correctamente los datos de la obra", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(WorkService.getWorkById).toHaveBeenCalledWith(1);
        expect(result.current.work).toBeDefined();
        expect(result.current.work?.title).toBe("Obra de prueba");
        expect(result.current.chapters).toHaveLength(2);
      });
    });

    it("inicializa los likes correctamente", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.localLikes[1]).toBe(10);
        expect(result.current.localLikes[2]).toBe(5);
      });
    });
  });

  describe("Manejo de errores", () => {
    it("maneja correctamente errores 403", async () => {
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
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });

    it("muestra error cuando no se puede cargar la obra", async () => {
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
        expect(result.current.chapterData).toBeDefined();
      });

      await waitFor(() => {
        expect(notifyError).toHaveBeenCalledWith('No se pudo cargar información de la obra.');
      }, { timeout: 3000 });
    });
  });

  describe("Traducción de contenido", () => {
    it("traduce el contenido correctamente", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.chapterData).toBeDefined();
      });

      await act(async () => {
        await result.current.handleLanguageChange("en");
      });

      expect(translateContent).toHaveBeenCalledWith("es", "en", "Contenido del capítulo");
      expect(result.current.translatedContent).toBe("Contenido traducido");
      expect(result.current.currentLanguage).toBe("en");
    });

    it("no traduce si el idioma es el mismo", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.currentLanguage).toBe("es");
      });

      await act(async () => {
        await result.current.handleLanguageChange("es");
      });

      expect(translateContent).not.toHaveBeenCalled();
    });

    it("maneja errores de traducción", async () => {
      vi.mocked(translateContent).mockRejectedValueOnce(new Error("Error de traducción"));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.chapterData).toBeDefined();
      });

      await act(async () => {
        await result.current.handleLanguageChange("en");
      });

      expect(notifyError).toHaveBeenCalledWith("No se pudo traducir el contenido.");
    });
  });

  describe("Toggle de likes", () => {
    it("incrementa los likes al dar like", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.localLikes[1]).toBe(10);
        expect(result.current.liked[1]).toBeFalsy(); 
      });

      act(() => {
        result.current.toggleLike(1);
      });

      expect(result.current.liked[1]).toBe(true);
      expect(result.current.localLikes[1]).toBe(11);
    });

    it("decrementa los likes al quitar like", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.localLikes[1]).toBe(10);
      });

      act(() => {
        result.current.toggleLike(1);
      });

      act(() => {
        result.current.toggleLike(1);
      });

      expect(result.current.liked[1]).toBe(false);
      expect(result.current.localLikes[1]).toBe(10);
    });
  });

  describe("Fullscreen", () => {
    it("activa el modo fullscreen", async () => {
      const { mockRequestFullscreen } = setupFullscreenMocks();

      const { result } = renderHook(() => useReadChapterData("1"));

      await act(async () => {
        await result.current.toggleFullScreen();
      });

      expect(mockRequestFullscreen).toHaveBeenCalled();
      expect(result.current.isFullScreen).toBe(true);
    });

    it("desactiva el modo fullscreen", async () => {
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

      expect(mockExitFullscreen).toHaveBeenCalled();
    });
  });

  describe("Suscripción a obra", () => {
    it("llama al servicio de suscripción correctamente", async () => {
      const mockOpen = setupWindowOpenMock();

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.work).toBeDefined();
        expect(result.current.work?.id).toBe(1);
      });

      await act(async () => {
        await result.current.handleSubscribeWork();
      });

      expect(mockOpen).toHaveBeenCalledWith("", "_blank");
      expect(subscribeToWork).toHaveBeenCalledWith(1, "mercadopago");
      expect(notifySuccess).toHaveBeenCalledWith("Redirigiendo a MercadoPago...");
    });

    it("no permite suscribirse si ya está pagando", async () => {
      setupWindowOpenMock();

      vi.mocked(subscribeToWork).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ 
          fetchStatus: 200, 
          redirectUrl: "https://mercadopago.com/checkout" 
        }), 200))
      );

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.work).toBeDefined();
        expect(result.current.work?.id).toBe(1);
      });

      act(() => {
        result.current.handleSubscribeWork();
      });

      await waitFor(() => {
        expect(result.current.isPaying).toBe(true);
      }, { timeout: 100 });

      act(() => {
        result.current.handleSubscribeWork();
      });

      await waitFor(() => {
        expect(result.current.isPaying).toBe(false);
      }, { timeout: 3000 });

      expect(subscribeToWork).toHaveBeenCalledTimes(1);
    });

    it("maneja errores de suscripción", async () => {
      setupWindowOpenMock();

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.work).toBeDefined();
        expect(result.current.work?.id).toBe(1);
      });

      vi.mocked(subscribeToWork).mockRejectedValueOnce(new Error("Error de pago"));

      await act(async () => {
        await result.current.handleSubscribeWork();
      });

      await waitFor(() => {
        expect(notifyError).toHaveBeenCalledWith("Error de pago");
      });
    });
  });

  describe("Pago de capítulo", () => {
    it("llama al servicio de pago de capítulo correctamente", async () => {
      const mockOpen = setupWindowOpenMock();

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.work).toBeDefined();
        expect(result.current.work?.id).toBe(1);
      });

      await act(async () => {
        await result.current.handleChapterPayment(2);
      });

      expect(mockOpen).toHaveBeenCalledWith("", "_blank");
      expect(subscribeToChapter).toHaveBeenCalledWith(2, 1, "mercadopago");
      expect(notifySuccess).toHaveBeenCalledWith("Redirigiendo a MercadoPago...");
    });

    it("maneja errores de pago de capítulo", async () => {
      setupWindowOpenMock();

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.work).toBeDefined();
        expect(result.current.work?.id).toBe(1);
      });

      vi.mocked(subscribeToChapter).mockRejectedValueOnce(new Error("Error de pago"));

      await act(async () => {
        await result.current.handleChapterPayment(2);
      });

      await waitFor(() => {
        expect(notifyError).toHaveBeenCalledWith("Error de pago");
      });
    });
  });

  describe("Lógica de isChapterUnlocked", () => {
    it("desbloquea todos los capítulos si es el autor", async () => {
      setupUserMock(1);
      setupWorkMock(createMockWork());

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.work).toBeDefined();
        expect(result.current.isAuthor).toBe(true);
      });

      expect(result.current.isChapterUnlocked(1)).toBe(true);
      expect(result.current.isChapterUnlocked(2)).toBe(true);
      expect(result.current.isAuthor).toBe(true);
    });

    it("desbloquea todos los capítulos si está suscrito a la obra", async () => {
      setupUserMock(2);
      setupWorkMock(createMockWork({
        subscribedToWork: true,
        subscribedToAuthor: false,
      }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.work).toBeDefined();
      });

      expect(result.current.isChapterUnlocked(1)).toBe(true);
      expect(result.current.isChapterUnlocked(2)).toBe(true);
    });

    it("desbloquea todos los capítulos si está suscrito al autor", async () => {
      setupUserMock(2);
      setupWorkMock(createMockWork({
        subscribedToWork: false,
        subscribedToAuthor: true,
      }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.work).toBeDefined();
        expect(result.current.work?.subscribedToAuthor).toBe(true);
      });

      expect(result.current.isChapterUnlocked(1)).toBe(true);
      expect(result.current.isChapterUnlocked(2)).toBe(true);
    });

    it("desbloquea solo capítulos comprados individualmente", async () => {
      setupUserMock(2);
      setupWorkMock(createMockWork({
        subscribedToWork: false,
        subscribedToAuthor: false,
        unlockedChapters: [1],
      }));

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.work).toBeDefined();
      });

      expect(result.current.isChapterUnlocked(1)).toBe(true);
      expect(result.current.isChapterUnlocked(2)).toBe(false);
    });
  });

  describe("Navegación entre capítulos", () => {
    it("navega correctamente al hacer click en un capítulo", async () => {
      const mockNavigate = vi.fn();
      const useNavigateMock = await import("react-router-dom");
      vi.spyOn(useNavigateMock, "useNavigate").mockReturnValue(mockNavigate);

      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.chapters).toBeDefined();
      });

      const chapterMock = { 
        id: 2, 
        title: "Cap 2", 
        description: "Descripción" 
      };

      act(() => {
        result.current.handleChapterClick(chapterMock);
      });

      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  describe("Idiomas ordenados", () => {
    it("ordena los idiomas con el original primero", async () => {
      const { result } = renderHook(() => useReadChapterData("1"));

      await waitFor(() => {
        expect(result.current.sortedLanguages).toBeDefined();
      });

      expect(result.current.sortedLanguages[0].name).toBe("Original");
      expect(result.current.sortedLanguages[0].code).toBe("es");
    });
  });
});