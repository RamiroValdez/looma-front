export interface UserDTO {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  image: string;
  isAuthor?: boolean;
  price?: number;
  money?: number;
}