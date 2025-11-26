import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChapterWithContentDTO } from '../../domain/dto/ChapterWithContentDTO';
import type { LanguageDTO } from '../../domain/dto/LanguageDTO';
import { saveDraftChapter, updateChapterPrice } from '../../infrastructure/services/ChapterService';
import { notifyError, notifySuccess } from '../../infrastructure/services/ToastProviderService';
import { useAuthStore } from '../../infrastructure/store/AuthStore';

interface VersionState {
  content: string;
  dirty: boolean;
  fetching: boolean;
  error?: string;
  lastFetchedAt?: number;
  lastSavedAt?: number;
}

interface UseChapterVersionsOptions {
  chapterId: number | null;
  initialLanguageCode?: string; // si se quiere forzar iniciar en ese idioma
}

interface UseChapterVersionsResult {
  chapter: ChapterWithContentDTO | null;
  activeLanguage: string; // idioma actualmente en edición
  loadingLanguage: boolean;
  versions: Record<string, VersionState>;
  pendingLanguages: LanguageDTO[];
  switchLanguage: (code: string) => void;
  updateContent: (newContent: string) => void;
  addLanguage: (language: LanguageDTO) => void;
  saveActiveLanguage: (allowAiTranslation: boolean) => Promise<void>;
  savePrice: () => Promise<void>;
  setTitle: (title: string) => void;
  setPriceValue: (price: number) => void;
  priceSaving: boolean;
  dirtyActive: boolean;
}

