// createWorkTypes.ts

export const BLUE_COLOR = "172FA6";   // Categorías
export const PURPLE_COLOR = "5C17A6"; // Etiquetas y botones principales

export const MORE_CATEGORIES = [
  "Terror",
  "Historia",
  "Fantasía",
  "Paranormal",
  "Misterio",
  "Aventura",
  "Comedia",
  "Suspenso",
  "Filosofía",
  "Juvenil",
  "LGBTQ+",
];

export const SUGGESTED_TAGS = [
  "amigos",
  "aventura",
  "misterio",
  "familia",
  "viajes",
  "fantasia",
  "emociones",
];

export type FileValidationError =
  | "El archivo supera el tamaño máximo permitido (20MB)."
  | "Las dimensiones del archivo exceden el tamaño permitido (1345x256)."
  | "El archivo no es una imagen válida."
  | "Error desconocido";
