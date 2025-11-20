import type { WorkDTO } from '../../domain/dto/WorkDTO.ts';
import { getWorkById as getWorkByIdFromChapterService } from './ChapterService.ts';
import {useApiQuery} from "../api/useApiQuery.ts";
import { apiClient } from '../api/apiClient';
import { useAuthStore } from '../../domain/store/AuthStore';
import type { ExportEpubResponseDto } from '../../domain/dto/ExportEpubResponseDto.ts';
import type { ExportPdfResponseDto } from '../../domain/dto/ExportPdfResponseDto.ts';

export class WorkService {

 static async getWorkDetail(id: number): Promise<WorkDTO> {
    return getWorkByIdFromChapterService(id); 
  }
  static async getWorkById(id: number): Promise<WorkDTO> {
    try {
      const token = useAuthStore.getState().token;
      const res = await apiClient.request<WorkDTO>({
        url: `${import.meta.env.VITE_API_MANAGE_WORK_URL}/${id}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching work from API:', error);
      throw new Error('Server connection error');
    }
  }
}

export const getTop10Works = () => {
    const requestBody: ExploreRequestDTO = {
        sortBy: 'likes',
        asc: false
    };

    return useApiQuery<Page<WorkDTO>, WorkDTO[]>(
        ['top10Works'],
        {
            url: '/explore?page=0&size=10&sort=likes',
            method: 'POST',
            data: requestBody
        },
        {
            select: (data) => data.content,
            staleTime: 5 * 60 * 1000
        }
         
    ); 
};

export const downloadEpub = async (workId: number): Promise<ExportEpubResponseDto> => {
    try {
        const token = useAuthStore.getState().token;
        const response = await apiClient.request<ExportEpubResponseDto>({
            url: `${import.meta.env.VITE_API_EXPORT_URL}/epub/${workId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error downloading ePub:', error);
        throw new Error('Failed to download ePub');
    }
};

export const downloadPdf = async (workId: number): Promise<ExportPdfResponseDto> => {
    try {
        const token = useAuthStore.getState().token;
        const response = await apiClient.request<ExportPdfResponseDto>({
            url: `${import.meta.env.VITE_API_EXPORT_URL}/pdf/${workId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error downloading PDF:', error);
        throw new Error('Failed to download PDF');
    }
};

export interface ExploreRequestDTO {
    categoryIds?: number[];
    formatIds?: number[];
    state?: string;
    minLikes?: number;
    text?: string;
    sortBy?: 'title' | 'likes' | 'publicationDate';
    asc?: boolean;
}


export interface Page<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}