import { useAuthStore } from '../../domain/store/AuthStore';
import { apiClient } from '../api/apiClient';
import type { WorkCardDto } from '../../domain/dto/WorkCardDTO';

export const GetSubscriptions = async (): Promise<WorkCardDto[]> => {
    const { token } = useAuthStore.getState();
    try {
        const response = await apiClient.request<WorkCardDto[]>({
            url: '/api/subscriptions',
            method: 'GET',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        return response.data; 
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        throw new Error('Server connection error');
    }
};