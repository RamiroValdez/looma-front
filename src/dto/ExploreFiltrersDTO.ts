export interface ExploreFiltersDto {
  categoryIds?: number[]; 
  formatIds?: number[];  
  state?: string;        
  minLikes?: number;      
  text?: string;         
  sortBy?: string;       
  asc?: boolean;          
}