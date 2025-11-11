// TEMPORAL: Imports comentados hasta tener backend
// import { useApiQuery } from '../api/useApiQuery';
// import { useApiMutation } from '../api/useApiMutation';
// import { useAuthStore } from '../../domain/store/AuthStore';
// import { buildEndpoint } from '../api/endpoints';

// DTOs para requests y responses
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImage?: string;
  isAuthor: boolean;
  price?: number;
}

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

// Simulación con JSON mientras no esté el backend
const mockUserProfile: UserProfile = {
  id: "1",
  firstName: "Victoria",
  lastName: "González",
  email: "victoria.gonzalez@email.com",
  username: "vicky_writer",
  profileImage: "/img/fotoPerfil.jpg",
  isAuthor: true,
  price: 25.99
};

// Hook para obtener perfil de usuario (GET) - Versión mock temporal
export const useUserProfileQuery = (userId: string | undefined) => {
  // TEMPORAL: Usar query manual para mock hasta tener backend
  return {
    data: userId ? mockUserProfile : null,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve()
  };
  
  /* 
  // FUTURO: Cuando tengas backend, descomenta esto y borra el mock de arriba:
  return useApiQuery<UserProfile>(
    ['user-profile', userId || ''],
    {
      url: buildEndpoint('/users/{userId}/profile', { userId: userId || '' }),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    },
    {
      enabled: !!userId && !!token,
      staleTime: 5 * 60 * 1000
    }
  );
  */
};

// Función auxiliar para obtener perfil (mantiene compatibilidad)
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  // MOCK: Por ahora retorna datos mock
  console.log(`Fetching profile for user ${userId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUserProfile);
    }, 500);
  });
};

// Hook para actualizar perfil (PUT) - Versión mock temporal
export const useUpdateProfile = () => {
  // TEMPORAL: Mutation mock hasta tener backend
  return {
    mutate: (data: UpdateProfileRequest & { userId: string }) => {
      console.log('Mock: Actualizando perfil con:', data);
      // Simular actualización exitosa
      return Promise.resolve(mockUserProfile);
    },
    mutateAsync: (data: UpdateProfileRequest & { userId: string }) => {
      console.log('Mock: Actualizando perfil async con:', data);
      return Promise.resolve(mockUserProfile);
    },
    isLoading: false,
    error: null,
    isSuccess: false,
    isError: false
  };
  
  /* 
  // FUTURO: Cuando tengas backend, descomenta esto y borra el mock de arriba:
  const { token } = useAuthStore();
  
  return useApiMutation<UserProfile, Error, UpdateProfileRequest & { userId: string }>({
    url: '/users/{userId}/profile',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  });
  */
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
  
  /* 
  // FUTURO: Cuando tengas backend, descomenta esto y borra el mock de arriba:
  const { token } = useAuthStore();
  
  return useApiMutation<UsernameValidationResponse, Error, { username: string }>({
    url: '/users/validate-username',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  });
  */
};