import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "../../app/components/Header";
import * as DataUserService from "../../infrastructure/services/DataUserService";
import * as NotificationService from "../../infrastructure/services/NotificationService";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();
const mockLogout = vi.fn();
const mockClearUser = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: (props: any) => <a {...props} />,
  };
});

vi.mock("../../infrastructure/store/AuthStore", () => ({
  useAuthStore: () => ({
    token: "token",
    logout: mockLogout,
  }),
}));

vi.mock("../../infrastructure/store/UserStorage", () => ({
  useUserStore: () => ({
    clearUser: mockClearUser,
  }),
}));

vi.mock("../../app/hooks/useClickOutside", () => ({
  useClickOutside: vi.fn(),
}));

vi.mock("../../infrastructure/services/DataUserService", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("../../infrastructure/services/NotificationService", () => ({
  getUserNotifications: vi.fn(),
}));

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
}

describe("Componente Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (DataUserService.getCurrentUser as any).mockResolvedValue({
      id: 1,
      name: "Test User",
      image: "/img/perfil.png",
    });
    (NotificationService.getUserNotifications as any).mockResolvedValue([]);
  });

  it("muestra el logo y navega al hacer click", () => {
    renderHeader();
    const logo = screen.getAllByAltText(/looma logo/i)[0];
    fireEvent.click(logo);
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("muestra los enlaces de navegación", () => {
    renderHeader();
    expect(screen.getAllByText("Inicio")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Explorar")[0]).toBeInTheDocument();
  });

  it("muestra el input de búsqueda y permite escribir (desktop)", () => {
    renderHeader();
    const inputs = screen.getAllByPlaceholderText(/buscar/i);
    const input = inputs.find(i => i.getAttribute("placeholder")?.includes("título"))!;
    fireEvent.change(input, { target: { value: "algo" } });
    expect(input).toHaveValue("algo");
  });

  it("muestra el input de búsqueda y permite escribir (mobile)", () => {
    renderHeader();
    const inputs = screen.getAllByPlaceholderText(/buscar/i);

    const input = inputs.find(i => i.getAttribute("placeholder") === "Buscar...")!;
    fireEvent.change(input, { target: { value: "algo" } });
    expect(input).toHaveValue("algo");
  });

  it("navega al buscar y presionar Enter (desktop)", () => {
    renderHeader();
    const inputs = screen.getAllByPlaceholderText(/buscar/i);
    const input = inputs.find(i => i.getAttribute("placeholder")?.includes("título"))!;
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockNavigate).toHaveBeenCalledWith("/explore?q=test");
  });

  it("navega al buscar y presionar Enter (mobile)", () => {
    renderHeader();
    const inputs = screen.getAllByPlaceholderText(/buscar/i);
    const input = inputs.find(i => i.getAttribute("placeholder") === "Buscar...")!;
    fireEvent.change(input, { target: { value: "mobile" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(mockNavigate).toHaveBeenCalledWith("/explore?q=mobile");
  });

  it("muestra el botón de notificaciones", () => {
    renderHeader();
    expect(screen.getAllByLabelText(/notificaciones/i)[0]).toBeInTheDocument();
  });

  it("muestra el contador de notificaciones no leídas si hay", async () => {
    (NotificationService.getUserNotifications as any).mockResolvedValue([
      { id: 1, read: false },
      { id: 2, read: true },
    ]);
    renderHeader();
    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  it("muestra los botones de login y registro si no hay usuario", async () => {
    (DataUserService.getCurrentUser as any).mockResolvedValue(null);
    renderHeader();
    await waitFor(() => {
      expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
      expect(screen.getByText(/registrarse/i)).toBeInTheDocument();
    });
  });

  it("muestra el menú móvil y permite abrirlo", () => {
    renderHeader();
    const menuBtn = screen.getAllByText("☰")[0];
    fireEvent.click(menuBtn);
    expect(screen.getAllByText("Inicio")[1]).toBeInTheDocument();
    expect(screen.getAllByText("Explorar")[1]).toBeInTheDocument();
  });

  it("no muestra el menú de perfil si no hay usuario", () => {
    (DataUserService.getCurrentUser as any).mockResolvedValue(null);
    renderHeader();
    expect(screen.queryByAltText(/perfil/i)).not.toBeInTheDocument();
  });

  it("no muestra el botón de publicar si no hay usuario (mobile)", () => {
    (DataUserService.getCurrentUser as any).mockResolvedValue(null);
    renderHeader();
    const menuBtn = screen.getAllByText("☰")[0];
    fireEvent.click(menuBtn);
    expect(screen.queryByText("Publicar")).not.toBeInTheDocument();
  });

  it("muestra el menú de perfil y permite abrirlo (mocked img)", async () => {
    renderHeader();
    await waitFor(() => {
      const perfilImgs = screen.queryAllByAltText(/perfil/i);
      if (perfilImgs.length === 0) throw new Error("No perfil img yet");
    });
    const perfil = screen.getAllByAltText(/perfil/i)[0];
    fireEvent.click(perfil);
    await waitFor(() => {
      expect(screen.getByText(/mi perfil/i)).toBeInTheDocument();
      expect(screen.getByText(/suscripciones/i)).toBeInTheDocument();
      expect(screen.getByText(/guardados/i)).toBeInTheDocument();
      expect(screen.getByText(/cerrar sesión/i)).toBeInTheDocument();
    });
  });

  it("cierra sesión y limpia usuario al hacer click en cerrar sesión (mocked img)", async () => {
    renderHeader();
    await waitFor(() => {
      const perfilImgs = screen.queryAllByAltText(/perfil/i);
      if (perfilImgs.length === 0) throw new Error("No perfil img yet");
    });
    const perfil = screen.getAllByAltText(/perfil/i)[0];
    fireEvent.click(perfil);
    const cerrarSesion = await screen.findByText(/cerrar sesión/i);
    fireEvent.click(cerrarSesion);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockClearUser).toHaveBeenCalled();
  });

  it("cierra el menú móvil al navegar", () => {
    renderHeader();
    const menuBtn = screen.getAllByText("☰")[0];
    fireEvent.click(menuBtn);
    const inicio = screen.getAllByText("Inicio")[1];
    fireEvent.click(inicio);
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });


  it("muestra la imagen de perfil por defecto si la imagen es /none", async () => {
    (DataUserService.getCurrentUser as any).mockResolvedValue({
      id: 1,
      name: "Test User",
      image: "/img/none",
    });
    renderHeader();
    await waitFor(() => {
      const perfilImgs = screen.getAllByAltText(/perfil/i);
      expect(perfilImgs[0]).toHaveAttribute("src", "/img/perfil.png");
    });
  });

  it("muestra la imagen de perfil del usuario si existe", async () => {
    (DataUserService.getCurrentUser as any).mockResolvedValue({
      id: 1,
      name: "Test User",
      image: "/img/real.png",
    });
    renderHeader();
    await waitFor(() => {
      const perfilImgs = screen.getAllByAltText(/perfil/i);
      expect(perfilImgs[0]).toHaveAttribute("src", "/img/real.png");
    });
  });

  it("navega a /explore al hacer click en Explorar", () => {
    renderHeader();
    fireEvent.click(screen.getAllByText("Explorar")[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/explore");
  });

  it("navega a /home al hacer click en Inicio", () => {
    renderHeader();
    fireEvent.click(screen.getAllByText("Inicio")[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("abre y cierra el popup de notificaciones", () => {
    renderHeader();
    const notifBtn = screen.getAllByLabelText(/notificaciones/i)[0];
    fireEvent.mouseDown(notifBtn);
    fireEvent.mouseDown(notifBtn);
  });
});