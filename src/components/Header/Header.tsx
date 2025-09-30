import { useState, useEffect } from 'react';
import { getCategorias } from '../../services/categoryService';
import { Link } from "react-router-dom";

function Header() {
  const [categorias, setCategorias] = useState<{ id: number, nombre: string }[]>([]);
  const [openMenu, setOpenMenu] = useState(false);
  const secciones = ["Libros", "Comics", "Mangas"];

  useEffect(() => {
    getCategorias().then(data => setCategorias(data));
  }, []);

  return (
    <header className="bg-[linear-gradient(to_right,#EBE4EC,#B597D2,#EDE4F9)] shadow">
      <div className="flex items-end justify-between px-6 py-3">

        <div className="flex items-end gap-2">
          <img src="/imagenes/loomaLogo.png" alt="LOOMA logo" className="h-8 w-auto object-contain" />
          <nav className="flex items-end gap-6 ml-6">
            <a href="#" className="text-[#686868] hover:text-[#5c17a6] transition ">Inicio</a>
            {secciones.map((sec, i) => (
              <div key={i} className="relative group">
                <button className="flex items-center gap-1 hover:text-[#5c17a6] transition text-[#686868] ">
                  {sec}
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white border shadow-lg rounded-md p-4 grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100  group-hover:pointer-events-auto transition">
                  <h4 className="col-span-2 font-semibold text-gray-600 mb-2">CATEGORÍAS</h4>
                  {categorias.map((cat) => (
                    <a
                      key={cat.id}
                      href="#"
                      className="text-sm text-gray-700 hover:text-purple-600"
                    >
                      {cat.nombre}
                    </a>
                  ))}
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

          <Link to="/MyWorks" className="bg-[#5c17a6] text-white px-4 py-1 rounded-xl hover:bg-[#4b1387] transition flex items-center justify-center">
            Publicar
          </Link>

          <button className="text-gray-600 hover:text-purple-900 text-2xl transition">
            🔔
          </button>

          <div className="relative">
            <img
              src="/imagenes/fotoPerfil.jpg"
              alt="perfil"
              className="w-8 h-8 rounded-full border border-gray-300 object-cover cursor-pointer"
              onClick={() => setOpenMenu(!openMenu)}
            />

            {openMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg text-sm z-10">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">Mi Perfil</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">Suscripciones</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">Guardados</a>
                <hr />
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
