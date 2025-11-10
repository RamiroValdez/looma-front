import { useAuthStore } from '../../domain/store/AuthStore';
import { apiClient } from '../api/apiClient';


export const SaveWork = async (workId: number) => {
    const { token } = useAuthStore.getState(); 

    try {
        await apiClient.request({
            url: `${import.meta.env.VITE_API_MY_SAVES_URL}/${workId}/toggle`,
            method: 'POST',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
    } catch (error) {
        console.error('Error saving work:', error);
        throw new Error('Server connection error');
    }
};

export const IsWorkSaved = async (workId: number): Promise<boolean> => {
    const { token } = useAuthStore.getState(); 
    try {
        const response = await apiClient.request<{ isSaved: boolean }>({ 
            url: `${import.meta.env.VITE_API_MY_SAVES_URL}/${workId}/status`,
            method: 'GET',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        return response.data.isSaved; 
    } catch (error) {
        console.error('Error checking if work is saved:', error);
        return false; 
    }
};

