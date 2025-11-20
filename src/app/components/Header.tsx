import { useState, useEffect, useRef } from 'react';
import { getCurrentUser } from '../../infrastructure/services/DataUserService';
import { Link } from "react-router-dom";
import { type UserDTO } from "../../domain/dto/UserDTO";
import { useAuthStore } from '../../domain/store/AuthStore';
import { useNavigate } from 'react-router-dom';
import { type KeyboardEvent } from 'react';
import NotificationPopup from "../components/NotificationPopup";
import { useClickOutside } from '../hooks/useClickOutside';
import { getUserNotifications } from "../../infrastructure/services/NotificationService";
import type { NotificationDTO } from "../../domain/dto/NotificationDTO";
import { useUserStore } from '../../domain/store/UserStorage';

function Header() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState<UserDTO | null>(null);

  const { token, logout } = useAuthStore();

  const [searchText, setSearchText] = useState('');

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRefDesktop = useRef<HTMLDivElement>(null!);
  const notificationRefMobile = useRef<HTMLDivElement>(null!);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const { clearUser } = useUserStore();

  useClickOutside(
    [notificationRefDesktop, notificationRefMobile],
    () => setShowNotifications(false),
    showNotifications
  );

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchText.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchText.trim())}`);
      setSearchText('');
    }
  };

  const handleMarkAsReadLocal = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  useEffect(() => {
    let alive = true;
    const run = async () => {
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const usr = await getCurrentUser();
        if (!alive) return;
        if (usr) {
          setUser(usr);
        } else {
          logout();
        }
      } catch (error) {
        console.error(error);
        if (!alive) return;
        logout();
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [token, logout]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
      const reload = () => {
    getUserNotifications(Number(user.id))
      .then(setNotifications)
      .catch(() => setNotifications([]));
  };
    getUserNotifications(Number(user.id))
      .then(setNotifications)
      .catch(() => setNotifications([]));
      window.addEventListener("notifications-updated", reload);
  return () => {
    window.removeEventListener("notifications-updated", reload);
  };
}, [user]);

useEffect(() => {
  setOpenMenu(false);
}, [user]);

  return (
    <header className="bg-[linear-gradient(to_right,#EBE4EC,#B597D2,#EDE4F9)] shadow relative z-[9999]">
      <div className="hidden md:flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img onClick={() => navigate("/home")} src="/img/loomaLogo.png" alt="LOOMA logo" className="h-8 w-auto object-contain cursor-pointer" />
          <nav className="flex items-center gap-4 ml-4">
            <a onClick={() => navigate("/home")} className="text-[#686868] hover:text-[#5c17a6] transition cursor-pointer">Inicio</a>
            <a onClick={() => navigate("/explore")} className="text-[#686868] hover:text-[#5c17a6] transition cursor-pointer">Explorar</a>
          </nav>
        </div>
        <div className="flex-1 mx-8 max-w-lg relative">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar por título, descripción, etiquetas..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex items-center gap-6 relative">
          {user ? (
            <>
              <Link to="/my-works" className="bg-[#5c17a6] text-white font-semibold w-30 px-4 py-1 rounded-full hover:bg-[#4b1387] transition flex items-center justify-center">
                Escribir
              </Link>
              <div className="flex items-center gap-2">
                <div className="relative" ref={notificationRefDesktop}>
                  <button
                    className="text-2xl text-[#5C14A6] hover:text-[#172fa6] transition mr-2 p-1 cursor-pointer"
                    aria-label="Notificaciones"
                    onMouseDown={e => { e.stopPropagation(); setShowNotifications((prev) => !prev); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" className="w-7 h-7 text-[#5C14A6]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationPopup show={showNotifications} onClose={() => setShowNotifications(false)}
                    notifications={notifications}
                    onMarkAsReadLocal={handleMarkAsReadLocal} />
                </div>
                <div className="relative">
                  <img
                    src={"/img/fotoPerfil.jpg"}
                    alt="perfil"
                    className="w-8 h-8 rounded-full border border-gray-300 object-cover cursor-pointer"
                    onClick={() => setOpenMenu(!openMenu)}
                  />
                  {openMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-[#F0EEF6] border border-gray-200 rounded-lg shadow-lg text-sm z-10">
                      <Link
                        to={`/profile/${user.id}`}
                        className="block px-4 py-2 hover:bg-[#D3CCDA] hover:text-[#5c17a6]"
                      >
                        Mi Perfil
                      </Link>
                      <Link to="/" className="block px-4 py-2 hover:bg-[#D3CCDA] hover:text-[#5c17a6]">Suscripciones</Link>
                      <Link to="/mySaves" className="block px-4 py-2 hover:bg-[#D3CCDA] hover:text-[#5c17a6]">Guardados</Link>
                      <hr />
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                        onClick={() => { logout(); setUser(null); clearUser(); }}
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-1 rounded-full border border-[#5c17a6] text-[#5c17a6] hover:bg-[#4b1387] hover:text-white transition">
                Iniciar sesión
              </Link>
              <Link to="/register" className="px-4 py-1 rounded-full bg-[#5c17a6] text-white hover:bg-[#4b1387] transition">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 gap-2">
        <img onClick={() => navigate("/home")} src="/img/loomaLogo.png" alt="LOOMA logo" className="h-8 w-auto object-contain cursor-pointer" />
        <div className="flex-1 mx-2 max-w-[200px] relative">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="relative" ref={notificationRefMobile}>
          <button
            className="text-2xl text-[#5C14A6] hover:text-[#172fa6] transition mr-2 p-1"
            aria-label="Notificaciones"
            onMouseDown={e => { e.stopPropagation(); setShowNotifications((prev) => !prev); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" className="w-7 h-7 text-[#5C14A6]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
            </svg>
          </button>
          <button
            className="text-3xl text-[#5c17a6] focus:outline-none ml-2"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            ☰
          </button>
          <NotificationPopup show={showNotifications} onClose={() => setShowNotifications(false)}
            notifications={notifications}
            onMarkAsReadLocal={handleMarkAsReadLocal} />
        </div>
      </div>
      {mobileNavOpen && (
        <div className="md:hidden bg-white border-t shadow-lg px-4 py-3">
          <nav className="flex flex-col gap-2">
            <a onClick={() => { navigate("/home"); setMobileNavOpen(false); }} className="text-[#686868] hover:text-[#5c17a6] transition cursor-pointer">Inicio</a>
            <a onClick={() => { navigate("/explore"); setMobileNavOpen(false); }} className="text-[#686868] hover:text-[#5c17a6] transition cursor-pointer">Explorar</a>

          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/my-works" className="bg-[#5c17a6] text-white w-full px-4 py-1 rounded-xl hover:bg-[#4b1387] transition flex items-center justify-center" onClick={() => setMobileNavOpen(false)}>
                  Publicar
                </Link>
                <Link to="/" className="block px-4 py-2 hover:bg-[#D3CCDA] hover:text-[#5c17a6]">Mi Perfil</Link>
                <Link to="/" className="block px-4 py-2 hover:bg-[#D3CCDA] hover:text-[#5c17a6]">Suscripciones</Link>
                <Link to="/mySaves" className="block px-4 py-2 hover:bg-[#D3CCDA] hover:text-[#5c17a6]">Guardados</Link>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500" onClick={() => { logout(); setUser(null); setMobileNavOpen(false); clearUser(); }}>Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-1 rounded-full border border-[#5c17a6] text-[#5c17a6] hover:bg-[#4b1387] hover:text-white transition" onClick={() => setMobileNavOpen(false)}>
                  Iniciar sesión
                </Link>
                <Link to="/register" className="px-4 py-1 rounded-full bg-[#5c17a6] text-white hover:bg-[#4b1387] transition" onClick={() => setMobileNavOpen(false)}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

