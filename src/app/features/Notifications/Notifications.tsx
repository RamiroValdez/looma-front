import { useEffect, useState } from "react";
import { getUserNotifications, markNotificationAsRead } from "../../../infrastructure/services/NotificationService";
import { getCurrentUser } from "../../../infrastructure/services/DataUserService";
import type { NotificationDTO } from "../../../domain/dto/NotificationDTO";
import type { UserDTO } from "../../../domain/dto/UserDTO";

function Notifications() {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!user) return;
    getUserNotifications(Number(user.id))
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, [user]);

  // Ordena por fecha descendente
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Marcar como leída local y en backend
  const handleMarkAsRead = async (notificationId: number) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    try {
      await markNotificationAsRead(notificationId);
    } catch (err) {

    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4 min-h-screen pb-24">
      <h1 className="text-2xl font-bold mb-6">Notificaciones</h1>
      <div className="flex flex-col gap-4">
        {sorted.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No tienes notificaciones.
          </div>
        ) : (
          sorted.map((n) => (
            <div
              key={n.id}
              className={`rounded-lg border px-5 py-4 flex gap-3 items-start transition-all duration-150 cursor-pointer
                ${n.read
                  ? "bg-white opacity-70 shadow-none"
                  : "bg-gray-100 shadow-lg border-[#5c17a6] hover:bg-[#f7f4fb] hover:border-[#a17ae7]"}
              `}
              onClick={() => {
                if (!n.read) handleMarkAsRead(n.id);
              }}
            >
              <img
                src="/img/loomaNotif.png"
                alt="Notificación"
                className="w-14 h-14 rounded-full object-cover border border-gray-200 flex-shrink-0"
                style={{ background: "#f7f4fb" }}
              />
              <div className="flex flex-col flex-1">
                <span className={`font-semibold text-[#3c2a50] mb-1 ${n.read ? "opacity-60" : ""}`}>
                  {n.message}
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6l4 2"
                    />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" />
                  </svg>
                  {new Date(n.createdAt).toLocaleString()}
                   {n.read && (
          <span className="flex items-center gap-1 ml-auto text-[#5c17a6] font-semibold">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M5 10.5L9 14.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>leída</span>
          </span>
        )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;