import { useLocation } from "react-router-dom";
import { useVerifyCode } from "../../hooks/useVerifyCode";

export const VerifyCodePage = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const { code, setCode, error, loading, handleSubmit } = useVerifyCode(email);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6FB] py-8 px-2">
      <div className="bg-white rounded-2xl shadow-md border border-[#E6D6F6] w-full max-w-md p-6">
        <div className="flex flex-col items-center mb-4">
                     <h2 className="text-2xl font-semibold text-[#5C17A6] mb-1 text-center">Verifica tu correo</h2>
          <p className="text-gray-700 text-sm text-center mb-2">
            Ingresá el código que recibiste en <b>{email}</b>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex justify-center">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Código"
              className="bg-[#F3EAFB] border border-[#C9A4F7] rounded-md px-4 py-2 text-xl font-semibold text-[#761ED4] tracking-widest text-center outline-none focus:ring-2 focus:ring-[#761ED4] transition w-40"
              disabled={loading}
              maxLength={6}
              autoFocus
            />
          </div>
          {error && <p className="text-red-600 text-xs text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#5C17A6] text-white rounded-md font-semibold text-base transition"
          >
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </form>
        <p className="text-gray-400 text-xs text-center mt-4">
          El código vence en 15 minutos.
        </p>
      </div>
    </div>
  );
};

export default VerifyCodePage;