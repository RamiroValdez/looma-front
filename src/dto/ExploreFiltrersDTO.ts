export interface ExploreFiltersDto {
  categoryIds?: number[]; 
  formatIds?: number[];
  rangeEpisodes?: string[];
  lastUpdated?: string[];
  state?: string;        
  minLikes?: number;      
  text?: string;         
  sortBy?: string;       
}