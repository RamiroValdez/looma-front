import type {LanguageDTO} from "./LanguageDTO";

export interface ChapterWithContentDTO {
    id: number;
    title: string;
    content: string;
    price: number;
    workName: string;
    workId: string;
    last_update: string;
    likes: number;
    allowAiTranslation: boolean;
    languageDefaultCode: LanguageDTO;
    publicationStatus: string;
    scheduledPublicationDate: string;
    publishedAt: string;
    availableLanguages: LanguageDTO[];
    chapterNumber: number;
}