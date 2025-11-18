export interface UserPreference {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category: PreferenceCategory;
}

export interface UserPreferences {
  genres: UserPreference[];
  formats: UserPreference[];
  languages: UserPreference[];
  themes: UserPreference[];
  tags: UserPreference[];
}

export type PreferenceCategory = 'genres' | 'formats' | 'languages' | 'themes' | 'tags';

export interface PreferenceCategoryInfo {
  key: PreferenceCategory;
  title: string;
  description: string;
  icon: string;
}