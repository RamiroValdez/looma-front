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

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    // Cuando esté el backend, descomenta esto:
    // const token = useAuthStore.getState().token;
    // const response = await apiClient.get(`/users/${userId}/profile`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    // return response.data;

    // Por ahora retornamos datos mock
    console.log(`Fetching profile for user ${userId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUserProfile);
      }, 500); // Simula latencia de red
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};