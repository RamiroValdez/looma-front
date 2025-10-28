import type { CategoryDTO } from "./CategoryDTO";
import type { ChapterDTO } from "./ChapterDTO";
import type { WorkFormatDTO } from "./WorkFormatDTO";

export interface WorkDTO {
  id: number;
  title: string;
  description?: string;
  cover: string;
  banner: string;
  state: 'paused' | 'finished' | 'InProgress';
  createdAt: string;
  updatedAt: string;
  publicationDate: string;
  format: WorkFormatDTO;
  originalLanguage: OriginalLanguageDTO;
  price: number;
  likes: number;
  creator: CreatorDTO;
  chapters: ChapterDTO[];
  categories: CategoryDTO[];
  tags: TagDTO[];
}

export interface OriginalLanguageDTO {
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

export interface TagDTO {
    id: number;
    name: string;
}