import { useState, useEffect } from 'react';
import { 
  useUserProfileQuery, 
  useUpdateProfile, 
  useValidateUsername,
  type UpdateProfileRequest 
} from '../../infrastructure/services/ProfileService';

export const useUserProfile = (userId: string | undefined) => {
  const { 
    data: profile, 
    isLoading: loading, 
    error,
    refetch 
  } = useUserProfileQuery(userId);

  const updateProfileMutation = useUpdateProfile();
  const validateUsernameMutation = useValidateUsername();

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
      const updateData: UpdateProfileRequest = {
        firstName: editedData.firstName,
        lastName: editedData.lastName,
        username: editedData.username,
        isAuthor: editedData.isAuthor,
        price: editedData.price ? Number(editedData.price) : undefined,
        profileImage: selectedImage || profile.profileImage
      };

      await updateProfileMutation.mutateAsync({ ...updateData, userId });
      
      refetch();
      setIsEditing(false);
      console.log('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      console.log('Guardando cambios (mock):', editedData);
      console.log('Imagen seleccionada:', selectedImage);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
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

  return {
    profile,
    loading,
    error: error ? String(error) : null,
    
    isEditing,
    editedData,
    selectedImage,
    usernameValidation,
    
    isUpdating: updateProfileMutation.isLoading,
    updateError: updateProfileMutation.error,
    
    setIsEditing,
    handleInputChange,
    handleImageChange,
    handleSave,
    handleCancel,
    refetch
  };
};