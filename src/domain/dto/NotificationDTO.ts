export type NotificationType =
  | "WORK_UPDATED"
  | "NEW_WORK_PUBLISHED"
  | "NEW_WORK_SUBSCRIBER"
  | "NEW_AUTHOR_SUBSCRIBER"
  | "NEW_CHAPTER_SUBSCRIBER";

export interface NotificationDTO {
  id: number;
  userId: number;
  message: string;
  read: boolean;
  createdAt: string; 
  type: NotificationType;
  relatedWork?: number | null;
  relatedChapter?: number | null;
  relatedUser?: number | null;
}