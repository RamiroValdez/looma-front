import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center w-full px-4 md:px-0 md:pr-24"
        style={{
          background:
            "linear-gradient(90deg, #bca4d3ff 0%, #ded9e9ff 40%, #ffffffff 100%)",
          minHeight: 'calc(100vh - 64px)' 
        }}
      >
        <div className="flex flex-col md:flex-row items-end justify-center w-full max-w-6xl gap-8 md:gap-0">
          <div className="flex md:justify-center w-full md:w-auto mb-4 md:mb-0">
            <img
              src="/img/loomiBienvenido.png"
              alt="Libro Looma"
              className="w-48 sm:w-72 md:w-[450px] lg:w-[550px] max-w-none translate-x-8 md:translate-x-0"
            />
          </div>

          <div className="flex flex-col items-center w-full md:w-auto">
            <img
              src="/img/loomaLogo.png"
              alt="Logo Looma"
              className="w-48 sm:w-72 md:w-[320px] lg:w-[420px] mb-2"
            />
            <span className="text-[#2d2d7b] text-base sm:text-lg md:text-xl mb-8 md:mb-10 font-medium text-center">
              “Tu historia merece ser descubierta”
            </span>
            <button
              onClick={handleStart}
              className="bg-[#5c17a6] hover:bg-[#3c2a50] text-white text-lg sm:text-xl md:text-2xl px-10 sm:px-16 md:px-24 py-3 sm:py-4 rounded-[14px] font-semibold transition-all shadow-md w-full max-w-xs cursor-pointer"
            >
              Explorar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;