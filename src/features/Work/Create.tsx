import { useNavigate } from "react-router-dom";
import { useCallback, useState, useRef, useEffect } from "react";

import Button from "../../components/Button";
import Tag from "../../components/Tag";
import CoverImageModal from "../../components/CoverImageModal";

import { useSuggestTagsMutation } from "../../services/TagSuggestionService.ts";
import CoverAiModal from "../../components/create/CoverAiModal.tsx";
import {
    createFormDataForWork,
    useCreateWork,
    handleAddTag,
    validateFile,
    type CreateWorkDTO,
    useClickOutside
} from "../../services/CreateWorkService.ts";
import {useCategories} from "../../services/categoryService.ts";
import { useCategoryStore } from "../../store/CategoryStore.ts";
import type { CategoryDTO } from "../../dto/CategoryDTO.ts";
import { useFormatStore} from "../../store/FormatStore.ts";
import { useFormats } from "../../services/formatService.ts";
import { useLanguages } from '../../services/languageService.ts';
import { useLanguageStore } from '../../store/LanguageStore';
import type {TagSuggestionRequestDTO} from "../../dto/TagSuggestionDTO.ts";
import { notifySuccess } from "../../services/ToastProviderService.ts";


export default function Create() {
    const navigate = useNavigate();

    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const { categories, isLoading: isLoadingCategory, error: errorCategory } = useCategories();
    const { selectedCategories, selectCategory, unselectCategory, clearSelectedCategories } = useCategoryStore();
    const { formats, isLoading: isLoadingFormat, error: errorFormat } = useFormats();
    const { selectedFormat, selectFormat, clearSelectedFormat } = useFormatStore();
    const { languages, isLoading: isLoadingLanguage, error: errorLanguage } = useLanguages();
    const { selectedLanguage, selectLanguage , clearSelectedLanguage } = useLanguageStore();

    const handleAddCategory = (category: CategoryDTO) => {
        selectCategory(category);
        setIsCategoryMenuOpen(false);
    };

    const [currentTags, setCurrentTags] = useState<string[]>([]);
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [newTagText, setNewTagText] = useState('');
    const [isSuggestionMenuOpen, setIsSuggestionMenuOpen] = useState(false);
    const [showIATooltip, setShowIATooltip] = useState(false);

    const [nameWork, setNameWork] = useState('');
    const [descriptionF, setDescriptionF] = useState('');

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
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const shortMessage = "Tags con IA: tu descripción tiene menos de 20 caracteres."; 
    const aiSuggestionMessage = "Sugerencias de la IA";
    const suggestMutation = useSuggestTagsMutation();

    const isDescriptionValid = descriptionF.trim().length > 20; 

    const isSubmitEnabled =
        nameWork.trim() !== '' &&
        descriptionF.trim() !== '' &&
        selectedFormat !== null &&
        selectedLanguage !== null &&
        selectedCategories.length > 0 &&
        currentTags.length > 0 &&
        bannerFile !== null &&
        (coverFile !== null)||(coverIaUrl !== null);

    const handleTagSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const formattedText = newTagText.toLowerCase().replace(/\s+/g, '-');
            handleAddTag(formattedText, currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);
        }
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

        const result = await validateFile(file, options);

        if (!result.valid) {
            const errorMessage = result.error || "Error de archivo desconocido.";
            if (isCover) {
                setErrorCover(errorMessage);
                setCoverFile(null);
                setCoverPreview(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
                if (coverInputRef.current) coverInputRef.current.value = '';
            } else {
                setErrorBanner(errorMessage);
                setBannerFile(null);
                setBannerPreview(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
                if (bannerInputRef.current) bannerInputRef.current.value = '';
            }
            return;
        }

        if (isCover) {
            setErrorCover(null);
            setCoverFile(file);
            setCoverPreview(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
            if (coverInputRef.current) coverInputRef.current.value = '';
            notifySuccess("Portada subida con éxito.");
        } else {
            setErrorBanner(null);
            setBannerFile(file);
            setBannerPreview(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
            notifySuccess("Banner subido con éxito.");
            if (bannerInputRef.current) bannerInputRef.current.value = '';
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
            coverIaUrl: coverIaUrl || undefined
        };
        const formData = createFormDataForWork(workDTO, bannerFile, coverFile);

        try {
            console.log("Enviando formulario...");
            const workId = await createWorkMutation.mutateAsync(formData);
            console.log("¡Obra creada con éxito!" + workId);
            clearSelectedFormat();   
            clearSelectedLanguage();
            clearSelectedCategories(); 
            notifySuccess("Obra creada con éxito.");
            navigate("/manage-work/" + (workId));
        } catch (error) {
            console.error("Error al crear la obra:", error);
        }
    }

     // --- FUNCIÓN QUE GESTIONA LA LLAMADA A LA IA ---
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
            },
            onError: (error) => {
                console.error("Error de IA:", error);
            },
            onSettled: () => {
                setIsAILoading(false); 
            }
        });
    };

    const suggestionMenuRef = useRef<HTMLDivElement>(null);
    const suggestionCategoryMenuRef = useRef<HTMLDivElement>(null);
    useClickOutside(suggestionMenuRef, () => setIsSuggestionMenuOpen(false));
    useClickOutside(suggestionCategoryMenuRef, () => setIsCategoryMenuOpen(false));


    return (
        <main>
            <form onSubmit={handleSubmitForm}>
                <section>
                    <div
                        onClick={handleBannerClick}
                        className="w-full max-w-[1345px] h-[256px] bg-[#E8E5E5] flex justify-center items-center mx-auto border-b border-l border-r border-[rgba(0,0,0,0.5)] hover:bg-[#D7D7D7] cursor-pointer bg-cover bg-center"
                        style={bannerPreview ? { backgroundImage: `url(${bannerPreview})` } : undefined}
                    >
                        {!bannerPreview && (
                            <div className="text-center text-gray-400 flex flex-col items-center">
                                <img src="/img/Group.png" className="w-[70px] h-[55px]" alt="Subir banner" />
                                <p className="text-lg text-gray-500">Subir banner</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mb-4">
                        <p className="text-xs text-gray-500 text-center w-[500px]">
                            *Se admiten PNG, JPG, JPEG, WEBP de máximo 20mb. (Max 1345x256px).
                        </p>
                    </div>

                    <input
                        type="file"
                        ref={bannerInputRef}
                        className="hidden"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleFileChange}
                    />

                    {errorBanner && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            {errorBanner}
                        </p>
                    )}
                </section>

                <section className="w-[1345px] mx-auto flex py-8">
                    <div className="w-1/4 pr-8 flex flex-col items-center">
                        <div className="w-[192px] h-[256px] bg-[#E8E5E5] border border-[rgba(0,0,0,0.5)] hover:bg-[#D7D7D7] rounded-md flex justify-center items-center mb-3 cursor-pointer"
                             onClick={() => setShowCoverPopup(true)}>
                            {coverPreview ? (
                                <img src={coverPreview} className="w-[192px] h-[256px] object-cover rounded-md" alt="Portada preview" />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <img src="/img/Group.png" className="w-[50px] h-[40px]" alt="Portada" />
                                    <p className="text-sm">Portada</p>
                                </div>
                            )}
                        </div>

                        <Button
                            text="Subir portada"
                            onClick={() => setShowCoverPopup(true)}
                            colorClass="w-[192px] py-2 bg-[#3B2252] text-white text-sm rounded-md mb-2 font-bold cursor-pointer hover:scale-102"
                        />

                        <input
                            type="file"
                            ref={coverInputRef}
                            className="hidden"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={e => handleFileChange(e, true)}
                        />

                        <CoverImageModal
                            isOpen={showCoverPopup}
                            onClose={() => setShowCoverPopup(false)}
                            onUploadClick={handleCoverClick}
                            onGenerateClick={() => {
                                setShowCoverPopup(false);
                                setShowCoverIaPopup(true);
                            }}
                            errorMessage={errorCover}
                        />

                        <CoverAiModal
                            isOpen={showCoverIaPopup}
                            onClose={() => setShowCoverIaPopup(false)}
                            onSetIaCoverUrlForPreview={setCoverPreview}
                            onSetIaCoverUrl={setCoverIaUrl}
                        />

                        <p className="text-xs text-gray-500 text-center w-[192px]">
                            *Se admiten PNG, JPG, JPEG, WEBP de máximo 20mb.
                        </p>

                        {errorCover && (
                            <p className="text-red-500 text-sm mt-2 text-center">
                                {errorCover}
                            </p>
                        )}
                    </div>

                    <div className="w-3/4 pl-8 border-l border-gray-300">
                        <div className="flex flex-col mb-6">
                            <div className="flex items-center">
                                <label className="w-1/4 text-lg font-medium text-gray-700">Nombre de la obra</label>
                                <input
                                    type="text"
                                    value={nameWork}
                                    onChange={e => setNameWork(e.target.value)}
                                    className={`w-3/4 p-2 border ${nameWork.trim() === '' ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:border-transparent`}
                                />
                            </div>
                            {nameWork.trim() === '' && (
                                <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">El nombre es obligatorio.</p>
                            )}
                        </div>

                        <div className="flex flex-col mb-6">
                            <div className="flex items-start">
                                <label className="w-1/4 text-lg font-medium text-gray-700 pt-1">Categorías</label>
                                <div className="flex gap-2 w-3/4 relative items-center flex-wrap">
                                    {selectedCategories.map((category) => (
                                        <Tag
                                            key={category.id}
                                            text={category.name}
                                            colorClass="border-[#172FA6] text-[#172FA6] bg-transparent"
                                            onRemove={() => unselectCategory(category.id)}
                                        />
                                    ))}

                                    <Button
                                        type="button"
                                        onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                                        colorClass="w-8 h-8 pt-0 flex justify-center rounded-full border-2 border-[#172FA6] text-[#172FA6] text-2xl font-medium leading-none hover:bg-[#172FA6] hover:text-white z-10 cursor-pointer"
                                        text="+"
                                    />

                                    {isCategoryMenuOpen && (
                                        <div ref={suggestionCategoryMenuRef} className="absolute z-20 top-10 mt-1 mr-[-10%] w-max max-w-sm lg:max-w-md">
                                            <div className="bg-white p-4 border border-gray-300 rounded-md shadow-lg flex flex-wrap gap-2">
                                                {isLoadingCategory ? (
                                                    <p className="text-gray-500">Cargando categorías...</p>
                                                ) : errorCategory ? (
                                                    <p className="text-red-500">Error al cargar categorías</p>
                                                ) : (
                                                    categories
                                                        .filter((c) => !selectedCategories.some(sc => sc.id === c.id))
                                                        .map((category) => (
                                                            <Tag
                                                                key={category.id}
                                                                text={category.name}
                                                                colorClass="border border-gray-300 text-gray-600 bg-transparent hover:bg-gray-100"
                                                                onClick={() => handleAddCategory(category)}
                                                            />
                                                        ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedCategories.length === 0 && (
                                <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">Selecciona al menos una categoría.</p>
                            )}
                        </div>

                        <div className="flex flex-col mb-6">
                            <div className="flex items-center">
                                <label className="w-1/4 text-lg font-medium text-gray-700">Formato</label>
                                {isLoadingFormat ? (
                                    <div className="w-[120px] p-2 bg-gray-400 text-white rounded-md flex justify-center items-center">
                                        <span className="text-sm">Cargando...</span>
                                    </div>
                                ) : errorFormat ? (
                                    <div className="w-[120px] p-2 bg-red-500 text-white rounded-md flex justify-center items-center">
                                        <span className="text-sm">Error</span>
                                    </div>
                                ) : (
                                    <div className="w-[120px] p-2 bg-[#3B2252] text-white rounded-md flex justify-center items-center">
                                        <select
                                            className="bg-[#3B2252] font-medium cursor-pointer"
                                            value={selectedFormat?.id || ''}
                                            onChange={e => {
                                                const formatId = parseInt(e.target.value);
                                                const format = formats.find(f => f.id === formatId);
                                                if (format) selectFormat(format);
                                            }}
                                        >
                                            <option value="" disabled>Seleccionar</option>
                                            {formats.map((format) => (
                                                <option key={format.id} value={format.id}>
                                                    {format.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            {selectedFormat === null && (
                                <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">El formato es obligatorio.</p>
                            )}
                        </div>

                        <div className="flex flex-col mb-6">
                            <div className="flex items-center">
                                <label className="w-1/4 text-lg font-medium text-gray-700">Idioma Original</label>
                                {isLoadingLanguage ? (
                                    <div className="w-[120px] p-2 bg-gray-400 text-white rounded-md flex justify-center items-center">
                                        <span className="text-sm">Cargando...</span>
                                    </div>
                                ) : errorLanguage ? (
                                    <div className="w-[120px] p-2 bg-red-500 text-white rounded-md flex justify-center items-center">
                                        <span className="text-sm">Error</span>
                                    </div>
                                ) : (
                                    <div className="w-[120px] p-2 bg-[#3B2252] text-white rounded-md flex justify-center items-center">
                                        <select
                                            className="bg-[#3B2252] font-medium cursor-pointer"
                                            value={selectedLanguage?.id || ''}
                                            onChange={(e) => {
                                                const languageId = parseInt(e.target.value);
                                                const language = languages.find(l => l.id === languageId);
                                                if (language) selectLanguage(language);
                                            }}
                                        >
                                            <option value="" disabled>Seleccionar</option>
                                            {languages.map((language) => (
                                                <option key={language.id} value={language.id}>
                                                    {language.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            {selectedLanguage === null && (
                                <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">El idioma es obligatorio.</p>
                            )}
                        </div>

                        <div className="flex flex-col mb-6">
                            <div className="flex items-start">
                                <label className="w-1/4 text-lg font-medium text-gray-700">Etiquetas</label>
                                <div className="w-3/4 flex flex-wrap gap-2 relative items-center">
                                    {currentTags.map((tag) => (
                                        <Tag
                                            key={tag}
                                            text={tag}
                                            colorClass="border-[#5C17A6] text-[#5C17A6]"
                                            onRemove={() =>
                                                setCurrentTags(currentTags.filter(t => t !== tag))
                                            }
                                        />
                                    ))}

                                    {isAddingTag ? (
                                        <input
                                            type="text"
                                            value={newTagText}
                                            onChange={(e) => setNewTagText(e.target.value)}
                                            onKeyDown={handleTagSubmit}
                                            onBlur={() => setIsAddingTag(false)}
                                            autoFocus
                                            placeholder="Enter para añadir etiqueta"
                                            className="p-1 border border-gray-400 rounded-md text-sm w-[150px] focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                        />
                                    ) : (
                                        <Button
                                            type="button"
                                            text="+"
                                            onClick={() => setIsAddingTag(true)}
                                            colorClass="w-8 h-8 pt-0 flex justify-center rounded-full border-2 border-[#5C17A6] text-[#5C17A6] text-2xl font-medium leading-none hover:bg-[#5C17A6] hover:text-white cursor-pointer"
                                        />
                                    )}

                                <div 
                                    className={`relative`}
                                    onMouseEnter={() => setShowIATooltip(true)}
                                    onMouseLeave={() => setShowIATooltip(false)}
                                >
                                    <Button
                                        type="button"
                                        onClick={handleAISuggestion} 
                                        disabled={isAILoading || !isDescriptionValid}
                                        colorClass={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#5C17A6] !py-0 !px-0`}
                                    >
                                        {isAILoading ? 
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">...</svg> 
                                            : 
                                            <img src="/img/magic.png"  className={`w-8 h-6 ${isDescriptionValid ? 'hover:cursor-pointer' : 'cursor-not-allowed'}`}
                                            />
                                        }
                                    </Button>

                                    {showIATooltip && !isAILoading && (
                                        <div className="absolute z-30 top-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded-md whitespace-nowrap">
                                                {isDescriptionValid ? aiSuggestionMessage : shortMessage}
                                        </div>
                                    )}
                                </div>

                                {isSuggestionMenuOpen && (
                                    <div ref={suggestionMenuRef} className="absolute z-20 top-10 mt-1 mr-[-30%] w-max max-w-xs">
                                        <div className="bg-white p-4 border border-gray-300 rounded-md shadow-lg flex flex-wrap gap-2">
                                            {suggestedTags.map((tag) => (
                                                <Tag
                                                    key={tag}
                                                    text={tag}
                                                    colorClass="border border-gray-300 text-gray-600 bg-transparent hover:bg-gray-100" 
                                                    onClick={() => {handleAddTag(tag, currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen, false);
                                                        setSuggestedTags((prev) => prev.filter((t) => t !== tag));
                                                        setSuggestedTags((prev) => {
                                                            const updated = prev.filter((t) => t !== tag);
                                                            if (updated.length === 0) {
                                                                setIsSuggestionMenuOpen(false);
                                                            }
                                                            return updated;
                                                        });
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                </div>
                            </div>

                            {currentTags.length === 0 && (
                                <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">Debes agregar al menos una etiqueta.</p>
                            )}

                        </div>

                        <div className="flex flex-col mb-6">
                            <div className="flex items-start">
                                <label className="w-1/4 text-lg font-medium text-gray-700">Descripción</label>
                                <div className="w-3/4 relative">
                  <textarea className={`w-full h-40 p-2 border ${descriptionF.trim() === '' ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:border-transparent resize-none`}
                            value={descriptionF}
                            onChange={e => setDescriptionF(e.target.value)}>
                  </textarea>

                                    <p className="absolute bottom-2 right-2 text-xs text-gray-500">max 400 caracteres</p>
                                </div>
                            </div>
                            {descriptionF.trim() === '' && (
                                <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">La descripción es obligatoria.</p>
                            )}
                        </div>

                        <div className="flex justify-end mt-4">
                            {!isSubmitEnabled && (
                                <p className="text-sm text-yellow-600 mr-4 self-center">
                                    * Completa todos los campos obligatorios antes de guardar.
                                </p>
                            )}
                            <Button
                                type="submit"
                                text="Guardar"
                                onClick={() => { }}
                                disabled={!isSubmitEnabled}
                                colorClass={`${isSubmitEnabled ? 'bg-[#5C17A6] cursor-pointer hover:scale-102' : 'bg-gray-500 cursor-not-allowed'} text-white text-lg font-medium rounded-md transition duration-150`}
                            />
                        </div>
                    </div>
                </section>
            </form>

            {isAILoading && (
         <div 
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" >

            <div className="bg-white p-6 rounded-xl shadow-2xl flex items-center">     
        <svg aria-hidden="true" role="status" className="inline w-6 h-6 me-3 text-[#5C17A6] animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#9d9d9eff"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
                <span className="text-lg font-semibold text-[#5C17A6] ml-2">
                    Generando tags con Inteligencia Artificial...
                </span>
            </div>
        </div>
        )}
        </main>
    );
}
