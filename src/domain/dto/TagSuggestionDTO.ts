export interface TagSuggestionRequestDTO {
    description: string;
    title: string;
    existingTags: string[];
}

export interface TagSuggestionResponseDTO {
    suggestions: string[]; 
}