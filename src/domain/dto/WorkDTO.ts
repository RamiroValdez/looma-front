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
  subscribedToAuthor?: boolean;
  subscribedToWork?: boolean;
  unlockedChapters?: number[];
  likedByUser?: boolean;
  averageRating?: number;
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
  money?: number;
}

export interface TagDTO {
    id: number;
    name: string;
}