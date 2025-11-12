import { useAuthStore } from "../../domain/store/AuthStore";
import type { WorkListDTO } from "../../domain/dto/WorkListDTO";
import { apiClient } from "../api/apiClient";
import { useUserStore } from '../../domain/store/UserStorage';

export interface ReadingProgressDto {
  userId: number;
  workId: number;
  chapterId: number;
}

export const getHomeWorkList = async (userId: number): Promise<WorkListDTO> => {
  const { token } = useAuthStore.getState();
  
  try {
    const response = await apiClient.request<WorkListDTO>({
      url: `/home/work-list/${userId}`,
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching home work list:', error);
    throw new Error('Server connection error');
  }
};

export const updateReadingProgress = async (workId: number, chapterId: number): Promise<void> => {
  const { token } = useAuthStore.getState();
  const { user } = useUserStore.getState();

  if (!user?.userId) {
    throw new Error('Usuario no autenticado');
  }

  try {
    await apiClient.request({
      url: '/reading-progress/update',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        userId: user.userId,
        workId,
        chapterId,
      },
    });
  } catch (error) {
    console.error('Error updating reading progress:', error);
    throw new Error('Error al actualizar el progreso de lectura');
  }
};