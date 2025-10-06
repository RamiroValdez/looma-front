export default function AdvancedTools() {
  return (
    <div className="w-full max-w-full rounded-t-2xl overflow-hidden border border-gray-300 bg-[#E8E4EF]">
  
      <div className="bg-[#3B2C56] text-white text-center font-semibold py-2 rounded-t-2xl">
        Versiones
      </div>

      <div className="divide-y divide-gray-300 bg-[#F0EEF6]">
       
        <div className="flex justify-between items-center px-5 py-3">
          <span className="text-base font-medium">Español</span>
          <span className="bg-[#172FA6] text-white text-xs px-3 py-1 rounded-full font-semibold">
            Original
          </span>
        </div>

        <div className="flex justify-between items-center px-5 py-3">
          <span className="text-base font-medium">Inglés</span>
          <span className="bg-[#7E7FA5] text-white text-xs px-3 py-1 rounded-full font-semibold">
            Autor
          </span>
        </div>

        <div className="flex justify-between items-center px-5 py-3">
          <span className="text-base font-medium">Francés</span>
          <span className="border border-[#172FA6] text-[#172FA6] text-xs px-3 py-1 rounded-full font-semibold">
            IA
          </span>
        </div>

        <div className="flex justify-between items-center px-5 py-3">
          <span className="text-base font-medium">Portugués</span>
          <span className="border border-[#172FA6] text-[#172FA6] text-xs px-3 py-1 rounded-full font-semibold">
            IA
          </span>
        </div>

        <div className="flex justify-center py-3 bg-white">
          <button className="bg-[#172FA6] hover:bg-[#0e1c80] text-white font-semibold text-sm px-4 py-1.5 rounded-md">
            Agregar versión
          </button>
        </div>
      </div>
    </div>
  );
}

