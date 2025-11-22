import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../../infrastructure/services/RatingService", () => ({
  sendRating: vi.fn(),
}));

import * as RatingService from "../../infrastructure/services/RatingService";
import { useSendRating } from "../../app/hooks/useSendRating";

type UseSendRatingResult = ReturnType<typeof useSendRating>;
type HookResult = { current: UseSendRatingResult };

function expectLoading(result: HookResult, esperado: boolean) {
  expect(result.current.loading).toBe(esperado);
}
function expectSuccess(result: HookResult, esperado: boolean) {
  expect(result.current.success).toBe(esperado);
}
function expectError(result: HookResult, esperado: string | null) {
  expect(result.current.error).toBe(esperado);
}

describe("useSendRating", () => {
  const workId = 42;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Dado un rating válido, cuando se llama a submitRating, entonces envía el rating", async () => {
    (RatingService.sendRating as any).mockResolvedValueOnce({});
    const { result } = renderHook(() => useSendRating(workId));

    await act(async () => {
      await result.current.submitRating(4.5);
    });

    expect(RatingService.sendRating).toHaveBeenCalledWith(workId, 4.5);
  });

  it("Dado un rating válido, cuando se llama a submitRating, entonces success es true", async () => {
    (RatingService.sendRating as any).mockResolvedValueOnce({});
    const { result } = renderHook(() => useSendRating(workId));

    await act(async () => {
      await result.current.submitRating(4.5);
    });

    expectSuccess(result, true);
  });

  it("Dado un rating válido, cuando se llama a submitRating, entonces loading es false", async () => {
    (RatingService.sendRating as any).mockResolvedValueOnce({});
    const { result } = renderHook(() => useSendRating(workId));

    await act(async () => {
      await result.current.submitRating(4.5);
    });

    expectLoading(result, false);
  });

  it("Dado un rating válido, cuando se llama a submitRating, entonces error es null", async () => {
    (RatingService.sendRating as any).mockResolvedValueOnce({});
    const { result } = renderHook(() => useSendRating(workId));

    await act(async () => {
      await result.current.submitRating(4.5);
    });

    expectError(result, null);
  });

  it("Dado un error del servicio, cuando se llama a submitRating, entonces error contiene el mensaje", async () => {
    (RatingService.sendRating as any).mockRejectedValueOnce(new Error("Err envío"));
    const { result } = renderHook(() => useSendRating(workId));

    await act(async () => {
      await result.current.submitRating(3);
    });

    expectError(result, "Err envío");
  });

  it("Dado un error del servicio, cuando se llama a submitRating, entonces success es false", async () => {
    (RatingService.sendRating as any).mockRejectedValueOnce(new Error("Err envío"));
    const { result } = renderHook(() => useSendRating(workId));

    await act(async () => {
      await result.current.submitRating(3);
    });

    expectSuccess(result, false);
  });

  it("Dado un error del servicio, cuando se llama a submitRating, entonces loading es false", async () => {
    (RatingService.sendRating as any).mockRejectedValueOnce(new Error("Err envío"));
    const { result } = renderHook(() => useSendRating(workId));

    await act(async () => {
      await result.current.submitRating(3);
    });

    expectLoading(result, false);
  });
});