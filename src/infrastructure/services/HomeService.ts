import { useAuthStore } from "../../domain/store/AuthStore";
import type { WorkListDTO } from "../../domain/dto/WorkListDTO";
import { apiClient } from "../api/apiClient";


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
    