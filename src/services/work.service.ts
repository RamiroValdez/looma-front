import type { WorkDTO } from '../dto/WorkDTO';

export class WorkService {
  static async getWorkById(id: number): Promise<WorkDTO> {
    try {
      // Simulate a small delay like a real API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Fetch JSON file from public folder
      const response = await fetch(`/data/work-${id}.json`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Could not load work`);
      }
      
      // JSON is automatically converted to WorkDTO type
      const workData: WorkDTO = await response.json();
      
      return workData;
      
    } catch (error) {
      console.error('Error fetching work:', error);
      throw new Error('Could not load work information');
    }
  }
  
    // Method prepared for when the real API is available
  static async getWorkByIdFromAPI(id: number): Promise<WorkDTO> {
    try {
      const response = await fetch(`/api/works/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Authentication headers can be added here if needed
          // 'Authorization': `Bearer ${token}`
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
  
  /**
   * Method to get multiple works (for future functionality)
   * @returns Promise with array of works
   
  static async getAllWorks(): Promise<WorkDTO[]> {
    // For now returns array with single work
    const work = await this.getWorkById(1);
    return [work];
  }*/
}