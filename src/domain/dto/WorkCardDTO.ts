export interface WorkCardDto {
  id: number;
  title: string;
  description: string;
  cover: string;
  likes: number;
  state: string;
  publicationDate: string;
  format: {
    id: number;
    name: string;
  };
  categories: Array<{
    id: number;
    name: string;
  }>;
}