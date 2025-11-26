import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WorkDTO } from '../../../../domain/dto/WorkDTO';
import type { CategoryDTO } from '../../../../domain/dto/CategoryDTO';
import type { TagSuggestionRequestDTO } from '../../../../domain/dto/TagSuggestionDTO';
import { handleAddTag, validateFile, useClickOutside } from "../../../../infrastructure/services/CreateWorkService";
import { useSuggestTagsMutation } from "../../../../infrastructure/services/TagSuggestionService";
import { addChapter, getWorkById } from '../../../../infrastructure/services/ChapterService';
import { uploadCover, uploadBanner } from '../../../../infrastructure/services/WorkAssetsService';
import { notifySuccess, notifyError } from "../../../../infrastructure/services/ToastProviderService";
import { apiClient } from "../../../../infrastructure/api/apiClient";
import { useAuthStore } from "../../../../infrastructure/store/AuthStore";
import { useCategories } from "../../../hooks/useCategories";

interface UpdateWorkDTO {
  categoryIds?: number[];
  tagIds?: string[];
  state?: 'paused' | 'InProgress' | 'finished';
  price?: number;
}

export const useManageWorkData = (currentWorkId: number) => {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const suggestMutation = useSuggestTagsMutation();
  const { categories, isLoading: isLoadingCategory, error: errorCategory } = useCategories();
  
  // Referencias
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const suggestionMenuRef = useRef<HTMLDivElement | null>(null);
  const suggestionCategoryMenuRef = useRef<HTMLDivElement | null>(null);

  const [work, setWork] = useState<WorkDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<CategoryDTO[]>([]);
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagText, setNewTagText] = useState('');
  const [isSuggestionMenuOpen, setIsSuggestionMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [showIATooltip, setShowIATooltip] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [showBannerTooltip, setShowBannerTooltip] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [errorCover, setErrorCover] = useState<string | null>(null);
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
  const [savingCover, setSavingCover] = useState(false);
  const [price, setPrice] = useState('');
  const [workStatus, setWorkStatus] = useState<'paused' | 'InProgress' | 'finished' | ''>('');
  const [allowSubscription, setAllowSubscription] = useState(false);
  const [allowComments, setAllowComments] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showCoverModalAi, setShowCoverModalAi] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [nameWork, setNameWork] = useState('');
  const [descriptionF, setDescriptionF] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Constantes
  const shortMessage = "Tags con IA: tu descripción tiene menos de 20 caracteres.";
  const aiSuggestionMessage = "Sugerencias de la IA";
  const isDescriptionValid = descriptionF.trim().length > 20;

  useEffect(() => {
    const loadWorkData = async () => {
      try {
        setLoading(true);
        const workData = await getWorkById(currentWorkId);
        setWork(workData);
        setSelectedCategories(workData.categories || []);
        setCurrentTags(workData.tags.map((tag) => tag.name));
        setNameWork(workData.title || '');
        setDescriptionF(workData.description || '');
        setPrice(workData.price?.toString() || '');
        setAllowSubscription(!!workData.price && workData.price > 0);
        setWorkStatus(workData.state || '');
        setError(null);
      } catch (err) {
        console.error('Error loading work:', err);
        setError('Error al cargar el trabajo');
      } finally {
        setLoading(false);
      }
    };

    if (currentWorkId) {
      loadWorkData();
    }
  }, [currentWorkId]);

  // Limpiar URLs de preview al desmontar
  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [bannerPreview, coverPreview]);

  // Configurar click outside
  useClickOutside(suggestionMenuRef as React.RefObject<HTMLElement>, () => setIsSuggestionMenuOpen(false));
  useClickOutside(suggestionCategoryMenuRef as React.RefObject<HTMLElement>, () => setIsCategoryMenuOpen(false));

  const handleAddCategory = (category: CategoryDTO) => {
    if (!selectedCategories.some(c => c.id === category.id)) {
      setSelectedCategories([...selectedCategories, category]);
    }
    setIsCategoryMenuOpen(false);
  };

  const unselectCategory = (categoryId: number) => {
    setSelectedCategories(selectedCategories.filter(c => c.id !== categoryId));
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const options = isCover
      ? { maxSizeMB: 20, maxWidth: 500, maxHeight: 800 }
      : { maxSizeMB: 20, maxWidth: 1345, maxHeight: 256 };
    const result = await validateFile(file, options);
    const setFilePreview = isCover ? setCoverPreview : setBannerPreview;
    const setError = isCover ? setErrorCover : setErrorBanner;
    const inputRef = isCover ? coverInputRef : bannerInputRef;
    const setPendingFile = isCover ? setPendingCoverFile : null;

    if (!result.valid) {
      const msg = result.error || 'Archivo inválido.';
      setError(msg);
      setFilePreview(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
      if (setPendingFile) setPendingFile(null);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setError(null);
    setFilePreview(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (isCover) {
      setPendingFile!(file);
      notifySuccess("Portada lista para subir.");
    } else {
      try {
        await uploadBanner(currentWorkId, file);
        notifySuccess("Banner actualizado con éxito.");
      } catch (err) {
        console.error('Error al subir el banner:', err);
        setError('No se pudo subir el banner. Intenta nuevamente.');
        setFilePreview(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
      }
    }
  }, [currentWorkId]);

  const handleSaveCover = async () => {
    if (!pendingCoverFile) return false;
    try {
      setSavingCover(true);
      await uploadCover(currentWorkId, pendingCoverFile, null);
      setSavingCover(false);
      setShowCoverModal(false);
      setPendingCoverFile(null);
      notifySuccess("Portada actualizada exitosamente");
      return true;
    } catch (err) {
      console.error('Error al guardar portada:', err);
      setSavingCover(false);
      setErrorCover('No se pudo guardar la portada. Intenta nuevamente.');
      return false;
    }
  };

  const handleSaveCoverAI = async (url: string) => {
    try {
      setSavingCover(true);
      await uploadCover(currentWorkId, null, url);
      setSavingCover(false);
      setShowCoverModalAi(false);
      setCoverPreview(url);
      notifySuccess("Portada generada y guardada exitosamente");
      return true;
    } catch (err) {
      console.error('Error al guardar portada:', err);
      setSavingCover(false);
      setErrorCover('No se pudo guardar la portada. Intenta nuevamente.');
      return false;
    }
  };

  const handleTagSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(newTagText, currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);
    }
  };

  const handleAISuggestion = () => {
    if (!isDescriptionValid) {
      alert("La descripción es demasiado corta. Proporciona más detalles.");
      return;
    }

    const payload: TagSuggestionRequestDTO = {
      description: descriptionF,
      title: nameWork,
      existingTags: currentTags,
    };

    setIsAILoading(true);

    suggestMutation.mutate(payload, {
      onSuccess: (data) => {
        setSuggestedTags(data.suggestions);
        setIsSuggestionMenuOpen(true);
        setIsAILoading(false);
      },
      onError: (error) => {
        console.error("Error de IA:", error);
        setIsAILoading(false);
      },
    });
  };

  const handleSuggestedTagClick = (tag: string) => {
    handleAddTag(tag, currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen, false);
    setSuggestedTags((prev) => {
      const updated = prev.filter((t) => t !== tag);
      if (updated.length === 0) {
        setIsSuggestionMenuOpen(false);
      }
      return updated;
    });
  };

  const handleCreateChapter = async (workId: number, languageId: number) => {
    const chapter = await addChapter(workId, languageId, 'TEXT');
    if (chapter?.fetchStatus === 200) {
      navigate(`/chapter/work/${workId}/edit/${chapter.chapterId}`);
      return;
    }
    navigate(`/manage-work/${workId}`);
  };

  const handleBannerClick = () => bannerInputRef.current?.click();





  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      const updatePrice: UpdateWorkDTO = {
        price: allowSubscription ? (price ? parseFloat(price) : 0) : 0,
        categoryIds: selectedCategories.map(c => c.id),
        tagIds: currentTags,
        state: workStatus || undefined
      };
      
      const response = await apiClient.request({
        url: `/manage-work/${currentWorkId}`,
        method: 'PUT',
        data: updatePrice,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        notifySuccess('Datos actualizados exitosamente');
        setPrice(allowSubscription ? price : '0');
      }
    } catch (err) {
      console.error('Error al guardar precio:', err);
      notifyError('No se pudo guardar el precio');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    work,
    loading,
    error,
    selectedCategories,
    currentTags,
    isAddingTag,
    newTagText,
    isSuggestionMenuOpen,
    isCategoryMenuOpen,
    showIATooltip,
    suggestedTags,
    showBannerTooltip,
    bannerPreview,
    coverPreview,
    errorBanner,
    errorCover,
    pendingCoverFile,
    savingCover,
    price,
    workStatus,
    allowSubscription,
    allowComments,
    categories,
    isLoadingCategory,
    errorCategory,
    showCoverModal,
    showCoverModalAi,
    isAILoading,
    nameWork,
    descriptionF,
    isSaving,
    shortMessage,
    aiSuggestionMessage,
    isDescriptionValid,

    // Referencias
    bannerInputRef,
    coverInputRef,
    suggestionMenuRef,
    suggestionCategoryMenuRef,

    // Setters
    setIsAddingTag,
    setNewTagText,
    setIsSuggestionMenuOpen,
    setIsCategoryMenuOpen,
    setShowIATooltip,
    setShowBannerTooltip,
    setPrice,
    setWorkStatus,
    setAllowSubscription,
    setAllowComments,
    setCurrentTags,
    setShowCoverModal,
    setShowCoverModalAi,

    // Funciones
    handleAddCategory,
    unselectCategory,
    handleFileChange,
    handleSaveCover,
    handleSaveCoverAI,
    handleTagSubmit,
    handleAISuggestion,
    handleSuggestedTagClick,
    handleCreateChapter,
    handleSaveChanges,
    handleBannerClick,
  };
};