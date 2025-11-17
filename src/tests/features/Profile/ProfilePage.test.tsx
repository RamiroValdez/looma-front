import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from '../../../app/features/Profile/ProfilePage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

const mockUseUserProfile = vi.fn();
vi.mock('../../../app/hooks/useUserProfile', () => ({
  useUserProfile: () => mockUseUserProfile(),
}));

vi.mock('../../../app/features/Profile/components/ProfileMenu', () => ({
  default: () => <div data-testid="profile-menu">Profile Menu</div>,
}));

vi.mock('../../../app/components/Button', () => ({
  default: ({ onClick, children, disabled, className, text }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={className}
      data-testid="button"
    >
      {children || text}
    </button>
  ),
}));

vi.mock('../../../app/components/GradientSection', () => ({
  default: ({ children }: any) => <div data-testid="gradient-section">{children}</div>,
}));

vi.mock('../../../app/features/Profile/components/PasswordChangeModal', () => ({
  default: ({ isOpen, onClose, onPasswordChange }: any) => (
    isOpen ? (
      <div data-testid="password-modal">
        <button onClick={onClose} data-testid="close-modal">Cerrar</button>
        <button 
          onClick={() => onPasswordChange("newPassword123")} 
          data-testid="change-password"
        >
          Cambiar Contraseña
        </button>
      </div>
    ) : null
  ),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const mockProfileData = {
  profile: {
    id: 1,
    name: "Juan",
    surname: "Pérez",
    username: "juanperez",
    email: "juan@test.com",
    image: "avatar.jpg",
    isAuthor: false,
    price: null,
  },
  loading: false,
  error: null,
  isEditing: false,
  editedData: {
    firstName: "Juan",
    lastName: "Pérez",
    username: "juanperez", 
    isAuthor: false,
    price: "",
  },
  selectedImage: null,
  usernameValidation: {
    isValid: null,
    isChecking: false,
  },
  setIsEditing: vi.fn(),
  handleInputChange: vi.fn(),
  handleImageChange: vi.fn(),
  handleSave: vi.fn(),
  handleCancel: vi.fn(),
  handlePasswordChange: vi.fn(),
};

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUserProfile.mockReturnValue(mockProfileData);
  });

  it("muestra el skeleton de carga cuando está loading", () => {
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      loading: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("profile-menu")).toBeInTheDocument();
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it("muestra mensaje de error cuando hay un error", () => {
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      error: "Error de conexión",
      loading: false,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText(/error al cargar el perfil/i)).toBeInTheDocument();
    expect(screen.getByText("Error de conexión")).toBeInTheDocument();
  });

  it("renderiza correctamente los datos del perfil", () => {
    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("profile-menu")).toBeInTheDocument();
    expect(screen.getByText("Juan")).toBeInTheDocument();
    expect(screen.getByText("Pérez")).toBeInTheDocument();
    expect(screen.getByText("juanperez")).toBeInTheDocument();
    expect(screen.getByText("juan@test.com")).toBeInTheDocument();
    expect(screen.getByText("Mi Perfil")).toBeInTheDocument();
  });

  it("permite activar el modo edición", async () => {
    const user = userEvent.setup();
    render(<ProfilePage />, { wrapper: createWrapper() });

    const editButton = screen.getByText(/editar datos/i);
    await user.click(editButton);

    expect(mockProfileData.setIsEditing).toHaveBeenCalledWith(true);
  });

  it("llama a handleInputChange cuando se cambian los campos", async () => {
    const user = userEvent.setup();
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    const nameInput = screen.getByDisplayValue("Juan");
    await user.type(nameInput, "Carlos");

    expect(mockProfileData.handleInputChange).toHaveBeenCalledWith("firstName", expect.any(String));
    expect(mockProfileData.handleInputChange).toHaveBeenCalled();
  });

  it("muestra campos de autor cuando isAuthor es true", () => {
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      editedData: {
        ...mockProfileData.editedData,
        isAuthor: true,
        price: "10.00",
      },
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText(/precio por suscripción/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("10.00")).toBeInTheDocument();
  });

  it("permite seleccionar imagen de perfil", () => {
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    const editImageButton = document.querySelector('button[class*="absolute"]');
    expect(editImageButton).toBeInTheDocument();
  });

  it("muestra validación de username", () => {
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      usernameValidation: {
        isValid: false,
        isChecking: false,
      },
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText(/este nombre de usuario ya está en uso/i)).toBeInTheDocument();
  });

  it("muestra estado de verificación de username", () => {
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      usernameValidation: {
        isValid: null,
        isChecking: true,
      },
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText(/verificando disponibilidad/i)).toBeInTheDocument();
  });

  it("permite guardar los cambios", async () => {
    const user = userEvent.setup();
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    const buttons = screen.getAllByTestId("button");
    const saveButton = buttons.find(btn => btn.textContent === "Guardar");
    
    if (saveButton) {
      await user.click(saveButton);
      expect(mockProfileData.handleSave).toHaveBeenCalled();
    }
  });

  it("permite cancelar los cambios", async () => {
    const user = userEvent.setup();
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    const buttons = screen.getAllByTestId("button");
    const cancelButton = buttons.find(btn => btn.textContent === "Cancelar");
    
    if (cancelButton) {
      await user.click(cancelButton);
      expect(mockProfileData.handleCancel).toHaveBeenCalled();
    }
  });

  it("abre y cierra el modal de cambio de contraseña", async () => {
    const user = userEvent.setup();
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      isEditing: true,
    });
    
    render(<ProfilePage />, { wrapper: createWrapper() });

    const buttons = screen.getAllByTestId("button");
    const changePasswordButton = buttons.find(btn => btn.textContent === "Cambiar Contraseña");
    
    if (changePasswordButton) {
      await user.click(changePasswordButton);
      expect(screen.getByTestId("password-modal")).toBeInTheDocument();

      const closeButton = screen.getByTestId("close-modal");
      await user.click(closeButton);
      expect(screen.queryByTestId("password-modal")).not.toBeInTheDocument();
    }
  });

  it("maneja el cambio de contraseña a través del modal", async () => {
    const user = userEvent.setup();
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    const buttons = screen.getAllByTestId("button");
    const changePasswordButton = buttons.find(btn => btn.textContent === "Cambiar Contraseña");
    
    if (changePasswordButton) {
      await user.click(changePasswordButton);

      const changeButton = screen.getByTestId("change-password");
      await user.click(changeButton);

      expect(mockProfileData.handlePasswordChange).toHaveBeenCalledWith("newPassword123");
    }
  });

  it("muestra botones de guardar y cancelar cuando está en modo edición", () => {
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    const buttons = screen.getAllByTestId("button");
    expect(buttons).toHaveLength(3); 
    
    const texts = buttons.map(btn => btn.textContent);
    expect(texts).toContain("Guardar");
    expect(texts).toContain("Cancelar");
    expect(texts).toContain("Cambiar Contraseña");
  });

  it("muestra solo botón de editar cuando no está editando", () => {
    render(<ProfilePage />, { wrapper: createWrapper() });

    const buttons = screen.getAllByTestId("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0].textContent).toBe("Editar Datos");
  });

  it("muestra la imagen seleccionada cuando hay una nueva", () => {
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      selectedImage: "data:image/jpeg;base64,mockimage",
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'data:image/jpeg;base64,mockimage');
  });

  it("muestra el toggle de autor correctamente", async () => {
    const user = userEvent.setup();
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    const authorRadio = screen.getByDisplayValue('yes');
    await user.click(authorRadio);

    expect(mockProfileData.handleInputChange).toHaveBeenCalledWith("isAuthor", true);
  });

  it("muestra información del usuario cuando no está en modo edición", () => {
    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText("Juan")).toBeInTheDocument();
    expect(screen.getByText("Pérez")).toBeInTheDocument();
    expect(screen.getByText("juanperez")).toBeInTheDocument();
    expect(screen.getByText("juan@test.com")).toBeInTheDocument();
  });
});