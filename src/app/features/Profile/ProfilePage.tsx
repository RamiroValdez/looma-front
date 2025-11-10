import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileMenu from './components/ProfileMenu';
import { useUserProfile } from '../../hooks/useUserProfile';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { profile, loading, error } = useUserProfile(id);
  const [isEditing, setIsEditing] = useState(false);

  if (loading) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <ProfileMenu />
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="flex justify-between items-center mb-8">
                <div className="h-8 bg-gray-300 rounded w-32"></div>
                <div className="h-10 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <div className="w-28 h-28 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-40 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-gray-300 rounded"></div>
                  <div className="h-12 bg-gray-300 rounded"></div>
                  <div className="h-12 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <ProfileMenu />
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Error al cargar el perfil</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <ProfileMenu />
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Perfil no encontrado</h3>
              <p className="text-gray-600">No se pudo encontrar la información del usuario</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <ProfileMenu />
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-[#5c17a6] text-white px-6 py-2 rounded-lg hover:bg-[#4b1387] transition-colors shadow-md cursor-pointer"
            >
              {isEditing ? 'Cancelar' : 'Editar Datos'}
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Profile Image Section */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <img
                  src={profile.profileImage || '/img/fotoPerfil.jpg'}
                  alt="Foto de perfil"
                  className="w-28 h-28 rounded-full border-4 border-purple-200 object-cover shadow-lg mx-auto"
                />
                {isEditing && (
                  <button className="absolute -bottom-1 -right-1 bg-[#5c17a6] text-white rounded-full p-2 hover:bg-[#4b1387] transition-colors shadow-md">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* User Info Grid */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Nombre</label>
                  <div className="bg-gray-50 p-3 rounded-lg border text-gray-800 font-medium">
                    {profile.firstName}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Apellido</label>
                  <div className="bg-gray-50 p-3 rounded-lg border text-gray-800 font-medium">
                    {profile.lastName}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Correo electrónico</label>
                <div className="bg-gray-50 p-3 rounded-lg border text-gray-800 font-medium">
                  {profile.email}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Nombre de usuario</label>
                <div className="bg-gray-50 p-3 rounded-lg border text-gray-800 font-medium">
                  {profile.username}
                </div>
              </div>

              {/* Author Status */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">¿Soy autor?</span>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 ">
                      <input
                        type="radio"
                        name="isAuthor"
                        value="yes"
                        checked={profile.isAuthor}
                        readOnly
                        className="w-4 h-4 text-[#5c17a6] focus:ring-[#5c17a6] focus:ring-2"
                        style={{ accentColor: '#5c17a6' }}
                      />
                      <span className="text-sm text-gray-700">Sí</span>
                    </label>
                    <label className="flex items-center space-x-2 ">
                      <input
                        type="radio"
                        name="isAuthor"
                        value="no"
                        checked={!profile.isAuthor}
                        readOnly
                        className="w-4 h-4 text-[#5c17a6] focus:ring-[#5c17a6] focus:ring-2"
                        style={{ accentColor: '#5c17a6' }}
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              {profile.isAuthor && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Precio por suscripción</label>
                      <div className="text-2xl font-bold text-[#5c17a6]">${profile.price || '0.00'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;