// Helper para construir endpoint manual (permitiendo abort)
function buildChapterUrl(chapterId: number, languageCode?: string) {
  let url = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_EDIT_CHAPTER_URL}/${chapterId}`;
  if (languageCode) url += `?language=${encodeURIComponent(languageCode)}`;
  return url;
}

export function useChapterVersions({ chapterId, initialLanguageCode }: UseChapterVersionsOptions): UseChapterVersionsResult {
  const [chapter, setChapter] = useState<ChapterWithContentDTO | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string>('');
  const [requestedLanguage, setRequestedLanguage] = useState<string>('');
  const [loadingLanguage, setLoadingLanguage] = useState(false);
  const [versions, setVersions] = useState<Record<string, VersionState>>({});
  const [pendingLanguages, setPendingLanguages] = useState<LanguageDTO[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const [priceSaving, setPriceSaving] = useState(false);

  // Recuperar último idioma activo guardado localmente
  useEffect(() => {
    if (!chapterId) return;
    const persisted = localStorage.getItem(`chapter:lastLang:${chapterId}`);
    if (persisted) {
      setActiveLanguage(persisted);
      setRequestedLanguage(persisted);
    } else if (initialLanguageCode) {
      setActiveLanguage(initialLanguageCode);
      setRequestedLanguage(initialLanguageCode);
    }
  }, [chapterId, initialLanguageCode]);

  const performFetch = useCallback(async (targetLang: string) => {
    if (!chapterId) return;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoadingLanguage(true);
    // Marcar fetching para el idioma solicitado si ya existe entrada
    if (targetLang) {
      setVersions(prev => ({
        ...prev,
        [targetLang]: {
          content: prev[targetLang]?.content || '',
          dirty: prev[targetLang]?.dirty || false,
          fetching: true,
          error: undefined,
          lastFetchedAt: prev[targetLang]?.lastFetchedAt,
          lastSavedAt: prev[targetLang]?.lastSavedAt,
        }
      }));
    }
    try {
      const token = useAuthStore.getState().token;
      const url = buildChapterUrl(chapterId, targetLang || undefined);
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
      });
      if (!resp.ok) {
        const body = await resp.json().catch(() => null);
        throw new Error(body?.message || `Error ${resp.status}: ${resp.statusText}`);
      }
      const data = await resp.json() as ChapterWithContentDTO;
      setChapter(data);
      const effectiveLang = targetLang || data.languageDefaultCode?.code || targetLang;
      setVersions(prev => {
        const existing = prev[effectiveLang];
        const tempRequested = targetLang && targetLang !== effectiveLang ? prev[targetLang] : undefined;
        const source = existing || tempRequested;
        const shouldReplace = !source || !source.dirty;
        return {
          ...prev,
          // Limpiar posible entrada temporal si difiere
          ...(targetLang && targetLang !== effectiveLang ? { [targetLang]: undefined } : {}),
          [effectiveLang]: {
            content: shouldReplace ? (data.content || '') : source?.content || '',
            dirty: source?.dirty || false,
            fetching: false,
            error: undefined,
            lastFetchedAt: Date.now(),
            lastSavedAt: source?.lastSavedAt,
          }
        } as Record<string, VersionState>;
      });
      setActiveLanguage(effectiveLang);
      localStorage.setItem(`chapter:lastLang:${chapterId}`, effectiveLang);
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      const effectiveLang = targetLang || 'default';
      setVersions(prev => ({
        ...prev,
        [effectiveLang]: {
          content: prev[effectiveLang]?.content || '',
          dirty: prev[effectiveLang]?.dirty || false,
          fetching: false,
          error: e?.message || 'Error al cargar contenido',
          lastFetchedAt: prev[effectiveLang]?.lastFetchedAt,
          lastSavedAt: prev[effectiveLang]?.lastSavedAt,
        }
      }));
      notifyError(e?.message || 'Error al cargar el idioma');
    } finally {
      setLoadingLanguage(false);
    }
  }, [chapterId]);

  // Fetch inicial / cambios de idioma solicitados
  useEffect(() => {
    if (!chapterId) return;
    if (!requestedLanguage) {
      // Si no hay requestedLanguage todavía y no tenemos capítulo cargado, intentamos default vacío (backend dará default)
      if (!chapter) performFetch('');
      return;
    }
    performFetch(requestedLanguage);
  }, [chapterId, requestedLanguage, performFetch]);

  const switchLanguage = useCallback((code: string) => {
    if (!chapter) return;
    if (code === activeLanguage) return;
    // Confirmación de cambios se maneja externamente en el componente (modal propio)
    setRequestedLanguage(code);
  }, [activeLanguage, chapter]);

  const updateContent = useCallback((newContent: string) => {
    if (!activeLanguage) return;
    setVersions(prev => ({
      ...prev,
      [activeLanguage]: {
        content: newContent,
        dirty: true,
        fetching: false,
        error: undefined,
        lastFetchedAt: prev[activeLanguage]?.lastFetchedAt,
        lastSavedAt: prev[activeLanguage]?.lastSavedAt,
      }
    }));
  }, [activeLanguage]);

  const addLanguage = useCallback((language: LanguageDTO) => {
    // Añadir idioma a lista de disponibles del capítulo en memoria
    setChapter(prev => {
      if (!prev) return prev;
      if (prev.availableLanguages.some(l => l.code === language.code)) return prev;
      return { ...prev, availableLanguages: [...prev.availableLanguages, language] };
    });
    setPendingLanguages(prev => prev.some(l => l.code === language.code) ? prev : [...prev, language]);
    // Inicializamos versión vacía
    setVersions(prev => ({
      ...prev,
      [language.code]: prev[language.code] || { content: '', dirty: false, fetching: false }
    }));
    // Cambiamos a ese idioma
    switchLanguage(language.code);
  }, [switchLanguage]);

  const saveActiveLanguage = useCallback(async (allowAiTranslation: boolean) => {
    if (!chapter || !activeLanguage) return;
    const v = versions[activeLanguage];
    const contentToSave = v?.content?.trim() || '';
    if (!contentToSave) {
      notifyError('El contenido está vacío para este idioma.');
      return;
    }
    try {
      const payload = {
        title: chapter.title,
        status: chapter.publicationStatus || 'DRAFT',
        last_update: new Date().toISOString(),
        price: Number(chapter.price) || 0,
        allow_ai_translation: allowAiTranslation,
        versions: {
          [activeLanguage]: contentToSave,
        },
      };
      const resp = await saveDraftChapter(Number(chapter.id), payload);
      if (!(resp.fetchStatus >= 200 && resp.fetchStatus < 300)) {
        notifyError('No se pudo guardar el borrador de este idioma.');
        return;
      }
      // Marcar versión como no dirty
      setVersions(prev => ({
        ...prev,
        [activeLanguage]: {
          ...prev[activeLanguage],
          dirty: false,
          lastSavedAt: Date.now(),
        }
      }));
      notifySuccess('Idioma guardado correctamente.');
    } catch (e: any) {
      notifyError(e?.message || 'Error al guardar el idioma');
    }
  }, [chapter, activeLanguage, versions]);

  const setTitle = useCallback((title: string) => {
    setChapter(prev => prev ? { ...prev, title } : prev);
  }, []);

  const setPriceValue = useCallback((price: number) => {
    setChapter(prev => prev ? { ...prev, price } : prev);
  }, []);

  const savePrice = useCallback(async () => {
    if (!chapter) return;
    try {
      setPriceSaving(true);
      await updateChapterPrice(chapter.id, Number(chapter.price) || 0);
      notifySuccess('Precio guardado correctamente.');
    } catch (e: any) {
      notifyError(e?.message || 'Error al guardar el precio');
    } finally {
      setPriceSaving(false);
    }
  }, [chapter]);

  const dirtyActive = !!versions[activeLanguage]?.dirty;

  return {
    chapter,
    activeLanguage,
    loadingLanguage,
    versions,
    pendingLanguages,
    switchLanguage,
    updateContent,
    addLanguage,
    saveActiveLanguage,
    savePrice,
    setTitle,
    setPriceValue,
    priceSaving,
    dirtyActive,
  };
}
