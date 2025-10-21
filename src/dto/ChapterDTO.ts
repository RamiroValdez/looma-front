export interface ChapterDTO {
  id: number;
  title: string; 
  description: string; 
  price: number; 
  likes: number; 
  lastModified: string; 
  publishedAt?: string; 
  publicationStatus: "PUBLISHED" | "DRAFT";
}