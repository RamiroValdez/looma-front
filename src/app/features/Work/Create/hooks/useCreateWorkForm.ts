import { useNavigate } from "react-router-dom";
import { useCallback, useState, useRef, useEffect } from "react";
import { useSuggestTagsMutation } from "../../../../../infrastructure/services/TagSuggestionService";
import {
    createFormDataForWork,
    useCreateWork,
    handleAddTag,
    validateFile,
    useClickOutside
} from "../../../../../infrastructure/services/CreateWorkService";
import { useCategoryStore } from "../../../../../infrastructure/store/CategoryStore";
import { useFormatStore } from "../../../../../infrastructure/store/FormatStore";
import { useLanguages } from '../../../../../infrastructure/services/LanguageService';
import { useLanguageStore } from '../../../../../infrastructure/store/LanguageStore';
import { notifySuccess, notifyError } from "../../../../../infrastructure/services/ToastProviderService";
import { useCategories } from "../../../../hooks/useCategories";
import { useFormats } from "../../../../hooks/useFormats";
import type { CategoryDTO } from "../../../../../domain/dto/CategoryDTO";
import type { TagSuggestionRequestDTO } from "../../../../../domain/dto/TagSuggestionDTO";
import type { CreateWorkDTO } from "../../../../../infrastructure/services/CreateWorkService";

