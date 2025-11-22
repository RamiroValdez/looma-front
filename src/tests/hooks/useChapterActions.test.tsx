import { renderHook, act } from "@testing-library/react";
import { useChapterActions } from "../../app/hooks/useChapterActions";
import { vi } from "vitest";

vi.mock("../../infrastructure/services/ChapterService", () => ({
  updateChapter: vi.fn().mockResolvedValue({ fetchStatus: 200 }),
  deleteChapter: vi.fn().mockResolvedValue({ fetchStatus: 200 }),
  cancelScheduleChapter: vi.fn().mockResolvedValue({ fetchStatus: 200 }),
}));
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

import * as chapterService from "../../infrastructure/services/ChapterService";

const chapterBase = {
  id: 1,
  title: "Título",
  content: "Contenido",
  publishedAt: "",
  price: 0,
  workName: "",
  workId: "1",
  last_update: "",
  likes: 0,
  isLiked: false,
  allowAiTranslation: false,
  languageDefaultCode: { id: 1, code: "es", name: "Español" },
  publicationStatus: "DRAFT",
  scheduledPublicationDate: "",
  availableLanguages: [],
  chapterNumber: 1,
  isLiked: false,
};

function expectError(result: any, mensaje: string) {
  expect(result.current.error).toBe(mensaje);
}
function expectDeleteError(result: any, mensaje: string) {
  expect(result.current.deleteError).toBe(mensaje);
}

describe("useChapterActions", () => {

  it("Dado un título vacío, cuando se guarda, entonces muestra error de campos obligatorios", async () => {
    const { result } = renderHook(() =>
      useChapterActions("1", { ...chapterBase, title: "", content: "Contenido" })
    );
    await act(async () => {
      await result.current.handleSave();
    });
    expectError(result, "El título y el contenido son obligatorios.");
  });

  it("Dado un contenido vacío, cuando se guarda, entonces muestra error de campos obligatorios", async () => {
    const { result } = renderHook(() =>
      useChapterActions("1", { ...chapterBase, title: "Título", content: "" })
    );
    await act(async () => {
      await result.current.handleSave();
    });
    expectError(result, "El título y el contenido son obligatorios.");
  });

  it("Dado datos válidos, cuando se guarda, entonces llama a updateChapter", async () => {
    const { result } = renderHook(() =>
      useChapterActions("1", { ...chapterBase })
    );
    await act(async () => {
      await result.current.handleSave();
    });
    expect(chapterService.updateChapter).toHaveBeenCalled();
  });

  it("Dado un input de eliminación incorrecto, cuando se confirma eliminar, entonces muestra error de validación", async () => {
    const { result } = renderHook(() =>
      useChapterActions("1", { ...chapterBase })
    );
    await act(async () => {
      await result.current.handleConfirmDelete("1", "texto incorrecto");
    });
    expectDeleteError(result, "Debes escribir exactamente: Eliminar Capitulo");
  });

  it("Dado un input de eliminación correcto, cuando se confirma eliminar, entonces llama a deleteChapter", async () => {
    const { result } = renderHook(() =>
      useChapterActions("1", { ...chapterBase })
    );
    await act(async () => {
      await result.current.handleConfirmDelete("1", "Eliminar Capitulo");
    });
    expect(chapterService.deleteChapter).toHaveBeenCalled();
  });

  it("Dado un capítulo válido, cuando se cancela la programación, entonces llama a cancelScheduleChapter", async () => {
    const { result } = renderHook(() =>
      useChapterActions("1", { ...chapterBase })
    );
    await act(async () => {
      await result.current.handleCancelSchedule("1");
    });
    expect(chapterService.cancelScheduleChapter).toHaveBeenCalled();
  });
});