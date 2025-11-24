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

vi.mock("../../infrastructure/store/UserStorage", () => ({
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

// Helper functions - cada una con un solo expect
const expectProfileData = (result: any, expectedProfile: any) => {
  expect(result.current.profile).toEqual(expectedProfile);
};

const expectLoadingState = (result: any, isLoading: boolean) => {
  expect(result.current.loading).toBe(isLoading);
};

const expectEditedDataFirstName = (result: any, firstName: string) => {
  expect(result.current.editedData.firstName).toBe(firstName);
};

const expectEditedDataLastName = (result: any, lastName: string) => {
  expect(result.current.editedData.lastName).toBe(lastName);
};

const expectEditedDataUsername = (result: any, username: string) => {
  expect(result.current.editedData.username).toBe(username);
};

const expectEditedDataIsAuthor = (result: any, isAuthor: boolean) => {
  expect(result.current.editedData.isAuthor).toBe(isAuthor);
};

const expectEditedDataPrice = (result: any, price: string) => {
  expect(result.current.editedData.price).toBe(price);
};

const expectIsEditingState = (result: any, isEditing: boolean) => {
  expect(result.current.isEditing).toBe(isEditing);
};

const expectUsernameValidationState = (result: any, isValid: boolean) => {
  expect(result.current.usernameValidation.isValid).toBe(isValid);
};

const expectSelectedImage = (result: any, imageData: string | null | undefined) => {
  expect(result.current.selectedImage).toBe(imageData);
};

const expectValidateUsernameCalled = (mockFn: any, username: string) => {
  expect(mockFn).toHaveBeenCalledWith({ username });
};

const expectValidateUsernameNotCalled = (mockFn: any) => {
  expect(mockFn).not.toHaveBeenCalled();
};

const expectUpdateProfileCalled = (mockFn: any) => {
  expect(mockFn).toHaveBeenCalled();
};

const expectRefetchCalled = (mockFn: any) => {
  expect(mockFn).toHaveBeenCalled();
};

const expectSuccessToast = (message: string) => {
  expect(toastService.notifySuccess).toHaveBeenCalledWith(message);
};

const expectErrorToast = (message: string) => {
  expect(toastService.notifyError).toHaveBeenCalledWith(message);
};

const expectChangePasswordCalled = (mockFn: any, formData: any) => {
  expect(mockFn).toHaveBeenCalledWith(formData);
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

  describe("Inicialización", () => {
    it("dado que el hook se inicializa, cuando se renderiza, entonces carga los datos del perfil correctamente", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      expectProfileData(result, mockProfile);
    });

    it("dado que el hook se inicializa, cuando se renderiza, entonces establece el estado de loading correctamente", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      expectLoadingState(result, false);
    });

    it("dado que el hook se inicializa, cuando se renderiza, entonces inicializa firstName en editedData", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      expectEditedDataFirstName(result, "Juan");
    });

    it("dado que el hook se inicializa, cuando se renderiza, entonces inicializa lastName en editedData", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      expectEditedDataLastName(result, "Pérez");
    });

    it("dado que el hook se inicializa, cuando se renderiza, entonces inicializa username en editedData", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      expectEditedDataUsername(result, "juanperez");
    });

    it("dado que el hook se inicializa, cuando se renderiza, entonces inicializa isAuthor en editedData", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      expectEditedDataIsAuthor(result, false);
    });

    it("dado que el hook se inicializa, cuando se renderiza, entonces inicializa price en editedData", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      expectEditedDataPrice(result, "");
    });
  });

  describe("Estado de edición", () => {
    it("dado que el hook se inicializa, cuando se renderiza, entonces isEditing es false inicialmente", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      expectIsEditingState(result, false);
    });

    it("dado que isEditing es false, cuando se llama setIsEditing con true, entonces cambia el estado a true", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setIsEditing(true);
      });

      expectIsEditingState(result, true);
    });
  });

  describe("Actualización de datos del formulario", () => {
    it("dado que el hook está inicializado, cuando se cambia firstName, entonces actualiza el dato correctamente", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleInputChange("firstName", "Carlos");
      });

      expectEditedDataFirstName(result, "Carlos");
    });
  });

  describe("Manejo de isAuthor", () => {
    it("dado que isAuthor se activa, cuando se llama handleInputChange, entonces establece isAuthor como true", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleInputChange("isAuthor", true);
      });

      expectEditedDataIsAuthor(result, true);
    });

    it("dado que isAuthor se activa, cuando se llama handleInputChange, entonces establece precio por defecto", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleInputChange("isAuthor", true);
      });

      expectEditedDataPrice(result, "0.00");
    });

    it("dado que isAuthor está activo y se desactiva, cuando se llama handleInputChange, entonces cambia isAuthor a false", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleInputChange("isAuthor", true);
      });

      act(() => {
        result.current.handleInputChange("isAuthor", false);
      });

      expectEditedDataIsAuthor(result, false);
    });

    it("dado que isAuthor está activo y se desactiva, cuando se llama handleInputChange, entonces limpia el precio", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleInputChange("isAuthor", true);
      });

      act(() => {
        result.current.handleInputChange("isAuthor", false);
      });

      expectEditedDataPrice(result, "");
    });
  });

  describe("Validación de username", () => {
    it("dado que se cambia el username a uno válido, cuando se llama handleInputChange, entonces valida el username", async () => {
      mockValidateUsernameMutation.mutateAsync.mockResolvedValue({ isValid: true });

      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.handleInputChange("username", "nuevoUsername");
      });

      expectValidateUsernameCalled(mockValidateUsernameMutation.mutateAsync, "nuevoUsername");
    });

    it("dado que se cambia el username a uno menor a 3 caracteres, cuando se llama handleInputChange, entonces establece validación como inválida", async () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.handleInputChange("username", "ab");
      });

      expectUsernameValidationState(result, false);
    });

    it("dado que se cambia el username a uno menor a 3 caracteres, cuando se llama handleInputChange, entonces no llama al validador", async () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.handleInputChange("username", "ab");
      });

      expectValidateUsernameNotCalled(mockValidateUsernameMutation.mutateAsync);
    });
  });

  describe("Manejo de imágenes", () => {
    it("dado que se selecciona una imagen válida, cuando se ejecuta handleImageChange, entonces actualiza selectedImage", () => {
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

      expectSelectedImage(result, 'data:image/jpeg;base64,mockbase64');
    });
  });

  describe("Guardar perfil", () => {
    it("dado que se guarda el perfil exitosamente, cuando se llama handleSave, entonces llama al servicio de actualización", async () => {
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

      expectUpdateProfileCalled(mockUpdateProfileMutation.mutateAsync);
    });

    it("dado que se guarda el perfil exitosamente, cuando se llama handleSave, entonces ejecuta refetch", async () => {
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

      expectRefetchCalled(mockRefetch);
    });

    it("dado que se guarda el perfil exitosamente, cuando se llama handleSave, entonces desactiva el modo edición", async () => {
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

      expectIsEditingState(result, false);
    });

    it("dado que se guarda el perfil exitosamente, cuando se llama handleSave, entonces muestra notificación de éxito", async () => {
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

      expectSuccessToast("¡Perfil actualizado exitosamente!");
    });

    it("dado que falla el guardado del perfil, cuando se llama handleSave, entonces desactiva el modo edición", async () => {
      const mockError = { message: "Error de conexión" };
      mockUpdateProfileMutation.mutateAsync.mockRejectedValue(mockError);

      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expectIsEditingState(result, false);
    });

    it("dado que falla el guardado del perfil, cuando se llama handleSave, entonces muestra mensaje de error", async () => {
      const mockError = { message: "Error de conexión" };
      mockUpdateProfileMutation.mutateAsync.mockRejectedValue(mockError);

      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expectErrorToast("Error al actualizar el perfil: Error de conexión");
    });
  });

  describe("Cancelar edición", () => {
    it("dado que se cancela la edición, cuando se llama handleCancel, entonces desactiva el modo edición", () => {
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

      expectIsEditingState(result, false);
    });

    it("dado que se cancela la edición, cuando se llama handleCancel, entonces restaura los datos originales", () => {
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

      expectEditedDataFirstName(result, "Juan");
    });

    it("dado que se cancela la edición, cuando se llama handleCancel, entonces limpia la imagen seleccionada", () => {
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

      expectSelectedImage(result, undefined);
    });
  });

  describe("Cambio de contraseña", () => {
    it("dado que se cambia la contraseña exitosamente, cuando se llama handlePasswordChange, entonces llama al servicio de cambio de contraseña", async () => {
      mockChangePasswordMutation.mutateAsync.mockResolvedValue({});

      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.handlePasswordChange("newPassword");
      });

      expectChangePasswordCalled(mockChangePasswordMutation.mutateAsync, expect.any(FormData));
    });

    it("dado que se cambia la contraseña exitosamente, cuando se llama handlePasswordChange, entonces muestra notificación de éxito", async () => {
      mockChangePasswordMutation.mutateAsync.mockResolvedValue({});

      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.handlePasswordChange("newPassword");
      });

      expectSuccessToast("¡Contraseña cambiada exitosamente!");
    });

    it("dado que falla el cambio de contraseña, cuando se llama handlePasswordChange, entonces muestra mensaje de error", async () => {
      const mockError = { message: "Contraseña incorrecta" };
      mockChangePasswordMutation.mutateAsync.mockRejectedValue(mockError);

      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      try {
        await act(async () => {
          await result.current.handlePasswordChange("wrongPassword");
        });
      } catch (error) {
      }

      expectErrorToast("Contraseña incorrecta");
    });
  });
});