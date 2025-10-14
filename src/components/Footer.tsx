export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="bg-[#3C2A50] text-gray-300 py-3">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col items-center gap-6">
         
          {/* Tres columnas centradas debajo del QR */}
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="font-semibold mb-2 text-white">Descubrir</h3>
                <ul className="space-y-1">
                  <li><a href="#" className="hover:text-white transition">Explorar Obras</a></li>
                  <li><a href="#" className="hover:text-white transition">Comics</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-white">Ayuda</h3>
                <ul className="space-y-1">
                  <li><a href="#" className="hover:text-white transition">Contacto</a></li>
                  <li><a href="#" className="hover:text-white transition">Instrucciones</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-white">Legal</h3>
                <ul className="space-y-1">
                  <li><a href="#" className="hover:text-white transition">Términos y Condiciones</a></li>
                  <li><a href="#" className="hover:text-white transition">Derechos de Autor</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright debajo, centrado */}
          <div className="text-center text-gray-300 text-sm mt-2">
            <div>© Copyright 2025</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
