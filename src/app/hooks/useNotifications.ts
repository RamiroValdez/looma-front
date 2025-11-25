import { useEffect, useState } from "react";
import { getUserNotifications, markNotificationAsRead } from "../../infrastructure/services/NotificationService";
import { getCurrentUser } from "../../infrastructure/services/DataUserService";
import type { NotificationDTO } from "../../domain/dto/NotificationDTO";
import type { UserDTO } from "../../domain/dto/UserDTO";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getUserNotifications(Number(user.id))
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleMarkAsRead = async (notificationId: number) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    try {
      await markNotificationAsRead(notificationId);
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (err) { console.error('Error marcando notificación como leída', err); }
  };

  const filtered = notifications.filter(n => filter === "all" || !n.read);
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    notifications,
    setNotifications,
    loading,
    filter,
    setFilter,
    sorted,
    handleMarkAsRead,
  };
}