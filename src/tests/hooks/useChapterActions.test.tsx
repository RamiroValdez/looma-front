import { renderHook, act } from "@testing-library/react";
import { useChapterActions } from "../../app/hooks/useChapterActions";
import { vi } from "vitest";

vi.mock("../../infrastructure/services/ChapterService", () => {
  return {
    updateChapter: vi.fn().mockResolvedValue({ fetchStatus: 200 }),
    deleteChapter: vi.fn().mockResolvedValue({ fetchStatus: 200 }),
    cancelScheduleChapter: vi.fn().mockResolvedValue({ fetchStatus: 200 }),
  };
});

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

import * as chapterService from "../../infrastructure/services/ChapterService";

const chapterMock = {
  id: 1,
  title: "",
  content: "",
  publishedAt: "",
  price: 0,
  workName: "",
  workId: "1",
  last_update: "",
  likes: 0,
  allowAiTranslation: false,
  languageDefaultCode: { id: 1, code: "es", name: "Español" },
  publicationStatus: "DRAFT",
  scheduledPublicationDate: "",
  availableLanguages: [],
  chapterNumber: 1,
};

function thenErrorMessageIsShown(result: {
    current: {
        handleSave: () => Promise<void>;
        error: string;
        setError: (value: (((prevState: string) => string) | string)) => void;
        handleConfirmDelete: (chapterId: (string | undefined), deleteInput: string) => Promise<void>;
        deleting: boolean;
        deleteError: string;
        setDeleteError: (value: (((prevState: string) => string) | string)) => void;
        handleCancelSchedule: (chapterId: (string | undefined)) => Promise<void>;
        cancelingSchedule: boolean;
        cancelScheduleError: string;
        setCancelScheduleError: (value: (((prevState: string) => string) | string)) => void
    }
}, expectedMessage: string) {
    expect(result.current.error).toBe(expectedMessage);
}

describe("useChapterActions", () => {
  it("muestra error si el título o contenido están vacíos", async () => {
    const { result } = renderHook(() =>
      useChapterActions("1", { ...chapterMock, title: "", content: "" })
    );

    await act(async () => {
      await result.current.handleSave();
    });
      thenErrorMessageIsShown(result,"El título y el contenido son obligatorios.");
  });

  it("llama a updateChapter si los datos son válidos", async () => {
    const { result } = renderHook(() =>
      useChapterActions("1", { ...chapterMock, title: "Título", content: "Contenido" })
    );

    await act(async () => {
      await result.current.handleSave();
    });

    expect(chapterService.updateChapter).toHaveBeenCalled();
  });

  it("muestra error si el input de eliminación es incorrecto", async () => {
    const { result } = renderHook(() =>
      useChapterActions("1", { ...chapterMock, title: "Título", content: "Contenido" })
    );

    await act(async () => {
      await result.current.handleConfirmDelete("1", "texto incorrecto");
    });

    expect(result.current.deleteError).toBe("Debes escribir exactamente: Eliminar Capitulo");
  });

  it("llama a deleteChapter si el input de eliminación es correcto", async () => {
    const { result } = renderHook(() =>
      useChapterActions("1", { ...chapterMock, title: "Título", content: "Contenido" })
    );

    await act(async () => {
      await result.current.handleConfirmDelete("1", "Eliminar Capitulo");
    });

    expect(chapterService.deleteChapter).toHaveBeenCalled();
  });

  it("llama a cancelScheduleChapter si se cancela la programación", async () => {
    const { result } = renderHook(() =>
      useChapterActions("1", { ...chapterMock, title: "Título", content: "Contenido" })
    );

    await act(async () => {
      await result.current.handleCancelSchedule("1");
    });

    expect(chapterService.cancelScheduleChapter).toHaveBeenCalled();
  });
});