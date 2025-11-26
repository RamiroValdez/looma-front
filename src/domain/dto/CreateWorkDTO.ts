export interface CreateWorkDTO {
    title: string;
    description: string;
    formatId: number | null; 
    originalLanguageId: number | null;
    categoryIds: number[];
    tagIds: string[];
    price: number;
    coverIaUrl?: string;
}