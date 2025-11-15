import { useApiQuery } from '../api/useApiQuery';
import { useApiMutation } from '../api/useApiMutation';
import { useAuthStore } from '../../domain/store/AuthStore';
import { buildEndpoint } from '../api/endpoints';
import { type UserDTO } from '../../domain/dto/UserDTO';

export type UserProfile = UserDTO;

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  username: string;
  isAuthor: boolean;
  price?: number;
  profileImage?: string;
}

export interface UsernameValidationResponse {
  isValid: boolean;
  message?: string;
}

export const useUserProfileQuery = (userId: string | undefined) => {
  const { token } = useAuthStore();
  
  return useApiQuery<UserProfile>(
    ['user-profile', userId || ''],
    {
      url: buildEndpoint('/users/{userId}', { userId: userId || '' }),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    },
    {
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
      select: (data: any): UserDTO => {
        console.log('Datos del backend:', data); 
        const money = data.money ? parseFloat(data.money) : 0;
        return {
          id: data.id?.toString() || '',
          name: data.name || '',        
          surname: data.surname || '',  
          email: data.email || '',
          username: data.username || '',
          image: data.photo || '',      
          isAuthor: money > 0,
          price: money > 0 ? money : undefined
        };
      }
    }
  );
};

export const useUpdateProfile = () => {
  const { token } = useAuthStore();
  
  return useApiMutation<any, Error, any>({
    url: '/users/update',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  });
};

// Hook para validar username (POST) - Versión mock temporal
export const useValidateUsername = () => {
  // TEMPORAL: Mutation mock hasta tener backend
  return {
    mutate: (data: { username: string }) => {
      console.log('Mock: Validando username:', data.username);
      // Simular validación (ejemplo: rechazar usernames con menos de 3 caracteres)
      const isValid = data.username.length >= 3;
      return Promise.resolve({ isValid, message: isValid ? 'Username disponible' : 'Username debe tener al menos 3 caracteres' });
    },
    mutateAsync: (data: { username: string }) => {
      console.log('Mock: Validando username async:', data.username);
      const isValid = data.username.length >= 3;
      return Promise.resolve({ isValid, message: isValid ? 'Username disponible' : 'Username debe tener al menos 3 caracteres' });
    },
    isLoading: false,
    error: null,
    isSuccess: false,
    isError: false
  };
  
};