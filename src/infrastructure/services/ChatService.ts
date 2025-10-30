import { useApiQuery } from "../api/useApiQuery.ts";
import { useAuthStore } from "../../domain/store/AuthStore.ts";
import { apiClient } from '../api/apiClient';

export interface ChatMessageDto {
  userId: number;
  chapterId: number;
  content: string;
  userMessage: boolean;
  timestamp: string;
}

export interface ChatRequestDto {
  chapterId: number;
  message: string;
  chapterContent: string;
}

export function useChatConversation(chapterId: number) {
  const { token } = useAuthStore();
  
  return useApiQuery<ChatMessageDto[]>(
    ["chat-conversation", chapterId.toString()],
    {
      url: `${import.meta.env.VITE_API_CHATBOT_URL}/conversation/${chapterId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    },
  );
}

export const sendChatMessage = async (request: ChatRequestDto): Promise<ChatMessageDto> => {
    const token = useAuthStore.getState().token; 
    
    if (!token) {
        throw new Error("El usuario no está autenticado. Token faltante.");
    }
    
    const response = await apiClient.request<ChatMessageDto>({
        url: `${import.meta.env.VITE_API_CHATBOT_URL}/message`,
        method: 'POST',
        data: request,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    });
    return response.data;
};