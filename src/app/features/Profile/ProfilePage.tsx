import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ProfileMenu from './components/ProfileMenu';
import { useUserProfile } from '../../hooks/useUserProfile';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { profile, loading, error } = useUserProfile(id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    isAuthor: false,
    price: ''
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [usernameValidation, setUsernameValidation] = useState<{
    isValid: boolean | null;
    isChecking: boolean;
  }>({ isValid: null, isChecking: false });

  // Inicializar datos editables cuando se carga el perfil
  useEffect(() => {
    if (profile) {
      setEditedData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        username: profile.username,
        isAuthor: profile.isAuthor,
        price: profile.price?.toString() || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
    
    // Validar username cuando cambie
    if (field === 'username' && typeof value === 'string' && value !== profile?.username) {
      validateUsername(value);
    }
  };

  const validateUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameValidation({ isValid: false, isChecking: false });
      return;
    }

    setUsernameValidation({ isValid: null, isChecking: true });
    
    // Simular validación del backend
    setTimeout(() => {
      // Simulación: usernames que empiecen con 'test' están tomados
      const isValid = !username.toLowerCase().startsWith('test');
      setUsernameValidation({ isValid, isChecking: false });
    }, 1000);
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando cambios:', editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Restaurar datos originales
    if (profile) {
      setEditedData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        username: profile.username,
        isAuthor: profile.isAuthor,
        price: profile.price?.toString() || ''
      });
    }
    setUsernameValidation({ isValid: null, isChecking: false });
    setSelectedImage(null);
    setIsEditing(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF, etc.)');
        return;
      }

      // Validar tamaño (límite de 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB en bytes
      if (file.size > maxSize) {
        alert('La imagen es demasiado grande. El tamaño máximo permitido es 5MB.');
        return;
      }

      // Procesar la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    event.target.value = '';
  };

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
            <div className="flex space-x-3">
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                >
                  Guardar
                </button>
              )}
              <button
                onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                className="bg-[#5c17a6] text-white px-6 py-2 rounded-lg hover:bg-[#4b1387] transition-colors shadow-md cursor-pointer"
              >
                {isEditing ? 'Cancelar' : 'Editar Datos'}
              </button>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Profile Image Section */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <img
                  src={selectedImage || profile.profileImage || '/img/fotoPerfil.jpg'}
                  alt="Foto de perfil"
                  className="w-28 h-28 rounded-full border-4 border-purple-200 object-cover shadow-lg mx-auto"
                />
                {isEditing && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button 
                      onClick={handleImageClick}
                      className="absolute -bottom-1 -right-1 bg-[#5c17a6] text-white rounded-full p-2 hover:bg-[#4b1387] transition-colors shadow-md cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* User Info Grid */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Nombre</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#5c17a6] focus:ring-2 focus:ring-[#5c17a6] focus:ring-opacity-20 transition-colors"
                      placeholder="Ingresa tu nombre"
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg border text-gray-800 font-medium">
                      {profile.firstName}
                    </div>
                  )}
                </div>
                
                {/* Apellido */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Apellido</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#5c17a6] focus:ring-2 focus:ring-[#5c17a6] focus:ring-opacity-20 transition-colors"
                      placeholder="Ingresa tu apellido"
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg border text-gray-800 font-medium">
                      {profile.lastName}
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Correo electrónico</label>
                <div className={`p-3 rounded-lg border font-medium ${isEditing ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-700'}`}>
                  {profile.email}
                </div>
                {isEditing && (
                  <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Email verificado - No modificable
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Nombre de usuario</label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editedData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        usernameValidation.isValid === null 
                          ? 'border-gray-300 focus:border-[#5c17a6]' 
                          : usernameValidation.isValid 
                            ? 'border-green-500' 
                            : 'border-red-500'
                      } focus:ring-2 focus:ring-opacity-20 ${
                        usernameValidation.isValid === null 
                          ? 'focus:ring-[#5c17a6]' 
                          : usernameValidation.isValid 
                            ? 'focus:ring-green-500' 
                            : 'focus:ring-red-500'
                      }`}
                      placeholder="Ingresa tu nombre de usuario"
                    />
                    {usernameValidation.isChecking ? (
                      <p className="mt-1 text-xs text-gray-600 flex items-center gap-1">
                        <div className="animate-spin w-3 h-3 border-2 border-gray-300 border-t-[#5c17a6] rounded-full"></div>
                        Verificando disponibilidad...
                      </p>
                    ) : usernameValidation.isValid === true ? (
                      <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Nombre de usuario disponible
                      </p>
                    ) : usernameValidation.isValid === false ? (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Este nombre de usuario ya está en uso
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg border text-gray-800 font-medium">
                    {profile.username}
                  </div>
                )}
              </div>

              {/* Author Status */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">¿Soy autor?</span>
                  <div className="flex items-center space-x-4">
                    <label className={`flex items-center space-x-2 ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}>
                      <input
                        type="radio"
                        name={isEditing ? "isAuthorEdit" : "isAuthorView"}
                        value="yes"
                        checked={isEditing ? editedData.isAuthor : profile.isAuthor}
                        onChange={() => isEditing && handleInputChange('isAuthor', true)}
                        disabled={!isEditing}
                        className={`w-4 h-4 text-[#5c17a6] focus:ring-[#5c17a6] focus:ring-2 ${!isEditing ? 'opacity-400' : 'disabled:opacity-50'}`}
                        style={{ accentColor: '#5c17a6' }}
                      />
                      <span className="text-sm text-gray-700">Sí</span>
                    </label>
                    <label className={`flex items-center space-x-2 ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}>
                      <input
                        type="radio"
                        name={isEditing ? "isAuthorEdit" : "isAuthorView"}
                        value="no"
                        checked={isEditing ? !editedData.isAuthor : !profile.isAuthor}
                        onChange={() => isEditing && handleInputChange('isAuthor', false)}
                        disabled={!isEditing}
                        className={`w-4 h-4 text-[#5c17a6] focus:ring-[#5c17a6] focus:ring-2 ${!isEditing ? 'opacity-400' : 'disabled:opacity-50'}`}
                        style={{ accentColor: '#5c17a6' }}
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              {(isEditing ? editedData.isAuthor : profile.isAuthor) && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600">Precio por suscripción</label>
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-gray-700">$</span>
                        <input
                          type="number"
                          value={editedData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          className="flex-1 p-2 text-lg font-bold text-[#5c17a6] bg-white rounded-lg border border-[#5c17a6] focus:border-[#5c17a6] focus:ring-2 focus:ring-[#5c17a6] focus:ring-opacity-50"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-[#5c17a6]">${profile.price || '0.00'}</div>
                    )}
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