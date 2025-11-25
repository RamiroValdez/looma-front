import {useEffect,useRef, useState} from 'react';
import ProfileMenu from './components/ProfileMenu';
import Button from '../../components/Button';
import GradientSection from '../../components/GradientSection';
import PasswordChangeModal from './components/PasswordChangeModal';
import { useUserProfile } from '../../hooks/useUserProfile';
import Analytics from "./components/Analytics.tsx";
import { MySaves } from "./MySaves";
import TermsAndConditions from "./TermsAndConditions.tsx"; // nuevo import
import { Subscriptions } from "./SubscriptionsPage";

const ProfilePage = () => {
  const {
    profile,
    loading,
    error,
    isEditing,
    editedData,
    selectedImage,
    usernameValidation,
    setIsEditing,
    handleInputChange,
    handleImageChange,
    handleSave,
    handleCancel,
    handlePasswordChange
  } = useUserProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [blockSelected, setBlockSelected] = useState<string>('profile');

  // leer hash inicial
  useEffect(() => {
    const hash = window.location.hash.replace('#','');
    if (hash === 'suscripciones') {
      setBlockSelected('subscriptions');
    } else if (hash === 'guardados') {
      setBlockSelected('mySaves');
    } else if (hash === 'estadisticas') {
      setBlockSelected('Analytics');
    } else if (hash === 'terminos') {
      setBlockSelected('terms');
    }
  }, []);

  const handleSelectBlock = (block: string) => {
    setBlockSelected(block);
    // sincronizar hash para deep-linking
    let newHash: string;
    switch (block) {
      case 'subscriptions': newHash = 'suscripciones'; break;
      case 'mySaves': newHash = 'guardados'; break;
      case 'Analytics': newHash = 'estadisticas'; break;
      case 'terms': newHash = 'terminos'; break;
      case 'profile': newHash = ''; break;
      default: newHash = '';
    }
    if (newHash) {
      history.replaceState(null, '', `${window.location.pathname}#${newHash}`);
    } else {
      history.replaceState(null, '', `${window.location.pathname}`);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const [haveImage, setHaveImage] = useState<boolean>(false);

  const validateImage = () => {
    console.log(haveImage);
    console.log(profile?.image?.endsWith("/none"))
    if (profile?.image?.endsWith("/none") == false) {
      setHaveImage(true);
    }
  }

  useEffect(()=> {
    validateImage();
  }, [profile])


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
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-xs sm:max-w-3xl mx-auto">
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
      <div className="hidden sm:block">
  <ProfileMenu onBlockSelected={handleSelectBlock } selectedBlock={blockSelected} />
</div>
        { blockSelected == 'Analytics' && (
            <Analytics/>
        )}
        { blockSelected == 'mySaves' && (
            <MySaves />
        )}
        { blockSelected == 'subscriptions' && (
            <Subscriptions />
        )}

        { blockSelected == 'terms' && (
            <div className="flex-1 p-6">
                <TermsAndConditions />
            </div>
        )}

        { blockSelected == 'profile' && (
                <div className="flex-1 p-6">
                    <div >
                        <div className="max-w-3xl mx-auto">
                            <div className="flex flex-col items-start mb-8 sm:flex-row sm:justify-between sm:items-center">
                            <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
                        <div className="flex space-x-3 justify-start sm:justify-end mt-4 sm:mt-0 w-full max-w-xs">
                {isEditing && (
                    <Button
                    onClick={handleSave}
                    colorClass="bg-green-600 text-white hover:bg-green-700 transition-colors shadow-md cursor-pointer"
                    className="px-6 py-2 rounded-full"
                    text="Guardar"
                    />
                )}
                <Button
                    onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                    colorClass="bg-[#5c17a6] text-white hover:bg-[#4b1387] transition-colors shadow-md cursor-pointer"
                    className="px-6 py-2 rounded-full font-semibold"
                    text={isEditing ? 'Cancelar' : 'Editar Datos'}
                />
                </div>
                        </div>
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <div className="text-center mb-8">
                                    <div className="relative inline-block">
                                      {
                haveImage ? (  <img
                                            src={profile.image}
                  alt="foto de perfil"
                  className="w-28 h-28 rounded-full border-4 border-purple-200 object-cover shadow-lg mx-auto"
                />
                ) : (
                  <img
                  src={selectedImage}
                                            alt="foto de perfil"
                                            className="w-28 h-28 rounded-full border-4 border-purple-200 object-cover shadow-lg mx-auto"/>
                )
                                        }
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

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                    {profile.name}
                                                </div>
                                            )}
                                        </div>

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
                                                    {profile.surname}
                                                </div>
                                            )}
                                        </div>
                                    </div>

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

                                    {isEditing && (
                                        <div className="mt-8">
                                            <GradientSection
                                                title="Seguridad"
                                                gradientFrom="from-purple-50"
                                                gradientTo="to-indigo-50"
                                                borderColor="border-purple-200"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-700 mb-1">Contraseña</p>
                                                        <p className="text-xs text-gray-500">Mantén tu cuenta segura actualizando tu contraseña regularmente</p>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <Button
                                                            onClick={() => setIsPasswordModalOpen(true)}
                                                            colorClass="bg-[#5c17a6] text-white hover:bg-[#4b1387] transition-colors cursor-pointer shadow-sm"
                                                            className="px-6 py-2 rounded-lg text-sm font-medium"
                                                            text="Cambiar Contraseña"
                                                        />
                                                    </div>
                                                </div>
                                            </GradientSection>
                                        </div>
                                    )}

                                    <GradientSection
                                        title="¿Soy autor?"
                                        gradientFrom="from-purple-50"
                                        gradientTo="to-indigo-50"
                                        borderColor="border-purple-200"
                                    >
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
                                    </GradientSection>

                                    {(isEditing ? editedData.isAuthor : profile.isAuthor) && (
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                                            <div className="flex items-center space-x-4">
                                                <span className="font-medium text-gray-700 whitespace-nowrap">Precio suscripción</span>
                                                <div className="flex-1">
                                                    {isEditing ? (
                                                        <div className="flex items-center space-x-3">
                                                            <span className="text-lg font-semibold text-gray-700">$</span>
                                                            <input
                                            type="number"
                                            value={editedData.price}
                                            onChange={(e) => handleInputChange('price', e.target.value)}
                                            className="w-full sm:w-40 p-2 text-lg font-bold text-[#5c17a6] bg-white rounded-md border border-[#5c17a6] focus:border-[#5c17a6] focus:ring-2 focus:ring-[#5c17a6] focus:ring-opacity-50 text-left"
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
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <PasswordChangeModal
                        isOpen={isPasswordModalOpen}
                        onClose={() => setIsPasswordModalOpen(false)}
                        onPasswordChange={handlePasswordChange}
                    />
                </div>
            )}
    </div>
  );
};

export default ProfilePage;
