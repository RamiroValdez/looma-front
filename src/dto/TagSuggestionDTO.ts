// 1. DTO request (Lo que enviamos al backend)
export interface TagSuggestionRequestDTO {
    description: string;
    title: string;
    existingTags: string[];
}

// 2. DTO response (Lo que recibimos del backend)
export interface TagSuggestionResponseDTO {
    suggestions: string[]; 
}