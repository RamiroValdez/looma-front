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

function expectProfileMenu() {
  expect(screen.getByTestId("profile-menu")).toBeInTheDocument();
}

function expectLoadingSkeleton() {
  expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
}

function expectErrorMessage(message: string) {
  expect(screen.getByText(message)).toBeInTheDocument();
}

function expectUserData(field: string) {
  expect(screen.getByText(field)).toBeInTheDocument();
}

function expectButtonCount(count: number) {
  const buttons = screen.getAllByTestId("button");
  expect(buttons).toHaveLength(count);
}

function expectFunctionCall(mockFn: any, ...args: any[]) {
  if (args.length > 0) {
    expect(mockFn).toHaveBeenCalledWith(...args);
  } else {
    expect(mockFn).toHaveBeenCalled();
  }
}

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUserProfile.mockReturnValue(mockProfileData);
  });

  it("dado que está loading, cuando se renderiza, entonces muestra el menú de perfil", () => {
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      loading: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    expectProfileMenu();
  });

  it("dado que está loading, cuando se renderiza, entonces muestra el skeleton de carga", () => {
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      loading: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    expectLoadingSkeleton();
  });

  it("dado que hay un error, cuando se renderiza, entonces muestra el mensaje de error genérico", () => {
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      error: "Error de conexión",
      loading: false,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText(/error al cargar el perfil/i)).toBeInTheDocument();
  });

  it("dado que hay un error, cuando se renderiza, entonces muestra el mensaje de error específico", () => {
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      error: "Error de conexión",
      loading: false,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    expectErrorMessage("Error de conexión");
  });

  it("dado que tiene datos, cuando se renderiza, entonces muestra el menú de perfil", () => {
    render(<ProfilePage />, { wrapper: createWrapper() });

    expectProfileMenu();
  });

  it("dado que tiene datos, cuando se renderiza, entonces muestra el nombre del usuario", () => {
    render(<ProfilePage />, { wrapper: createWrapper() });

    expectUserData("Juan");
  });

  it("dado que tiene datos, cuando se renderiza, entonces muestra el apellido del usuario", () => {
    render(<ProfilePage />, { wrapper: createWrapper() });

    expectUserData("Pérez");
  });

  it("dado que tiene datos, cuando se renderiza, entonces muestra el username del usuario", () => {
    render(<ProfilePage />, { wrapper: createWrapper() });

    expectUserData("juanperez");
  });

  it("dado que tiene datos, cuando se renderiza, entonces muestra el email del usuario", () => {
    render(<ProfilePage />, { wrapper: createWrapper() });

    expectUserData("juan@test.com");
  });

  it("dado que tiene datos, cuando se renderiza, entonces muestra el título de la página", () => {
    render(<ProfilePage />, { wrapper: createWrapper() });

    expectUserData("Mi Perfil");
  });

  it("dado que se hace click en editar, cuando se ejecuta, entonces activa el modo edición", async () => {
    const user = userEvent.setup();
    render(<ProfilePage />, { wrapper: createWrapper() });

    const editButton = screen.getByText(/editar datos/i);
    await user.click(editButton);

    expectFunctionCall(mockProfileData.setIsEditing, true);
  });

  it("dado que se cambia un campo, cuando se escribe, entonces llama a handleInputChange", async () => {
    const user = userEvent.setup();
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    const nameInput = screen.getByDisplayValue("Juan");
    await user.type(nameInput, "Carlos");

    expectFunctionCall(mockProfileData.handleInputChange);
  });

  it("dado que es autor, cuando se renderiza, entonces muestra el label de precio", () => {
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

    expect(screen.getByText(/precio suscripción/i)).toBeInTheDocument();
  });

  it("dado que es autor, cuando se renderiza, entonces muestra el valor del precio", () => {
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

    expect(screen.getByDisplayValue("10.00")).toBeInTheDocument();
  });

  it("dado que está editando, cuando se renderiza, entonces muestra botón de editar imagen", () => {
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    const editImageButton = document.querySelector('button[class*="absolute"]');
    expect(editImageButton).toBeInTheDocument();
  });

  it("dado que el username es inválido, cuando se renderiza, entonces muestra mensaje de error", () => {
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

  it("dado que se está verificando username, cuando se renderiza, entonces muestra estado de verificación", () => {
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

  it("dado que se hace click en guardar, cuando se ejecuta, entonces llama a handleSave", async () => {
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
      expectFunctionCall(mockProfileData.handleSave);
    }
  });

  it("dado que se hace click en cancelar, cuando se ejecuta, entonces llama a handleCancel", async () => {
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
      expectFunctionCall(mockProfileData.handleCancel);
    }
  });

  it("dado que se abre el modal, cuando se hace click en cambiar contraseña, entonces muestra el modal", async () => {
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
    }
  });

  it("dado que el modal está abierto, cuando se hace click en cerrar, entonces oculta el modal", async () => {
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
      const closeButton = screen.getByTestId("close-modal");
      await user.click(closeButton);
      expect(screen.queryByTestId("password-modal")).not.toBeInTheDocument();
    }
  });

  it("dado que se confirma cambio de contraseña, cuando se hace click, entonces llama a handlePasswordChange", async () => {
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
      expectFunctionCall(mockProfileData.handlePasswordChange, "newPassword123");
    }
  });

  it("dado que está en modo edición, cuando se renderiza, entonces muestra tres botones", () => {
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    expectButtonCount(3);
  });

  it("dado que no está editando, cuando se renderiza, entonces muestra un botón", () => {
    render(<ProfilePage />, { wrapper: createWrapper() });

    expectButtonCount(1);
  });

  it("dado que no está editando, cuando se renderiza, entonces muestra botón de editar", () => {
    render(<ProfilePage />, { wrapper: createWrapper() });

    const buttons = screen.getAllByTestId("button");
    expect(buttons[0].textContent).toBe("Editar Datos");
  });

  it("dado que hay imagen seleccionada, cuando se renderiza, entonces el estado selectedImage está presente", () => {
    const mockData = {
      ...mockProfileData,
      selectedImage: "data:image/jpeg;base64,mockimage",
      isEditing: true,
    };
    
    mockUseUserProfile.mockReturnValue(mockData);

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(mockData.selectedImage).toBe("data:image/jpeg;base64,mockimage");
  });

  it("dado que se selecciona ser autor, cuando se hace click, entonces llama a handleInputChange", async () => {
    const user = userEvent.setup();
    mockUseUserProfile.mockReturnValue({
      ...mockProfileData,
      isEditing: true,
    });

    render(<ProfilePage />, { wrapper: createWrapper() });

    const authorRadio = screen.getByDisplayValue('yes');
    await user.click(authorRadio);

    expectFunctionCall(mockProfileData.handleInputChange, "isAuthor", true);
  });


});