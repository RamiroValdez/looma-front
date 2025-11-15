import { useState, useEffect } from 'react';
import { useUserProfileQuery, useUpdateProfile, useValidateUsername } from '../../infrastructure/services/ProfileService';
import { useUserStore } from '../../domain/store/UserStorage';
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
      const backendData = {
        id: parseInt(userId),
        name: editedData.firstName,
        surname: editedData.lastName,
        username: editedData.username,
        email: profile.email, 
        photo: selectedImage || profile.image || '',
        money: editedData.isAuthor && editedData.price ? editedData.price : '0',
        newPassword: null 
      };

      await updateProfileMutation.mutateAsync(backendData);
      
      refetch();
      setIsEditing(false);
      
      notifySuccess("¡Perfil actualizado exitosamente!");
      
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setIsEditing(false);
      

      if (error && typeof error === 'object' && 'message' in error) {
        notifyError(`Error al actualizar el perfil: ${error.message}`);
      } else {
        notifyError("¡Error al actualizar el perfil! Por favor intenta nuevamente.");
      }
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
    
    setIsEditing,
    handleInputChange,
    handleImageChange,
    handleSave,
    handleCancel,
    refetch
  };
};