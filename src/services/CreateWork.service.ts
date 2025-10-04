// serviceCreateWork.ts

import type { FileValidationError } from "../types.ts/CreateWork.types";

// Manejo de Categorías
export const handleAddCategory = (
  category: string,
  selectedCategories: string[],
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>,
  setIsCategoryMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!selectedCategories.includes(category)) {
    setSelectedCategories([...selectedCategories, category]);
  }
  setIsCategoryMenuOpen(false);
};

// Manejo de Tags
export const handleAddTag = (
  tagToAdd: string,
  currentTags: string[],
  setCurrentTags: React.Dispatch<React.SetStateAction<string[]>>,
  setIsAddingTag: React.Dispatch<React.SetStateAction<boolean>>,
  setNewTagText: React.Dispatch<React.SetStateAction<string>>,
  setIsSuggestionMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const trimmedTag = tagToAdd.trim();
  if (trimmedTag && !currentTags.includes(trimmedTag)) {
    setCurrentTags([...currentTags, trimmedTag]);
  }
  setIsAddingTag(false);
  setNewTagText("");
  setIsSuggestionMenuOpen(false);
};

interface ValidationOptions {
  maxSizeMB: number;
  maxWidth: number;
  maxHeight: number;
}

export function validateFile(file: File, options: ValidationOptions): { valid: boolean; error?: FileValidationError } {
  const { maxSizeMB, maxWidth, maxHeight } = options;

  // Validar peso
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: "El archivo supera el tamaño máximo permitido (20MB)." };
  }

  // Validar dimensiones de la imagen
  return new Promise<{ valid: boolean; error?: FileValidationError }>((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width > maxWidth || img.height > maxHeight) {
        resolve({ valid: false, error: "Las dimensiones del archivo exceden el tamaño permitido (1345x256)." });
      } else {
        resolve({ valid: true });
      }
    };
    img.onerror = () => resolve({ valid: false, error: "El archivo no es una imagen válida." });
    img.src = URL.createObjectURL(file);
  }) as unknown as { valid: boolean; error?: FileValidationError }; 
}