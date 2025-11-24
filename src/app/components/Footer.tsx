import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const email = "looma.tpi@gmail.com";
  const instagram = "https://www.instagram.com/looma.ar";

  return (
    <footer className="bg-white w-full">
      <div className="bg-[#3C2A50] text-gray-300 py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-semibold mb-3 text-white">Navegación</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/explore")}
                    className="hover:text-white transition cursor-pointer bg-transparent p-0 border-none text-gray-300"
                    aria-label="Ir a Explorar Obras"
                  >
                    Explorar Obras
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/terms")}
                    className="hover:text-white transition cursor-pointer bg-transparent p-0 border-none text-gray-300"
                    aria-label="Ver Términos y Condiciones"
                  >
                    Términos y Condiciones
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-white">Contacto</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-white transition"
                    aria-label="Enviar correo electrónico"
                  >
                    {email}
                  </a>
                </li>
                <li>
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                    aria-label="Instagram Looma"
                  >
                    Instagram @looma
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-semibold mb-3 text-white">Legal</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                Accede a nuestras políticas y condiciones de uso para entender cómo protegemos tus datos y tus obras dentro de la plataforma.
              </p>
            </div>
          </div>

          <div className="text-center text-gray-400 text-xs mt-2">
            <div>© Copyright 2025 Looma. Todos los derechos reservados.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
