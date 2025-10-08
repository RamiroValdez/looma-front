import { useState } from "react";

export default function InspirationBubble() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 flex items-center space-x-2 z-50">

      {showTooltip && (
        <div className="bg-white shadow px-3 py-2 rounded-full text-sm border">
          ¿Necesitas inspiración?
        </div>
      )}

      <button
        onClick={() => alert("Más adelante abrirá el chat 🗨️")}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="bg-[#172FA6] hover:bg-blue-800 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
      >
        <span className="text-2xl">💬</span>
      </button>
    </div>
  );
}
