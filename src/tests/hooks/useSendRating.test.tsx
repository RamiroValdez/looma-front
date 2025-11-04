import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../../infrastructure/services/RatingService", () => {
  return {
    sendRating: vi.fn(),
  };
});

import * as RatingService from "../../infrastructure/services/RatingService";
import { useSendRating } from "../../app/hooks/useSendRating";

describe("useSendRating", () => {
  const workId = 42;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("envía la valoración correctamente y actualiza estados", async () => {
    (RatingService.sendRating as any).mockResolvedValueOnce({});
    const { result } = renderHook(() => useSendRating(workId));

    await act(async () => {
      await result.current.submitRating(4.5);
    });

    expect(RatingService.sendRating).toHaveBeenCalledWith(workId, 4.5);
    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("maneja error del servicio y setea mensaje de error", async () => {
    (RatingService.sendRating as any).mockRejectedValueOnce(new Error("Err envío"));
    const { result } = renderHook(() => useSendRating(workId));

    await act(async () => {
      await result.current.submitRating(3);
    });

    expect(RatingService.sendRating).toHaveBeenCalledWith(workId, 3);
    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe("Err envío");
  });
});