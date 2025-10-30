import { useAuthStore } from "../../domain/store/AuthStore.ts"; 
import {useApiMutation} from "../api/useApiMutation.ts";
import type { TagSuggestionRequestDTO, TagSuggestionResponseDTO } from "../../domain/dto/TagSuggestionDTO.ts"; 


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

