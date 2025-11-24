import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotificationPopup from "../../app/components/NotificationPopup";
import * as NotificationService from "../../infrastructure/services/NotificationService";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockMarkNotificationAsRead = vi.spyOn(NotificationService, "markNotificationAsRead");

const baseNotification = {
  id: 1,
  type: "WORK_UPDATED",
  createdAt: new Date().toISOString(),
  read: false,
};

function renderPopup(props: any) {
  return render(
    <MemoryRouter>
      <NotificationPopup {...props} />
    </MemoryRouter>
  );
}

function expectReadIcon(container: HTMLElement) {
  const readIcon = container.querySelector('svg[width="14"][height="14"]');
  expect(readIcon).toBeInTheDocument();
}

describe("Componente NotificationPopup", () => {
  const onClose = vi.fn();
  const onMarkAsReadLocal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockMarkNotificationAsRead.mockResolvedValue(true);
  });

  it("no renderiza nada si show es false", () => {
    const { container } = renderPopup({
      show: false,
      onClose,
      notifications: [],
      onMarkAsReadLocal,
    });
    expect(container.firstChild).toBeNull();
  });

  it("muestra mensaje de 'No tienes notificaciones' si la lista está vacía", () => {
    renderPopup({
      show: true,
      onClose,
      notifications: [],
      onMarkAsReadLocal,
    });

    expect(screen.getByText(/no tienes notificaciones/i)).toBeInTheDocument();
  });

  it("muestra el título de la notificación según el tipo", () => {
    const notification = { ...baseNotification, type: "NEW_WORK_PUBLISHED" };
    renderPopup({
      show: true,
      onClose,
      notifications: [notification],
      onMarkAsReadLocal,
    });
    expect(screen.getByText("Nueva obra publicada")).toBeInTheDocument();
  });

  it("muestra la fecha de la notificación", () => {
    const notification = { ...baseNotification, createdAt: "2023-01-01T12:00:00Z" };
    renderPopup({
      show: true,
      onClose,
      notifications: [notification],
      onMarkAsReadLocal,
    });
    expect(screen.getByText((content) => content.includes("2023"))).toBeInTheDocument();
  });

  it("llama a onClose al hacer click fuera del popup", () => {
    renderPopup({
      show: true,
      onClose,
      notifications: [baseNotification],
      onMarkAsReadLocal,
    });
    fireEvent.mouseDown(document);
    expect(onClose).toHaveBeenCalled();
  });

  it("llama a markNotificationAsRead y onMarkAsReadLocal al hacer click en una no leída", async () => {
    renderPopup({
      show: true,
      onClose,
      notifications: [{ ...baseNotification, read: false }],
      onMarkAsReadLocal,
    });
    const item = screen.getByText("Obra actualizada").closest("li")!;
    fireEvent.mouseDown(item);
    await waitFor(() => {
      expect(mockMarkNotificationAsRead).toHaveBeenCalledWith(baseNotification.id);
      expect(onMarkAsReadLocal).toHaveBeenCalledWith(baseNotification.id);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("no llama a markNotificationAsRead si la notificación ya está leída", async () => {
    renderPopup({
      show: true,
      onClose,
      notifications: [{ ...baseNotification, read: true }],
      onMarkAsReadLocal,
    });
    const item = screen.getByText("Obra actualizada").closest("li")!;
    fireEvent.mouseDown(item);
    await waitFor(() => {
      expect(mockMarkNotificationAsRead).not.toHaveBeenCalled();
      expect(onMarkAsReadLocal).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("muestra el icono y texto 'leída' si la notificación está leída", () => {
    const { container } = renderPopup({
      show: true,
      onClose,
      notifications: [{ ...baseNotification, read: true }],
      onMarkAsReadLocal,
    });
    expect(screen.getByText(/leída/i)).toBeInTheDocument();
    expectReadIcon(container);
  });

  it("muestra el botón 'Ver todas' si hay más de 5 notificaciones", () => {
    const notifications = Array.from({ length: 6 }, (_, i) => ({
      ...baseNotification,
      id: i + 1,
      createdAt: new Date(Date.now() - i * 1000 * 60).toISOString(),
    }));
    renderPopup({
      show: true,
      onClose,
      notifications,
      onMarkAsReadLocal,
    });
    expect(screen.getByText(/ver todas/i)).toBeInTheDocument();
  });

  it("llama a onClose al hacer click en 'Ver todas'", () => {
    const notifications = Array.from({ length: 6 }, (_, i) => ({
      ...baseNotification,
      id: i + 1,
      createdAt: new Date(Date.now() - i * 1000 * 60).toISOString(),
    }));
    renderPopup({
      show: true,
      onClose,
      notifications,
      onMarkAsReadLocal,
    });
    const btn = screen.getByText(/ver todas/i);
    fireEvent.mouseDown(btn);
    expect(onClose).toHaveBeenCalled();
  });
});