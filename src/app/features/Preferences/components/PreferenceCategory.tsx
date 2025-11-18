import type { UserPreference, PreferenceCategoryInfo } from '../types';

interface PreferenceCategoryProps {
  category: PreferenceCategoryInfo;
  preferences: UserPreference[];
}

const PreferenceCategory = ({ category, preferences }: PreferenceCategoryProps) => {
  if (preferences.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{category.title}</h3>
            <p className="text-sm text-gray-500">{category.description}</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No tienes preferencias configuradas en esta categoría</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{category.icon}</span>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{category.title}</h3>
          <p className="text-sm text-gray-500">{category.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {preferences.map((preference) => (
          <div 
            key={preference.id} 
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            {preference.icon && (
              <span className="text-lg flex-shrink-0">{preference.icon}</span>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{preference.name}</p>
              {preference.description && (
                <p className="text-xs text-gray-500 truncate">{preference.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          {preferences.length} {preferences.length === 1 ? 'preferencia' : 'preferencias'} configuradas
        </p>
      </div>
    </div>
  );
};

export default PreferenceCategory;