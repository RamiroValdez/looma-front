import { useEffect, useRef } from "react";
import type { NotificationDTO } from "../../domain/dto/NotificationDTO";
import { useNavigate } from "react-router-dom";
import { markNotificationAsRead } from "../../infrastructure/services/NotificationService";

interface NotificationPopupProps {
  show: boolean;
  onClose: () => void;
  notifications: NotificationDTO[];
  onMarkAsReadLocal: (notificationId: number) => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  show,
  onClose,
  notifications,
  onMarkAsReadLocal,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!show) return;
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

  if (!show) return null;

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const topFive = sorted.slice(0, 5);

  return (
    <div
      ref={popupRef}
      className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#5c17a6] rounded-xl shadow-2xl z-20 p-0 animate-fade-in"
      style={{ minHeight: "120px" }}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#ece6f6] rounded-t-xl bg-[#f7f4fb]">
        <svg
          className="w-6 h-6 text-[#5c17a6]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
          />
        </svg>
        <span className="font-semibold text-[#3c2a50] text-lg">Notificaciones</span>
      </div>
      {topFive.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4 px-4">
          <span className="text-[#5c17a6] text-base font-medium text-center">
            No tienes notificaciones
          </span>
        </div>
      ) : (
        <>
          <ul className="max-h-64 overflow-y-auto">
            {topFive.map((n, idx) => (
              <li
                key={n.id}
                className={`py-3 px-4 ${
                  idx !== topFive.length - 1 ? "border-b border-[#ece6f6]" : ""
                } hover:bg-[#f7f4fb] transition-colors cursor-pointer`}
                onMouseDown={async (e) => {
                  e.stopPropagation();
                  if (!n.read) {
                    try {
                      await markNotificationAsRead(n.id);
                      onMarkAsReadLocal(n.id);
                    } catch (err) {
                    }
                  }
                  onClose();
                  navigate("/notifications");
                }}
              >
                <span
                  className={`text-[#3c2a50] font-medium ${
                    n.read ? "opacity-60" : ""
                  }`}
                >
                  {n.message}
                </span>
                <div className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
          {notifications.length > 5 && (
            <button
              className="w-full py-2 text-[#5c17a6] font-semibold hover:underline bg-[#f7f4fb] rounded-b-xl cursor-pointer"
              onMouseDown={(e) => {
                e.stopPropagation();
                onClose();
                navigate("/notifications");
              }}
            >
              Ver todas
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationPopup;