import { useUserPreferences } from './useUserPreferences';
import PreferenceCategory from './components/PreferenceCategory';

const PreferencesPage = () => {
  const { preferences, loading, error, refetch, categoriesInfo } = useUserPreferences();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <div className="h-8 bg-gray-300 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-96 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                  <div>
                    <div className="h-5 bg-gray-300 rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-48 animate-pulse"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error al cargar preferencias</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={refetch}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No se encontraron preferencias</h3>
            <p className="text-gray-600">Aún no has configurado tus preferencias de lectura</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Mis Preferencias</h1>
              <p className="text-gray-600">Estas son las preferencias que configuraste al registrarte</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-6">
            {categoriesInfo.map((category) => {
              const count = preferences[category.key]?.length || 0;
              return (
                <div key={category.key} className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border">
                  <span className="text-sm">{category.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {count} {category.title.toLowerCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categoriesInfo.map((category) => (
            <PreferenceCategory
              key={category.key}
              category={category}
              preferences={preferences[category.key] || []}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800 mb-2">¿Quieres cambiar tus preferencias?</h4>
              <p className="text-blue-700 text-sm mb-3">
                Estas preferencias se utilizan para personalizar tu experiencia y recomendarte contenido relevante. 
                Puedes modificarlas desde la configuración de tu perfil.
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                Ir a configuración de perfil →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;