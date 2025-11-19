import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../../infrastructure/services/LikeService", () => ({
  likeWork: vi.fn().mockResolvedValue({ likeCount: 11 }),
  unlikeWork: vi.fn().mockResolvedValue({ likeCount: 9 }),
  likeChapter: vi.fn().mockResolvedValue({ likeCount: 6 }),
  unlikeChapter: vi.fn().mockResolvedValue({ likeCount: 4 }),
}));

import * as LikeService from "../../infrastructure/services/LikeService";
import { useLike } from "../../app/hooks/useLike";

type UseLikeResult = ReturnType<typeof useLike>;
type HookResult = { current: UseLikeResult };

function expectLiked(result: HookResult, esperado: boolean) {
  expect(result.current.liked).toBe(esperado);
}
function expectCount(result: HookResult, esperado: number) {
  expect(result.current.count).toBe(esperado);
}
function expectLoading(result: HookResult, esperado: boolean) {
  expect(result.current.loading).toBe(esperado);
}

describe("useLike", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Dado initialLiked en true, cuando se monta el hook, entonces liked es true", () => {
    const { result } = renderHook(() => useLike({ initialLiked: true, initialCount: 10, type: "work", workId: 1 }));
    expectLiked(result, true);
  });

  it("Dado initialLiked en false, cuando se monta el hook, entonces liked es false", () => {
    const { result } = renderHook(() => useLike({ initialLiked: false, initialCount: 10, type: "work", workId: 1 }));
    expectLiked(result, false);
  });

  it("Dado initialCount, cuando se monta el hook, entonces count es igual a initialCount", () => {
    const { result } = renderHook(() => useLike({ initialLiked: false, initialCount: 7, type: "work", workId: 1 }));
    expectCount(result, 7);
  });

  it("Dado un work no likeado, cuando se llama a handleLike, entonces likea el work y actualiza el contador", async () => {
    const { result } = renderHook(() => useLike({ initialLiked: false, initialCount: 10, type: "work", workId: 1 }));
    await act(async () => {
      await result.current.handleLike();
    });
    expect(LikeService.likeWork).toHaveBeenCalledWith(1);
    expectLiked(result, true);
    expectCount(result, 11);
  });

  it("Dado un work likeado, cuando se llama a handleLike, entonces deslikea el work y actualiza el contador", async () => {
    const { result } = renderHook(() => useLike({ initialLiked: true, initialCount: 10, type: "work", workId: 1 }));
    await act(async () => {
      await result.current.handleLike();
    });
    expect(LikeService.unlikeWork).toHaveBeenCalledWith(1);
    expectLiked(result, false);
    expectCount(result, 9);
  });

  it("Dado un chapter no likeado, cuando se llama a handleLike, entonces likea el chapter y actualiza el contador", async () => {
    const { result } = renderHook(() => useLike({ initialLiked: false, initialCount: 5, type: "chapter", workId: 1, chapterId: 2 }));
    await act(async () => {
      await result.current.handleLike();
    });
    expect(LikeService.likeChapter).toHaveBeenCalledWith(1, 2);
    expectLiked(result, true);
    expectCount(result, 6);
  });

  it("Dado un chapter likeado, cuando se llama a handleLike, entonces deslikea el chapter y actualiza el contador", async () => {
    const { result } = renderHook(() => useLike({ initialLiked: true, initialCount: 5, type: "chapter", workId: 1, chapterId: 2 }));
    await act(async () => {
      await result.current.handleLike();
    });
    expect(LikeService.unlikeChapter).toHaveBeenCalledWith(1, 2);
    expectLiked(result, false);
    expectCount(result, 4);
  });

  it("Dado que se llama a handleLike, cuando está en proceso, entonces loading es true durante la llamada", async () => {
    let resolvePromise: any;
    (LikeService.likeWork as any).mockImplementation(() => new Promise(res => { resolvePromise = res; }));
    const { result } = renderHook(() => useLike({ initialLiked: false, initialCount: 10, type: "work", workId: 1 }));

    act(() => {
      result.current.handleLike();
    });
    expectLoading(result, true);

    await act(async () => {
      resolvePromise({ likeCount: 11 });
    });
    expectLoading(result, false);
  });
});