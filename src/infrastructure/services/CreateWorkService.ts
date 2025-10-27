import type { FileValidationError } from "../../domain/types/CreateWork.types.ts";
import {useApiMutation} from "../api/useApiMutation.ts";
import {useAuthStore} from "../../domain/store/AuthStore.ts";
import React from "react";
import type { CoverIaFormDTO } from "../../domain/dto/FormCoverIaDTO.ts";
import { useEffect } from "react";

export interface CreateWorkDTO {
    title: string;
    description: string;
    formatId: number | null; 
    originalLanguageId: number | null;
    categoryIds: number[];
    tagIds: string[];
    coverIaUrl?: string;
}

export interface GenerateCoverResponse {
    url: string;
}

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

export const handleAddTag = (
  tagToAdd: string,
  currentTags: string[],
  setCurrentTags: React.Dispatch<React.SetStateAction<string[]>>,
  setIsAddingTag: React.Dispatch<React.SetStateAction<boolean>>,
  setNewTagText: React.Dispatch<React.SetStateAction<string>>,
  setIsSuggestionMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  closeMenu: boolean = true
) => {
    tagToAdd = tagToAdd.toLowerCase().replace(/\s+/g, '-');
  const trimmedTag = tagToAdd.trim();
  if (trimmedTag && !currentTags.includes(trimmedTag)) {
    setCurrentTags([...currentTags, trimmedTag]);
  }
  setIsAddingTag(false);
  setNewTagText("");
  if(closeMenu){
      setIsSuggestionMenuOpen(false);
  }
};

interface ValidationOptions {
  maxSizeMB: number;
  maxWidth: number;
  maxHeight: number;
}



export function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClickOutside: () => void) {
    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClickOutside();
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [ref, onClickOutside]);
}



export function validateFile(file: File, options: ValidationOptions): Promise<{ valid: boolean; error?: FileValidationError }> {
    const { maxSizeMB, maxWidth, maxHeight } = options;

    // Validar peso 
    if (file.size > maxSizeMB * 1024 * 1024) {
        return Promise.resolve({ valid: false, error: `El archivo supera el tamaño máximo permitido (${maxSizeMB}MB).` });
    }

    return new Promise<{ valid: boolean; error?: FileValidationError }>((resolve) => {
        const img = new Image();
        
        img.onload = () => {
            if (img.width > maxWidth || img.height > maxHeight) {
                resolve({ 
                    valid: false, 
                    error: `Las dimensiones del archivo exceden el tamaño permitido (Máximo ${maxWidth}x${maxHeight}px).` 
                });
            } else {
                resolve({ valid: true });
            }
        };

        img.onerror = () => resolve({ valid: false, error: "El archivo no es una imagen válida." });
        
        img.src = URL.createObjectURL(file);
    }); 
}

export const useCreateWork = () => {
    const { token } = useAuthStore();

    return useApiMutation({
        url: import.meta.env.VITE_API_POST_CREATE_WORK_URL,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const createFormDataForWork = (
    workDTO: CreateWorkDTO,
    bannerFile?: File | null,
    coverFile?: File | null
): FormData => {
    const formData = new FormData();

    formData.append(
        'work',
        new Blob([JSON.stringify(workDTO)], { type: 'application/json' })
    );

    if (bannerFile) formData.append('banner', bannerFile);
    if (coverFile) formData.append('cover', coverFile);

    return formData;
};

export const createFormDataForIa = (
    formCoverDTO: CoverIaFormDTO
): FormData => {
    const formData = new FormData();
    formData.append(
        'coverIa',
        new Blob([JSON.stringify(formCoverDTO)], { type: 'application/json' })
    );
    return formData;
}

export const useGenerateCover = () => {

    const { token } = useAuthStore();

    return useApiMutation<GenerateCoverResponse,CoverIaFormDTO>({
        url: import.meta.env.VITE_API_POST_CREATE_COVER_IA_URL,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
}

export async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
}
