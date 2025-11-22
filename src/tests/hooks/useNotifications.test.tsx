import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../../infrastructure/services/NotificationService", () => ({
  getUserNotifications: vi.fn(),
  markNotificationAsRead: vi.fn(),
}));
vi.mock("../../infrastructure/services/DataUserService", () => ({
  getCurrentUser: vi.fn(),
}));

import * as NotificationService from "../../infrastructure/services/NotificationService";
import * as DataUserService from "../../infrastructure/services/DataUserService";
import { useNotifications } from "../../app/hooks/useNotifications";

const mockUser = { id: 1, name: "Test" };
const mockNotifications = [
  { id: 1, read: false, createdAt: "2023-01-01", message: "Hola" },
  { id: 2, read: true, createdAt: "2023-01-02", message: "Mundo" },
];

type HookResult = { current: ReturnType<typeof useNotifications> };

function expectNotifications(result: HookResult, expected: any) {
  expect(result.current.notifications).toEqual(expected);
}
function expectLoading(result: HookResult, expected: boolean) {
  expect(result.current.loading).toBe(expected);
}
function expectSortedLength(result: HookResult, expected: number) {
  expect(result.current.sorted.length).toBe(expected);
}
function expectSortedFirstIsUnread(result: HookResult) {
  expect(result.current.sorted[0].read).toBe(false);
}
function expectUserNotificationsCalled() {
  expect(NotificationService.getUserNotifications).toHaveBeenCalledWith(mockUser.id);
}
function expectCurrentUserCalled() {
  expect(DataUserService.getCurrentUser).toHaveBeenCalled();
}
function expectMarkAsReadCalled(id: number) {
  expect(NotificationService.markNotificationAsRead).toHaveBeenCalledWith(id);
}
function expectNotificationRead(result: HookResult, id: number) {
  expect(result.current.notifications.find(n => n.id === id)?.read).toBe(true);
}
function expectDispatchEventCalled(dispatchSpy: any) {
  expect(dispatchSpy).toHaveBeenCalledWith(new Event("notifications-updated"));
}

describe("useNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (DataUserService.getCurrentUser as any).mockResolvedValue(mockUser);
    (NotificationService.getUserNotifications as any).mockResolvedValue(mockNotifications);
  });

  it("Dado un usuario logueado, cuando carga el hook, entonces obtiene el usuario", async () => {
    renderHook(() => useNotifications());
    await act(async () => {});
    expectCurrentUserCalled();
  });

  it("Dado un usuario logueado, cuando carga el hook, entonces obtiene las notificaciones", async () => {
    renderHook(() => useNotifications());
    await act(async () => {});
    expectUserNotificationsCalled();
  });

  it("Dado notificaciones cargadas, cuando carga el hook, entonces las notificaciones se guardan en el estado", async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});
    expectNotifications(result, mockNotifications);
  });

  it("Dado notificaciones cargadas, cuando carga el hook, entonces loading es false", async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});
    expectLoading(result, false);
  });

  it("Dado filtro 'unread', cuando se cambia el filtro, entonces solo hay una notificación no leída en sorted", async () => {
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});
    act(() => {
      result.current.setFilter("unread");
    });
    expectSortedLength(result, 1);
    expectSortedFirstIsUnread(result);
  });

  it("Dado una notificación, cuando se marca como leída, entonces se llama al servicio markNotificationAsRead", async () => {
    (NotificationService.markNotificationAsRead as any).mockResolvedValue({});
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});
    await act(async () => {
      await result.current.handleMarkAsRead(1);
    });
    expectMarkAsReadCalled(1);
  });

  it("Dado una notificación, cuando se marca como leída, entonces la notificación se marca como leída en el estado", async () => {
    (NotificationService.markNotificationAsRead as any).mockResolvedValue({});
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});
    await act(async () => {
      await result.current.handleMarkAsRead(1);
    });
    expectNotificationRead(result, 1);
  });

  it("Dado una notificación, cuando se marca como leída, entonces se dispara el evento 'notifications-updated'", async () => {
    (NotificationService.markNotificationAsRead as any).mockResolvedValue({});
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});
    await act(async () => {
      await result.current.handleMarkAsRead(1);
    });
    expectDispatchEventCalled(dispatchSpy);
    dispatchSpy.mockRestore();
  });

  it("Dado un error en getCurrentUser, cuando carga el hook, entonces notifications es un array vacío", async () => {
    (DataUserService.getCurrentUser as any).mockRejectedValueOnce(new Error("fail"));
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});
    expectNotifications(result, []);
  });

  it("Dado un error en getUserNotifications, cuando carga el hook, entonces notifications es un array vacío", async () => {
    (NotificationService.getUserNotifications as any).mockRejectedValueOnce(new Error("fail"));
    const { result } = renderHook(() => useNotifications());
    await act(async () => {});
    expectNotifications(result, []);
  });
});