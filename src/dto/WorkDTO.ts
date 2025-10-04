// DTO for work information
export interface WorkDTO {
  id: number;
  title: string;
  description?: string;
  coverUrl: string;
  bannerUrl: string;
  status: 'paused' | 'finished' | 'in_progress';
  categories: CategoryDTO[];
  tags: string[];
  chapters: ChapterDTO[];
  createdAt: string;
  updatedAt: string;
  creator: CreatorDTO;
  format: WorkFormatDTO;
  originalLanguage: string;
  price: number;
  likes: number;
}

export interface ChapterDTO {
  id: number;
  title: string;
  price: number;
  likes: number;
  lastModified: string;
  publishedAt?: string;
  status: 'published' | 'draft';
}

export interface CategoryDTO {
  id: number;
  name: string;
}

export interface WorkFormatDTO {
  id: number;
  name: string;
}

export interface CreatorDTO {
  id: number;
  name: string;
  surname: string;
  username: string;
  photo?: string;
  email?: string;
}