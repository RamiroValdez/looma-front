import { renderHook, act } from "@testing-library/react";
import { useUserProfile } from "../../app/hooks/useUserProfile";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

vi.mock("../../infrastructure/services/ProfileService", () => ({
  useUserProfileQuery: vi.fn(),
  useUpdateProfile: vi.fn(),
  useValidateUsername: vi.fn(),
  useChangePassword: vi.fn(),
}));

vi.mock("../../domain/store/UserStorage", () => ({
  useUserStore: vi.fn(),
}));

vi.mock("../../infrastructure/services/ToastProviderService", () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
}));

import * as profileService from "../../infrastructure/services/ProfileService";
import * as userStore from "../../infrastructure/store/UserStorage";
import * as toastService from "../../infrastructure/services/ToastProviderService";

const mockProfile = {
  id: 1,
  name: "Juan",
  surname: "Pérez",
  username: "juanperez",
  email: "juan@test.com",
  image: "avatar.jpg",
  isAuthor: false,
  price: null,
};

const mockUser = {
  userId: 123,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe("useUserProfile", () => {
  const mockRefetch = vi.fn();
  const mockUpdateProfileMutation = {
    mutateAsync: vi.fn(),
  };
  const mockValidateUsernameMutation = {
    mutateAsync: vi.fn(),
  };
  const mockChangePasswordMutation = {
    mutateAsync: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    (userStore.useUserStore as any).mockReturnValue({
      user: mockUser,
    });

    (profileService.useUserProfileQuery as any).mockReturnValue({
      data: mockProfile,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    (profileService.useUpdateProfile as any).mockReturnValue(mockUpdateProfileMutation);
    (profileService.useValidateUsername as any).mockReturnValue(mockValidateUsernameMutation);
    (profileService.useChangePassword as any).mockReturnValue(mockChangePasswordMutation);
  });

  it("inicializa correctamente con datos del perfil", () => {
    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.loading).toBe(false);
    expect(result.current.editedData).toEqual({
      firstName: "Juan",
      lastName: "Pérez", 
      username: "juanperez",
      isAuthor: false,
      price: "",
    });
  });

  it("cambia el estado de edición correctamente", () => {
    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isEditing).toBe(false);

    act(() => {
      result.current.setIsEditing(true);
    });

    expect(result.current.isEditing).toBe(true);
  });

  it("actualiza los datos del formulario correctamente", () => {
    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleInputChange("firstName", "Carlos");
    });

    expect(result.current.editedData.firstName).toBe("Carlos");
  });

  it("establece precio por defecto cuando isAuthor se activa", () => {
    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleInputChange("isAuthor", true);
    });

    expect(result.current.editedData.isAuthor).toBe(true);
    expect(result.current.editedData.price).toBe("0.00");
  });

  it("limpia el precio cuando isAuthor se desactiva", () => {
    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleInputChange("isAuthor", true);
    });

    act(() => {
      result.current.handleInputChange("isAuthor", false);
    });

    expect(result.current.editedData.isAuthor).toBe(false);
    expect(result.current.editedData.price).toBe("");
  });

  it("valida username cuando cambia y es diferente al actual", async () => {
    mockValidateUsernameMutation.mutateAsync.mockResolvedValue({ isValid: true });

    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.handleInputChange("username", "nuevoUsername");
    });

    expect(mockValidateUsernameMutation.mutateAsync).toHaveBeenCalledWith({
      username: "nuevoUsername",
    });
  });

  it("no valida username si es menor a 3 caracteres", async () => {
    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.handleInputChange("username", "ab");
    });

    expect(result.current.usernameValidation.isValid).toBe(false);
    expect(mockValidateUsernameMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it("maneja la validación de archivos de imagen correctamente", () => {
    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      target: {
        files: [mockFile],
        value: '',
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    const mockFileReader = {
      readAsDataURL: vi.fn(),
      onload: null as any,
      result: 'data:image/jpeg;base64,mockbase64',
    };

    globalThis.FileReader = vi.fn().mockImplementation(() => mockFileReader) as any;

    act(() => {
      result.current.handleImageChange(mockEvent);
    });

    act(() => {
      mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,mockbase64' } } as any);
    });

    expect(result.current.selectedImage).toBe('data:image/jpeg;base64,mockbase64');
  });

  it("guarda el perfil exitosamente", async () => {
    mockUpdateProfileMutation.mutateAsync.mockResolvedValue({});

    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setIsEditing(true);
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockUpdateProfileMutation.mutateAsync).toHaveBeenCalled();
    expect(mockRefetch).toHaveBeenCalled();
    expect(result.current.isEditing).toBe(false);
    expect(toastService.notifySuccess).toHaveBeenCalledWith("¡Perfil actualizado exitosamente!");
  });

  it("maneja errores al guardar el perfil", async () => {
    const mockError = { message: "Error de conexión" };
    mockUpdateProfileMutation.mutateAsync.mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(result.current.isEditing).toBe(false);
    expect(toastService.notifyError).toHaveBeenCalledWith(
      "Error al actualizar el perfil: Error de conexión"
    );
  });

  it("cancela la edición correctamente", () => {
    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setIsEditing(true);
      result.current.handleInputChange("firstName", "Nombre Cambiado");
    });

    act(() => {
      result.current.handleCancel();
    });

    expect(result.current.isEditing).toBe(false);
    expect(result.current.editedData.firstName).toBe("Juan");
    expect(result.current.selectedImage).toBe(null);
  });

  it("cambia contraseña exitosamente", async () => {
    mockChangePasswordMutation.mutateAsync.mockResolvedValue({});

    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handlePasswordChange("newPassword");
    });

    expect(mockChangePasswordMutation.mutateAsync).toHaveBeenCalledWith(expect.any(FormData));
    expect(toastService.notifySuccess).toHaveBeenCalledWith("¡Contraseña cambiada exitosamente!");
  });

  it("maneja errores al cambiar contraseña", async () => {
    const mockError = { message: "Contraseña incorrecta" };
    mockChangePasswordMutation.mutateAsync.mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserProfile(), {
      wrapper: createWrapper(),
    });

    try {
      await act(async () => {
        await result.current.handlePasswordChange("wrongPassword");
      });
    } catch (error) { console.error('Error esperado en cambio de contraseña', error); }

    expect(toastService.notifyError).toHaveBeenCalledWith("Contraseña incorrecta");
  });
});