export function useCreateWorkForm() {
    const navigate = useNavigate();

    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const { categories, isLoading: isLoadingCategory, error: errorCategory } = useCategories();
    const { selectedCategories, selectCategory, unselectCategory, clearSelectedCategories } = useCategoryStore();

    const { formats, isLoading: isLoadingFormat, error: errorFormat } = useFormats();
    const { selectedFormat, selectFormat, clearSelectedFormat } = useFormatStore();

    const { languages, isLoading: isLoadingLanguage, error: errorLanguage } = useLanguages();
    const { selectedLanguage, selectLanguage , clearSelectedLanguage } = useLanguageStore();

    const [currentTags, setCurrentTags] = useState<string[]>([]);
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [newTagText, setNewTagText] = useState('');
    const [isSuggestionMenuOpen, setIsSuggestionMenuOpen] = useState(false);
    const [showIATooltip, setShowIATooltip] = useState(false);
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const suggestMutation = useSuggestTagsMutation();

    const [nameWork, setNameWork] = useState('');
    const [descriptionF, setDescriptionF] = useState('');
    const isDescriptionValidForm = descriptionF.trim().length >= 30;
    const [isPaid , setIsPaid] = useState(false);
    const [price, setPrice] = useState<number>(0);

    const bannerInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverIaUrl, setCoverIaUrl] = useState<string | null>(null);
    const [errorBanner, setErrorBanner] = useState<string | null>(null);
    const [errorCover, setErrorCover] = useState<string | null>(null);
    const [showCoverPopup, setShowCoverPopup] = useState(false);
    const [showCoverIaPopup , setShowCoverIaPopup] = useState(false);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const [isAILoading, setIsAILoading] = useState(false);
    const shortMessage = "Tags con IA: tu descripción tiene menos de 20 caracteres."; 
    const aiSuggestionMessage = "Sugerencias de la IA";
    const isDescriptionValid = descriptionF.trim().length > 20; 
    const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isSubmitEnabled =
        nameWork.trim() !== '' &&
        descriptionF.trim().length > 30 &&
        selectedFormat !== null &&
        selectedLanguage !== null &&
        selectedCategories.length > 0 &&
        currentTags.length > 0 &&
        (!isPaid || (isPaid && price > 0)) &&
        bannerFile !== null &&
        (coverFile !== null||coverIaUrl !== null);

    const handleAddCategory = (category: CategoryDTO) => {
        selectCategory(category);
        setIsCategoryMenuOpen(false);
    };

    const handleTagSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const formattedText = newTagText.toLowerCase().replace(/\s+/g, '-');
            handleAddTag(formattedText, currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);
        }
    };

    const handleToggle = () => {
        setIsPaid(!isPaid);
    };

    const handleBannerClick = () => {
        bannerInputRef.current?.click();
    };

    const handleCoverClick = () => {
        coverInputRef.current?.click();
    };

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const options = isCover
            ? { maxSizeMB: 20, maxWidth: 500, maxHeight: 800 }
            : { maxSizeMB: 20, maxWidth: 1345, maxHeight: 256 };

        const setError = isCover ? setErrorCover : setErrorBanner;
        const setFile = isCover ? setCoverFile : setBannerFile;
        const setFilePreview = isCover ? setCoverPreview : setBannerPreview;
        const inputRef = isCover ? coverInputRef : bannerInputRef;
        const successMsg = isCover ? "Portada subida con éxito." : "Banner subido con éxito.";

        const result = await validateFile(file, options);

        if (!result.valid) {
            const errorMessage = result.error || "Error de archivo desconocido.";
            setError(errorMessage);
            setFile(null);
            setFilePreview(prev => { if (prev) URL.revokeObjectURL(prev); return null; });

            if (inputRef.current) inputRef.current.value = '';
            return;
        }
        setError(null);
        setFile(file);
        notifySuccess(successMsg);
        setFilePreview(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(file);
        });

        if (inputRef.current) inputRef.current.value = '';
        if (isCover) {
            setShowCoverPopup(false);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (bannerPreview) URL.revokeObjectURL(bannerPreview);
            if (coverPreview) URL.revokeObjectURL(coverPreview);
        };
    }, [bannerPreview, coverPreview]);

    const createWorkMutation = useCreateWork();

    const handleSubmitForm = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setHasTriedSubmit(true);

        if (!isSubmitEnabled) {
            console.error("Error: Intento de envío de formulario incompleto.");
            return;
        }

        const workDTO: CreateWorkDTO = {
            title: nameWork,
            description: descriptionF,
            formatId: selectedFormat ? selectedFormat.id : null, 
            originalLanguageId: selectedLanguage ? selectedLanguage.id : null,
            categoryIds: selectedCategories.map(cat => cat.id), 
            tagIds: currentTags,
            price: isPaid ? price : 0,
            coverIaUrl: coverIaUrl || undefined
        };
        const formData = createFormDataForWork(workDTO, bannerFile, coverFile);

        try {
            setIsSubmitting(true);
            const workId = await createWorkMutation.mutateAsync(formData);
            clearSelectedFormat();   
            clearSelectedLanguage();
            clearSelectedCategories(); 
            notifySuccess("Obra creada con éxito.");
            navigate("/manage-work/" + (workId));
        } catch (error) {
            console.error("Error al crear la obra:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAISuggestion = () => {
        if (!isDescriptionValid) {
            notifyError("La descripción es demasiado corta. Proporciona más detalles.");
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
            onError: () => {
                notifyError("Error: No se pudieron generar las etiquetas. Inténtalo más tarde.");
                setIsAILoading(false);
            },
        });
    };

    const suggestionMenuRef = useRef<HTMLDivElement>(null);
    const suggestionCategoryMenuRef = useRef<HTMLDivElement>(null);
    useClickOutside(suggestionMenuRef, () => setIsSuggestionMenuOpen(false));
    useClickOutside(suggestionCategoryMenuRef, () => setIsCategoryMenuOpen(false));

    return {
        categories, isLoadingCategory, errorCategory,
        selectedCategories, selectCategory, unselectCategory, clearSelectedCategories,
        isCategoryMenuOpen, setIsCategoryMenuOpen, handleAddCategory,
        suggestionCategoryMenuRef,

        formats, isLoadingFormat, errorFormat,
        selectedFormat, selectFormat, clearSelectedFormat,

        languages, isLoadingLanguage, errorLanguage,
        selectedLanguage, selectLanguage, clearSelectedLanguage,

        currentTags, setCurrentTags, isAddingTag, setIsAddingTag, newTagText, setNewTagText,
        isSuggestionMenuOpen, setIsSuggestionMenuOpen, showIATooltip, setShowIATooltip,
        suggestedTags, setSuggestedTags, suggestMutation, handleTagSubmit, handleAISuggestion,
        suggestionMenuRef, handleAddTag,

        nameWork, setNameWork, descriptionF, setDescriptionF, isPaid, setIsPaid, price, setPrice,
        handleToggle, isDescriptionValidForm,

        bannerInputRef, coverInputRef, bannerFile, setBannerFile, coverFile, setCoverFile,
        coverIaUrl, setCoverIaUrl, errorBanner, setErrorBanner, errorCover, setErrorCover,
        showCoverPopup, setShowCoverPopup, showCoverIaPopup, setShowCoverIaPopup,
        bannerPreview, setBannerPreview, coverPreview, setCoverPreview,
        handleBannerClick, handleCoverClick, handleFileChange,

        isAILoading, shortMessage, aiSuggestionMessage, isDescriptionValid,
        hasTriedSubmit, setHasTriedSubmit, isSubmitting, setIsSubmitting,
        isSubmitEnabled, handleSubmitForm
    };
}