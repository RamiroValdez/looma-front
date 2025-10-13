import { useAuthStore } from "../store/AuthStore.ts"; // Asumo tu store de autenticación
import {useApiMutation} from "../api/useApiMutation.ts";
import type { TagSuggestionRequestDTO, TagSuggestionResponseDTO } from "../dto/TagSuggestionDTO.ts"; 


export function useSuggestTagsMutation() {
    const { token } = useAuthStore();
    return useApiMutation<TagSuggestionResponseDTO, Error, TagSuggestionRequestDTO>(
        {
            url: import.meta.env.VITE_API_SUGGEST_TAGS_URL,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`,
            }
        }
    );
}

