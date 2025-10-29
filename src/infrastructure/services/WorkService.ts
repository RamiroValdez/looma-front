import type { WorkDTO } from '../../domain/dto/WorkDTO.ts';
import { getWorkById as getWorkByIdFromChapterService } from './ChapterService.ts';
import {useApiQuery} from "../api/useApiQuery.ts";

export class WorkService {

 static async getWorkDetail(id: number): Promise<WorkDTO> {
    return getWorkByIdFromChapterService(id); 
  }

  static async getWorkById(id: number): Promise<WorkDTO> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const response = await fetch(`/data/work-${id}.json`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Could not load work`);
      }
      
      const workData: WorkDTO = await response.json();
      
      return workData;
      
    } catch (error) {
      console.error('Error fetching work:', error);
      throw new Error('Could not load work information');
    }
  }
  
  static async getWorkByIdFromAPI(id: number): Promise<WorkDTO> {
    try {
      const response = await fetch(`/api/works/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const workData: WorkDTO = await response.json();
      return workData;
      
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