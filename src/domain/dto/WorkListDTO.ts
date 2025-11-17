import type { WorkDTO } from "./WorkDTO";

export interface WorkListDTO {
  topTen: WorkDTO[];
  currentlyReading: WorkDTO[];
  newReleases: WorkDTO[];
  recentlyUpdated: WorkDTO[];
}