import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkService } from '../../../../infrastructure/services/WorkService';
import { getChapterById } from '../../../../infrastructure/services/ChapterService';
import { useLanguages } from '../../../../infrastructure/services/LanguageService';
import { translateContent } from '../../../../infrastructure/services/TranslateService';
import { subscribeToWork, subscribeToChapter } from '../../../../infrastructure/services/paymentService';
import { notifyError, notifySuccess } from '../../../../infrastructure/services/ToastProviderService';
import { useUserStore } from '../../../../domain/store/UserStorage';
import { SaveWork, IsWorkSaved } from '../../../../infrastructure/services/MySavesService';

export const useReadChapterData = (chapterId: string) => {
  const navigate = useNavigate();
  const { data: chapterData, isLoading, error: errorFetch } = getChapterById(Number(chapterId), "");
  const { user } = useUserStore();
  const { languages } = useLanguages();

  const [translatedContent, setTranslatedContent] = useState<string>("");
  const [currentLanguage, setCurrentLanguage] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);

  const [work, setWork] = useState<any | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);

  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [localLikes, setLocalLikes] = useState<Record<number, number>>({});

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isWorkSaved, setIsWorkSaved] = useState(false);

  const isStatusError = (err: unknown): err is { response: { status: number } } => {
    if (typeof err !== "object" || err === null) return false;
    const e = err as Record<string, unknown>;
    if (!("response" in e)) return false;
    const resp = e.response as Record<string, unknown> | undefined;
    return typeof resp?.status === "number";
  };

  useEffect(() => {
    if (!errorFetch) return;
    if (isStatusError(errorFetch) && errorFetch.response.status === 403) {
      navigate(-1);
    }
  }, [errorFetch, navigate]);

  useEffect(() => {
    if (chapterData?.content) {
      setTranslatedContent(chapterData.content);
      setCurrentLanguage(chapterData.languageDefaultCode.code);
    }

    const loadWork = async () => {
      if (!chapterData?.workId) return;
      try {
        const w = await WorkService.getWorkById(Number(chapterData.workId));
        setWork(w);
        setChapters(w.chapters || []);
      } catch (err: any) {
        console.error('No se pudo cargar la obra:', err);
        notifyError('No se pudo cargar información de la obra.');
      }
    };

    loadWork();
  }, [chapterData]);

  useEffect(() => {
    const likesInit: Record<number, number> = {};
    chapters.forEach((ch: any) => {
      likesInit[ch.id] = ch.likes || 0;
    });
    setLocalLikes(likesInit);
  }, [chapters]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isFullScreen) {
        const windowHeight = window.innerHeight;
        const mouseY = e.clientY;
        
        if (mouseY > windowHeight - 100) {
          setShowFooter(true);
        } else {
          setShowFooter(false);
        }
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        const header = document.querySelector('header');
        if (header) {
          (header as HTMLElement).style.display = '';
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullScreen]);

  const toggleFullScreen = async () => {
    try {
      if (!isFullScreen) {
        await document.documentElement.requestFullscreen();
        setIsFullScreen(true);
        const header = document.querySelector('header');
        if (header) {
          (header as HTMLElement).style.display = 'none';
        }
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsFullScreen(false);
        const header = document.querySelector('header');
        if (header) {
          (header as HTMLElement).style.display = '';
        }
      }
      setShowFooter(false);
    } catch (error) {
      console.error('Error al cambiar modo pantalla completa:', error);
    }
  };

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const isLiked = !prev[id];
      setLocalLikes((l) => ({ ...l, [id]: (l[id] || 0) + (isLiked ? 1 : -1) }));
      return { ...prev, [id]: isLiked };
    });
  };

  const handleChapterClick = (chapter: any) => {
    const chapterData = {
      ...chapter,
      content: chapter.description || "Contenido no disponible",
      originalLanguage: work?.originalLanguage?.name || "",
    };

    navigate(`/work/chapter/${encodeURIComponent(JSON.stringify(chapterData.id))}/read`);
  };

  const handleLanguageChange = async (languageCode: string) => {
    if (!chapterData || languageCode === currentLanguage) return;

    try {
      setIsTranslating(true);
      const source = chapterData.languageDefaultCode?.code || currentLanguage;
      const translated = await translateContent(source, languageCode, chapterData.content);
      setTranslatedContent(translated);
      setCurrentLanguage(languageCode);
    } catch (error: any) {
      console.error("Error al traducir el contenido:", error);
      notifyError(`No se pudo traducir el contenido.`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubscribeWork = async () => {
    if (!work || isPaying) return;
    
    try {
      setIsPaying(true);
      const paymentWindow = window.open("", "_blank");
      const res = await subscribeToWork(work.id, "mercadopago");
      let url = (res.redirectUrl || "").toString().trim();
      
      if (url && !/^https?:\/\//i.test(url)) {
        url = `${window.location.origin}${url.startsWith('/') ? url : '/' + url}`;
      }
      
      if (url) {
        if (paymentWindow && !paymentWindow.closed) {
          try {
            paymentWindow.location.href = url;
          } catch {
            window.open(url, "_blank");
            if (paymentWindow) paymentWindow.close();
          }
        } else {
          window.open(url, "_blank");
        }
        notifySuccess("Redirigiendo a MercadoPago...");
      } else {
        if (paymentWindow && !paymentWindow.closed) paymentWindow.close();
        notifyError("No se recibió URL de pago");
      }
    } catch (e: unknown) {
      notifyError(e instanceof Error ? e.message : "No se pudo iniciar el pago");
    } finally {
      setIsPaying(false);
    }
  };

  const handleChapterPayment = async (chapterId: number) => {
    if (!work || isPaying) return;
    
    try {
      setIsPaying(true);
      const paymentWindow = window.open("", "_blank");
      const res = await subscribeToChapter(chapterId, work.id, "mercadopago");
      let url = (res.redirectUrl || "").toString().trim();
      
      if (url && !/^https?:\/\//i.test(url)) {
        url = `${window.location.origin}${url.startsWith('/') ? url : '/' + url}`;
      }
      
      if (url) {
        if (paymentWindow && !paymentWindow.closed) {
          try {
            paymentWindow.location.href = url;
          } catch {
            window.open(url, "_blank");
            if (paymentWindow) paymentWindow.close();
          }
        } else {
          window.open(url, "_blank");
        }
        notifySuccess("Redirigiendo a MercadoPago...");
      } else {
        if (paymentWindow && !paymentWindow.closed) paymentWindow.close();
        notifyError("No se recibió URL de pago");
      }
    } catch (e: unknown) {
      notifyError(e instanceof Error ? e.message : "No se pudo iniciar el pago");
    } finally {
      setIsPaying(false);
    }
  };

  const isAuthor = user?.userId === work?.creator?.id;
  const isWorkSubscribed = Boolean(work?.subscribedToWork);
  const isAuthorSubscribed = Boolean(work?.subscribedToAuthor);
  
  useEffect(() => {
    const checkIfWorkSaved = async () => {
      if(work?.id) {
        const isSaved = await IsWorkSaved(work.id);
        setIsWorkSaved(isSaved);
      }
    };
    checkIfWorkSaved();
  }, [work?.id]);


  const handdleToggleSaveWork = async () => {
    if (!work?.id) return;
    try {
      await SaveWork(work.id);
      setIsWorkSaved((prev) => !prev);
      notifySuccess(isWorkSaved ? "Obra eliminada de tus guardados." : "Obra guardada exitosamente.");

    } catch (error) {
      notifyError("No se pudo actualizar el estado de guardado de la obra.");
    }
  };


  const isChapterUnlocked = (chapterIdToCheck: number): boolean => {
    if (isAuthor) return true;
    if (isWorkSubscribed || isAuthorSubscribed) return true;
    const unlockedChapters = work?.unlockedChapters || [];
    return unlockedChapters.includes(chapterIdToCheck);
  };

  const sortedLanguages = chapterData?.languageDefaultCode
    ? [
        { code: chapterData.languageDefaultCode.code, name: "Original" },
        ...languages.filter((lang) => lang.code !== chapterData.languageDefaultCode.code),
      ]
    : languages;

  return {
    chapterData,
    work,
    chapters,
    user,
    
    translatedContent,
    currentLanguage,
    isTranslating,
    sortedLanguages,
    
    liked,
    localLikes,
    
    isFullScreen,
    showFooter,
    isPaying,
    
    isLoading,
    errorFetch,
    
    isAuthor,
    isWorkSubscribed,
    isAuthorSubscribed,
    isWorkSaved,

    toggleFullScreen,
    toggleLike,
    handleChapterClick,
    handleLanguageChange,
    handleSubscribeWork,
    handleChapterPayment,
    isChapterUnlocked,
    handdleToggleSaveWork,
  };
};
