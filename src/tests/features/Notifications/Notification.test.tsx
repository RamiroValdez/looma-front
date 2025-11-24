import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Notifications from "../../../app/features/Notifications/Notifications";
import * as useNotificationsModule from "../../../app/hooks/useNotifications";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("Componente Notifications", () => {
  const setFilter = vi.fn();
  const handleMarkAsRead = vi.fn();
  const setNotifications = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function mockUseNotifications({
    loading = false,
    filter = "all" as "all" | "unread",
    sorted = [],
  }: {
    loading?: boolean;
    filter?: "all" | "unread";
    sorted?: any[];
  } = {}) {
    vi.spyOn(useNotificationsModule, "useNotifications").mockReturnValue({
      loading,
      filter,
      setFilter,
      sorted,
      handleMarkAsRead,
      setNotifications,
      notifications: sorted,
    });
  }

  it("muestra el spinner de carga cuando loading es true", () => {
    mockUseNotifications({ loading: true });
    const { container } = renderWithRouter(<Notifications />);
    const spinner = container.querySelector("svg.animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("muestra el mensaje vacío cuando no hay notificaciones", () => {
    mockUseNotifications({ loading: false, sorted: [] });
    renderWithRouter(<Notifications />);
    expect(screen.getByText(/No tienes notificaciones/i)).toBeInTheDocument();
  });

  it("muestra una notificación en la lista", () => {
    const notif = {
      id: 1,
      type: "WORK_UPDATED",
      message: "Obra actualizada test",
      read: false,
      createdAt: new Date().toISOString(),
      relatedWork: 123,
    };
    mockUseNotifications({ sorted: [notif] });
    renderWithRouter(<Notifications />);
    expect(screen.getByText("Obra actualizada")).toBeInTheDocument();
    expect(screen.getByText("Obra actualizada test")).toBeInTheDocument();
  });

  it("llama a setFilter con 'unread' al hacer click en el botón 'No leídas'", () => {
    mockUseNotifications({ filter: "all" });
    renderWithRouter(<Notifications />);
    fireEvent.click(screen.getByText("No leídas"));
    expect(setFilter).toHaveBeenCalledWith("unread");
  });

  it("llama a setFilter con 'all' al hacer click en el botón 'Todas'", () => {
    mockUseNotifications({ filter: "unread" });
    renderWithRouter(<Notifications />);
    fireEvent.click(screen.getByText("Todas"));
    expect(setFilter).toHaveBeenCalledWith("all");
  });

  it("llama a handleMarkAsRead al hacer click en una notificación no leída", () => {
    const notif = {
      id: 2,
      type: "NEW_WORK_PUBLISHED",
      message: "Nueva obra publicada test",
      read: false,
      createdAt: new Date().toISOString(),
      relatedWork: 456,
    };
    mockUseNotifications({ sorted: [notif] });
    renderWithRouter(<Notifications />);
    fireEvent.click(screen.getByText("Nueva obra publicada"));
    expect(handleMarkAsRead).toHaveBeenCalledWith(2);
  });

  it("no llama a handleMarkAsRead al hacer click en una notificación ya leída", () => {
    const notif = {
      id: 3,
      type: "NEW_AUTHOR_SUBSCRIBER",
      message: "Nuevo suscriptor de autor",
      read: true,
      createdAt: new Date().toISOString(),
    };
    mockUseNotifications({ sorted: [notif] });
    renderWithRouter(<Notifications />);
    fireEvent.click(screen.getAllByText("Nuevo suscriptor de autor")[0]);
    expect(handleMarkAsRead).not.toHaveBeenCalled();
  });

  it("navega a la obra al hacer click en el botón 'Ver obra'", () => {
    const notif = {
      id: 4,
      type: "NEW_WORK_SUBSCRIBER",
      message: "Nueva suscripción a tu obra",
      read: false,
      createdAt: new Date().toISOString(),
      relatedWork: 789,
    };
    mockUseNotifications({ sorted: [notif] });
    renderWithRouter(<Notifications />);
    fireEvent.click(screen.getByText("Ver obra"));
    expect(mockNavigate).toHaveBeenCalledWith("/work/789");
  });

  it("muestra la etiqueta 'leída' para notificaciones leídas", () => {
    const notif = {
      id: 5,
      type: "WORK_UPDATED",
      message: "Obra actualizada test",
      read: true,
      createdAt: new Date().toISOString(),
    };
    mockUseNotifications({ sorted: [notif] });
    renderWithRouter(<Notifications />);
    expect(screen.getByText("leída")).toBeInTheDocument();
  });

  it("muestra el título correcto para cada tipo de notificación", () => {
    const types = [
      { type: "WORK_UPDATED", title: "Obra actualizada" },
      { type: "NEW_WORK_PUBLISHED", title: "Nueva obra publicada" },
      { type: "NEW_WORK_SUBSCRIBER", title: "Nueva suscripción a tu obra" },
      { type: "NEW_AUTHOR_SUBSCRIBER", title: "Nuevo suscriptor de autor" },
      { type: "NEW_CHAPTER_SUBSCRIBER", title: "Nuevo suscriptor de capítulo" },
      { type: "UNKNOWN_TYPE", title: "Notificación" },
    ];
    types.forEach(({ type, title }) => {
      mockUseNotifications({
        sorted: [
          {
            id: 10,
            type,
            message: "msg",
            read: false,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    
      renderWithRouter(<Notifications />);
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });
});