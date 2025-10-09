import { useState, useEffect } from 'react';
import { useCategories } from '../../services/categoryService';
import { getCurrentUser } from '../../services/dataUserService';
import { Link } from "react-router-dom";
import { type UserDTO } from "../../dtos/user.dto";

function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState<UserDTO | null>(null);
  const secciones = ["Libros", "Comics", "Mangas"];

  const { categories, isLoading, error } = useCategories();

 useEffect(() => {
  const fetchData = async () => {
    try {
      const usr = await getCurrentUser();
      setUser(usr);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setUser(null);
    }
  };
  fetchData();
}, []);


  return (
    <header className="bg-[linear-gradient(to_right,#EBE4EC,#B597D2,#EDE4F9)] shadow">
      <div className="flex items-end justify-between px-6 py-3">
        <div className="flex items-end gap-2">
          <img src="/imagenes/loomaLogo.png" alt="LOOMA logo" className="h-8 w-auto object-contain" />
          <nav className="flex items-end gap-6 ml-6">
            <a href="#" className="text-[#686868] hover:text-[#5c17a6] transition">Inicio</a>
            {secciones.map((sec, i) => (
              <div key={i} className="relative group">
                <button className="flex items-center gap-1 hover:text-[#5c17a6] transition text-[#686868]">
                  {sec}
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white border shadow-lg rounded-md p-4 grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition">
                  <h4 className="col-span-2 font-semibold text-gray-600 mb-2">CATEGORÍAS</h4>
                    {isLoading ? (
                        <p className="col-span-2 text-sm text-gray-500">Cargando...</p>
                    ) : error ? (
                        <p className="col-span-2 text-sm text-red-500">Error al cargar</p>
                    ) : (
                        categories.map((cat) => (
                            <a key={cat.id} href="#" className="text-sm text-gray-700 hover:text-purple-600">
                                {cat.name}
                            </a>
                        ))
                    )}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex-1 mx-8 max-w-lg">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full rounded-xl py-1 px-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
          />
        </div>

        <div className="flex items-center gap-4 relative">
          {user && (
            <>
              <Link to="/MyWorks" className="bg-[#5c17a6] text-white px-4 py-1 rounded-xl hover:bg-[#4b1387] transition flex items-center justify-center">
                Publicar
              </Link>
              <button className="text-gray-600 hover:text-purple-900 text-2xl transition">🔔</button>
            </>
          )}

          {user ? (
            <div className="relative">
              <img
                src={user.image}
                alt="perfil"
                className="w-8 h-8 rounded-full border border-gray-300 object-cover cursor-pointer"
                onClick={() => setOpenMenu(!openMenu)}
              />
              {openMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-[#F0EEF6] border border-gray-200 rounded-lg shadow-lg text-sm z-10">
                  <Link to="/" className="block px-4 py-2 hover:bg-[#D3CCDA] hover:text-[#5c17a6]">Mi Perfil</Link>
                  <Link to="/" className="block px-4 py-2 hover:bg-[#D3CCDA] hover:text-[#5c17a6]">Suscripciones</Link>
                  <Link to="/" className="block px-4 py-2 hover:bg-[#D3CCDA] hover:text-[#5c17a6]">Guardados</Link>
                  <hr />
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    onClick={() => setUser(null)}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-1 rounded-xl border border-[#5c17a6] text-[#5c17a6] hover:bg-[#4b1387] hover:text-white transition">
                Iniciar sesión
              </Link>
              <Link to="/register" className="px-4 py-1 rounded-xl bg-[#5c17a6] text-white hover:bg-[#4b1387] transition">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
