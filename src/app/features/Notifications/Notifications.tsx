import { useNotifications } from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const {
    loading,
    filter,
    setFilter,
    sorted,
    handleMarkAsRead,
  } = useNotifications();
  const navigate = useNavigate();

  function getNotificationTitle(type: string) {
    switch (type) {
      case "WORK_UPDATED":
        return "Obra actualizada";
      case "NEW_WORK_PUBLISHED":
        return "Nueva obra publicada";
      case "NEW_WORK_SUBSCRIBER":
        return "Nueva suscripción a tu obra";
      case "NEW_AUTHOR_SUBSCRIBER":
        return "Nuevo suscriptor de autor";
      case "NEW_CHAPTER_SUBSCRIBER":
        return "Nuevo suscriptor de capítulo";
      default:
        return "Notificación";
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4 min-h-screen pb-24">
      <h1 className="text-2xl font-bold mb-6">Notificaciones</h1>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition ${filter === "all" ? "bg-[#5c17a6] text-white" : "bg-gray-100 text-[#5c17a6] hover:bg-[#ede4f9]"}`}
          onClick={() => setFilter("all")}
        >
          Todas
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition ${filter === "unread" ? "bg-[#5c17a6] text-white" : "bg-gray-100 text-[#5c17a6] hover:bg-[#ede4f9]"}`}
          onClick={() => setFilter("unread")}
        >
          No leídas
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-[#5c17a6]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No tienes notificaciones.
          </div>
        ) : (
          sorted.map((n) => (
            <div
              key={n.id}
              className={`rounded-lg border border-[#172fa6] px-5 py-4 flex gap-3 items-start transition-all duration-150 cursor-pointer
                ${n.read
                  ? "bg-white opacity-70 shadow-none"
                  : "bg-gray-100 shadow-lg border-[#5c17a6] hover:bg-[#f7f4fb] hover:border-[#a17ae7]"}`}
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
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-bold text-[#5c17a6] ${n.read ? "opacity-60" : ""}`}>
                    {getNotificationTitle(n.type)}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
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
                  </div>
                </div>
                <span className={`text-[#3c2a50] mb-1 ${n.read ? "opacity-60" : ""}`}>
                  {n.message}
                </span>
                {n.type === "NEW_WORK_SUBSCRIBER" && n.relatedWork && (
                  <button
                    className="text-xs text-[#5c17a6] underline mb-1 w-fit"
                    onClick={() => navigate(`/work/${n.relatedWork}`)}
                  >
                    Ver obra
                  </button>
                )}
                {n.type === "WORK_UPDATED" && n.relatedWork && (
                  <button
                    className="text-xs text-[#5c17a6] underline mb-1 w-fit"
                    onClick={() => navigate(`/work/${n.relatedWork}`)}
                  >
                    Ver obra actualizada
                  </button>
                )}
                {n.type === "NEW_CHAPTER_SUBSCRIBER" && n.relatedChapter && (
                  <button
                    className="text-xs text-[#5c17a6] underline mb-1 w-fit"
                    onClick={() => navigate(`/work/${n.relatedWork}`)}
                  >
                    Ver obra
                  </button>
                )}
                {n.type === "NEW_WORK_PUBLISHED" && n.relatedWork && (
                  <button
                    className="text-xs text-[#5c17a6] underline mb-1 w-fit"
                    onClick={() => navigate(`/work/${n.relatedWork}`)}
                  >
                    Ver nueva obra
                  </button>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {n.read && (
                    <span className="flex items-center gap-1 ml-auto text-[#5c17a6] font-semibold">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                        <path d="M5 10.5L9 14.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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