import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WorkDTO } from '../../../../domain/dto/WorkDTO';
import type { CategoryDTO } from '../../../../domain/dto/CategoryDTO';
import { handleAddTag, validateFile, useClickOutside } from "../../../../infrastructure/services/CreateWorkService";
import { useSuggestTagsMutation } from "../../../../infrastructure/services/TagSuggestionService";
import { getWorkById } from '../../../../infrastructure/services/ChapterService';
import { uploadCover, uploadBanner } from '../../../../infrastructure/services/WorkAssetsService';
import { notifySuccess, notifyError } from "../../../../infrastructure/services/ToastProviderService";
import { useCategories } from "../../../../infrastructure/services/CategoryService";
import { apiClient } from "../../../../infrastructure/api/apiClient";
import { useAuthStore } from "../../../../infrastructure/store/AuthStore";

export const useManageWorkData = (currentWorkId: number) => {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const suggestMutation = useSuggestTagsMutation();
  const { categories, isLoading: isLoadingCategory, error: errorCategory } = useCategories();

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
  const [isLoadingTagSuggestion, setIsLoadingTagSuggestion] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [allowComments, setAllowComments] = useState(false);

  useEffect(() => {
    const loadWorkData = async () => {
      try {
        setLoading(true);
        const workData = await getWorkById(currentWorkId);
        setWork(workData);
        setSelectedCategories(workData.categories || []);
        setCurrentTags(workData.tags?.map(tag => tag.name) || []);
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
    const setPendingFile = isCover ? setPendingCoverFile : null;

    if (!result.valid) {
      const msg = result.error || 'Archivo inválido.';
      setError(msg);
      setFilePreview(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
      if (setPendingFile) setPendingFile(null);
      return;
    }

    setError(null);
    setFilePreview(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

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
    if (!pendingCoverFile) return;
    try {
      setSavingCover(true);
      await uploadCover(currentWorkId, pendingCoverFile, null);
      setSavingCover(false);
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

  const handleAISuggestion = async () => {
    if (!work?.description?.trim() && !work?.title?.trim()) {
      notifyError('Agrega una descripción o título para generar sugerencias.');
      return;
    }
    try {
      setIsLoadingTagSuggestion(true);
      const suggestionData = {
        description: work?.description || '',
        title: work?.title || '',
        existingTags: currentTags
      };
      const response = await suggestMutation.mutateAsync(suggestionData);
      setTagSuggestions(response.suggestions || []);
      setSuggestedTags(response.suggestions || []);
      setIsSuggestionMenuOpen(true);
      setIsLoadingTagSuggestion(false);
    } catch {
      notifyError('Error al obtener sugerencias. Intenta de nuevo.');
      setIsLoadingTagSuggestion(false);
    }
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

  const handleCreateChapter = (workId: number, languageId: number) => {
    navigate(`/create-chapter/${workId}/${languageId}`);
  };

  const setupClickOutside = (suggestionMenuRef: React.RefObject<HTMLElement>, suggestionCategoryMenuRef: React.RefObject<HTMLElement>) => {
    useClickOutside(suggestionMenuRef, () => setIsSuggestionMenuOpen(false));
    useClickOutside(suggestionCategoryMenuRef, () => setIsCategoryMenuOpen(false));
  };

  const handleSaveChanges = async () => {
    if (!work?.title?.trim()) {
      notifyError('El título es obligatorio.');
      return;
    }
    if (selectedCategories.length === 0) {
      notifyError('Debes seleccionar al menos una categoría.');
      return;
    }
    if (currentTags.length === 0) {
      notifyError('Debes agregar al menos un tag.');
      return;
    }

    try {
      const updateData = {
        title: work.title,
        description: work.description || '',
        categories: selectedCategories.map(c => c.id),
        tags: currentTags,
        allowComments: allowComments,
        allowSubscription: allowSubscription,
        ...(workStatus && { status: workStatus }),
        ...(allowSubscription && price && { price: parseFloat(price) })
      };

      await apiClient.request({
        url: `${import.meta.env.VITE_API_MANAGE_WORK_URL}/${currentWorkId}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        data: updateData,
      });

      notifySuccess('Cambios guardados exitosamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      notifyError('Error al guardar los cambios. Intenta nuevamente.');
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
    isLoadingTagSuggestion,
    tagSuggestions,
    allowComments,
    categories,
    isLoadingCategory,
    errorCategory,

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
    setupClickOutside,
  };
};