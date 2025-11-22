import { renderHook, act } from "@testing-library/react";
import { describe, it, beforeEach, expect, vi } from 'vitest';

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));
vi.mock("../../domain/store/AuthStore", () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}));
vi.mock("../../infrastructure/services/VerifyCodeService", () => ({
  verifyCode: vi.fn(),
}));

import { useVerifyCode } from "../../app/hooks/useVerifyCode";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../domain/store/AuthStore";
import * as VerifyCodeService from "../../infrastructure/services/VerifyCodeService";

// Helpers
type UseVerifyCodeResult = ReturnType<typeof useVerifyCode>;
type HookResult = { current: UseVerifyCodeResult };

function expectError(result: HookResult, esperado: string) {
  expect(result.current.error).toBe(esperado);
}
function expectLoading(result: HookResult, esperado: boolean) {
  expect(result.current.loading).toBe(esperado);
}

describe("useVerifyCode", () => {
  const mockNavigate = vi.fn();
  const mockSetToken = vi.fn();
  const email = "test@mail.com";

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as any).mockReturnValue(mockNavigate);
    (useAuthStore.getState as unknown as any).mockReturnValue({ setToken: mockSetToken });
  });

  it("Dado un código válido, cuando se envía el formulario, entonces verifica el código, guarda el token y navega", async () => {
    (VerifyCodeService.verifyCode as any).mockResolvedValueOnce({ token: "abc123" });
    const { result } = renderHook(() => useVerifyCode(email));

    act(() => {
      result.current.setCode("123456");
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    });

    expect(VerifyCodeService.verifyCode).toHaveBeenCalledWith(email, "123456");
    expect(mockSetToken).toHaveBeenCalledWith("abc123");
    expect(mockNavigate).toHaveBeenCalledWith("/preferences");
    expectError(result, "");
    expectLoading(result, false);
  });

  it("Dado un error del servicio, cuando se envía el formulario, entonces muestra el mensaje de error", async () => {
    (VerifyCodeService.verifyCode as any).mockRejectedValueOnce(new Error("Código inválido"));
    const { result } = renderHook(() => useVerifyCode(email));

    act(() => {
      result.current.setCode("000000");
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    });

    expect(VerifyCodeService.verifyCode).toHaveBeenCalledWith(email, "000000");
    expectError(result, "Código inválido");
    expectLoading(result, false);
  });

  it("Dado un error sin mensaje, cuando se envía el formulario, entonces muestra el mensaje de error por defecto", async () => {
    (VerifyCodeService.verifyCode as any).mockRejectedValueOnce({});
    const { result } = renderHook(() => useVerifyCode(email));

    act(() => {
      result.current.setCode("000000");
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    });

    expectError(result, "Error al verificar el código.");
    expectLoading(result, false);
  });
});