import Button from "../../components/Button.tsx";
import { useLoginPage } from "../../hooks/useLoginPage.ts";

export const LoginPage = () => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        handleSubmit,
    } = useLoginPage();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-5xl mx-auto">
                <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden md:flex md:items-stretch">
                    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#f3e9fb] to-[#efe6ff] p-8">
                        <div className="z-10 px-6 flex flex-col justify-center items-start h-full">
                            <div className="flex items-center justify-center gap-4 w-full">
                                <h2 className="text-3xl font-extrabold text-[#3C2A50]">Bienvenido a</h2>
                                <div className="mb-0">
                                    <img src="/img/loomaLogo-.png" alt="LOOMA" className="h-35 w-35 object-contain mb-7" />
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 p-8 md:p-12 bg-white">
                        <div className="max-w-md mx-auto">
                            <h1 className="text-2xl mb-4 md:text-3xl font-bold text-center text-[#3C2A50]">Inicia sesión</h1>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M2.94 6.94A2 2 0 014 6h12a2 2 0 011.06.94L10 11 2.94 6.94z" />
                                                <path d="M18 8.2V14a2 2 0 01-2 2H4a2 2 0 01-2-2V8.2l8 4.8 8-4.8z" />
                                            </svg>
                                        </span>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loading}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C17A6] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="tu@ejemplo.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v2a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2v-4a2 2 0 00-2-2V8a6 6 0 00-6-6zM8 10V8a2 2 0 114 0v2H8z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={loading}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C17A6] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {error && <div className="text-red-600 text-sm text-center">{error}</div>}

                                <Button
                                  type="submit"
                                  onClick={() => {}}
                                  disabled={loading}
                                  colorClass={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#5C17A6] to-[#761ED4] hover:from-[#521594] hover:to-[#6a2ad1] focus:outline-none focus:ring-4 focus:ring-[#5C17A6]/30 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer`}
                                >
                                    {loading ? (
                                        <>
                                            <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                            Cargando...
                                        </>
                                    ) : (
                                        'Iniciar sesión'
                                    )}
                                </Button>

                                <div className="text-center mt-2 text-xs text-gray-400">Al iniciar sesión aceptás nuestras políticas de uso.</div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};