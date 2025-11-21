import { useState, useEffect } from 'react';
import { useUserProfileQuery, useUpdateProfile, useValidateUsername, useChangePassword } from '../../infrastructure/services/ProfileService';
import { useUserStore } from '../../infrastructure/store/UserStorage';
import { notifyError, notifySuccess } from '../../infrastructure/services/ToastProviderService';

export const useUserProfile = () => {
  const { user } = useUserStore();
  const userId = user?.userId?.toString();
  const {
    data: profile,
    isLoading: loading,
    error,
    refetch
  } = useUserProfileQuery(userId);

  const updateProfileMutation = useUpdateProfile();
  const validateUsernameMutation = useValidateUsername();
  const changePasswordMutation = useChangePassword();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    isAuthor: false,
    price: ''
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [usernameValidation, setUsernameValidation] = useState<{
    isValid: boolean | null;
    isChecking: boolean;
  }>({ isValid: null, isChecking: false });

  useEffect(() => {
    if (profile) {
      setEditedData({
        firstName: profile.name || '',
        lastName: profile.surname || '',
        username: profile.username,
        isAuthor: profile.isAuthor || false,
        price: profile.price?.toString() || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setEditedData(prev => {
      const newData = { ...prev, [field]: value };

      if (field === 'isAuthor' && value === true && (!prev.price || prev.price === '')) {
        newData.price = '0.00';
      }

      if (field === 'isAuthor' && value === false) {
        newData.price = '';
      }

      return newData;
    });

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

    try {
      const result = await validateUsernameMutation.mutateAsync({ username });
      setUsernameValidation({ isValid: result.isValid, isChecking: false });
    } catch (error) {
      setTimeout(() => {
        const isValid = !username.toLowerCase().startsWith('test');
        setUsernameValidation({ isValid, isChecking: false });
      }, 1000);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF, etc.)');
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('La imagen es demasiado grande. El tamaño máximo permitido es 5MB.');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    event.target.value = '';
  };

  const handleSave = async () => {
    if (!userId || !profile) return;

    try {
      const formData = new FormData();

      formData.append("id", userId);
      formData.append("name", editedData.firstName);
      formData.append("surname", editedData.lastName);
      formData.append("username", editedData.username);
      formData.append("photo", profile.image);
      formData.append("email", profile.email);
      formData.append(
        "money",
        editedData.isAuthor && editedData.price ? editedData.price : "0"
      );
      formData.append("newPassword", "");

      // Si hay archivo seleccionado, lo enviamos
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await updateProfileMutation.mutateAsync(formData);

      refetch();
      setIsEditing(false);
      notifySuccess("¡Perfil actualizado exitosamente!");

    } catch (error) {
      console.error(error);
      setIsEditing(false);

      notifyError(
        error && typeof error === "object" && "message" in error
          ? `Error al actualizar el perfil: ${error.message}`
        : "¡Error al actualizar el perfil!"
    );
  }
};

  const handleCancel = () => {
    if (profile) {
      setEditedData({
        firstName: profile.name || '',
        lastName: profile.surname || '',
        username: profile.username,
        isAuthor: profile.isAuthor || false,
        price: profile.price?.toString() || ''
      });
    }
    setUsernameValidation({ isValid: null, isChecking: false });
    setSelectedImage(null);
    setIsEditing(false);
  };

  const handlePasswordChange = async (newPassword: string) => {
    if (!userId || !profile) return;

    try {
      const formData = new FormData();
      
      // Usar los datos actuales del perfil para mantener todo igual excepto la contraseña
      formData.append("id", userId);
      formData.append("name", profile.name || '');
      formData.append("surname", profile.surname || '');
      formData.append("username", profile.username);
      formData.append("photo", profile.image || '');
      formData.append("email", profile.email);
      formData.append("money", (profile.price || 0).toString());
      formData.append("newPassword", newPassword);
      
      // Nota: El backend validará la autorización vía JWT token

      await changePasswordMutation.mutateAsync(formData);
      
      notifySuccess("¡Contraseña cambiada exitosamente!");
    } catch (error: any) {
      // Manejo mejorado de errores específicos del backend
      let errorMessage = "Error al cambiar la contraseña";
      
      if (error?.response?.status === 400) {
        errorMessage = "Error en los datos proporcionados. Verifica tu contraseña actual.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      notifyError(errorMessage);
      throw error; // Re-throw para que el modal pueda manejarlo
    }
  };

  return {
    profile,
    loading,
    error: error ? String(error) : null,

    isEditing,
    editedData,
    selectedImage,
    usernameValidation,

    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
    isChangingPassword: changePasswordMutation.isPending,

    setIsEditing,
    handleInputChange,
    handleImageChange,
    handleSave,
    handleCancel,
    handlePasswordChange,
    refetch
  };
};