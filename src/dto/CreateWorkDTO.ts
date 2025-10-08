export interface CreateWorkDTO {
  title: string;
  description: string;
  format: WorkFormatDTO;
  categories: CategoryDTO[];
  tags: string[];
  publicationDate: string;
  language: string;
}

export interface CategoryDTO {
  id: number;
  name: string;
}

export interface WorkFormatDTO {
  id: number;
  name: string;
}
