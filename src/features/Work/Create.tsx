import { useNavigate } from "react-router-dom";
import { useCallback, useState, useRef, useEffect } from "react";

import Button from "../../components/Button";
import Tag from "../../components/Tag";
import CoverImageModal from "../../components/CoverImageModal";

import {SUGGESTED_TAGS} from "../../types.ts/CreateWork.types";
import { useGenerateCover, createFormDataForWork, useCreateWork, handleAddTag, validateFile, type CreateWorkDTO } from "../../services/CreateWorkService.ts";
import {useCategories} from "../../services/categoryService.ts";
import { useCategoryStore } from "../../store/CategoryStore.ts";
import type { CategoryDTO } from "../../dto/CategoryDTO.ts";
import { useFormatStore } from "../../store/FormatStore.ts";
import { useFormats } from "../../services/formatService.ts";
import { useLanguages } from '../../services/languageService.ts';
import { useLanguageStore } from '../../store/LanguageStore';
import type { CoverIaFormDTO } from "../../dto/FormCoverIaDTO.ts";
import {useArtisticStyles} from '../../services/ArtisticStylesService';
import { useArtisticStyleStore } from '../../store/ArtisticStyleStore';
import {useColorPalettes} from '../../services/ColorPaletteService';
import { useColorPaletteStore } from '../../store/ColorPaletteStore';
import {useCompositions} from '../../services/CompositionService';
import { useCompositionStore } from '../../store/CompositionStore';
import type { ArtisticStyleDTO } from '../../dto/ArtisticStyleDTO';
import type { ColorPaletteDTO } from '../../dto/ColorPaletteDTO';
import type { CompositionDTO } from '../../dto/CompositionDTO';

export default function Create() {
    const navigate = useNavigate();

    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

    const { isLoading: isLoadingStyles, error: errorStyles } = useArtisticStyles();
    const { artisticStyles, selectedArtisticStyle, selectArtisticStyle } = useArtisticStyleStore();

    const { isLoading: isLoadingPalettes, error: errorPalettes } = useColorPalettes();
    const { colorPalettes, selectedColorPalette, selectColorPalette } = useColorPaletteStore();

    const { isLoading: isLoadingCompositions, error: errorCompositions } = useCompositions();
    const { compositions, selectedComposition, selectComposition } = useCompositionStore();

    const { categories, isLoading: isLoadingCategory, error: errorCategory } = useCategories();
    const { selectedCategories, selectCategory, unselectCategory } = useCategoryStore();

    const { formats, isLoading: isLoadingFormat, error: errorFormat } = useFormats();
    const { selectedFormat, selectFormat } = useFormatStore();

    const { languages, isLoading: isLoadingLanguage, error: errorLanguage } = useLanguages();
    const { selectedLanguage, selectLanguage } = useLanguageStore();

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
    const [iaCover, setIaCover] = useState<string | null>(null);
    const [errorBanner, setErrorBanner] = useState<string | null>(null);
    const [errorCover, setErrorCover] = useState<string | null>(null);
    const [showCoverPopup, setShowCoverPopup] = useState(false);
    const [showCoverIaPopup , setShowCoverIaPopup] = useState(false);
    const [descriptionForm, setDescriptionForm] = useState('');
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const isSubmitEnabled =
        nameWork.trim() !== '' &&
        descriptionF.trim() !== '' &&
        selectedFormat !== null &&
        selectedLanguage !== null &&
        selectedCategories.length > 0 &&
        currentTags.length > 0 &&
        bannerFile !== null &&
        coverFile !== null;

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
        } else {
            setErrorBanner(null);
            setBannerFile(file);
            setBannerPreview(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
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
            formatId: selectedFormat?.id,
            originalLanguageId: selectedLanguage?.id,
            categoryIds: selectedCategories.map(cat => cat.id),
            tagIds: currentTags
        };

        const formData = createFormDataForWork(workDTO, bannerFile, coverFile);

        console.log(formData);

        try {
            const workId = await createWorkMutation.mutateAsync(formData);
            console.log("¡Obra creada con éxito!" + workId);
            navigate("/manage-work/" + (workId));
        } catch (error) {
            console.error("Error al crear la obra:", error);
            alert("Error al guardar la obra. Intente nuevamente.");
        }
    }

    const generateCoverMutation = useGenerateCover();

    const handleGenerateCover = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (!selectedArtisticStyle || !selectedColorPalette || !selectedComposition || !descriptionForm.trim()) {
            alert("Por favor, completa todos los campos para generar la portada.");
            return;
        }

        const formCoverDTO: CoverIaFormDTO = {
            artisticStyleId: selectedArtisticStyle.name,
            colorPaletteId: selectedColorPalette.name,
            compositionId: selectedComposition.name,
            description: descriptionForm
        };

        try {
            const response = await generateCoverMutation.mutateAsync(formCoverDTO);
            setIaCover(response.url);
            alert("¡Portada generada y cargada con éxito!");
            setShowCoverIaPopup(false);
        } catch (error) {
            console.error("Error al generar la portada con IA:", error);
            alert("Hubo un error al generar la portada. Por favor, intenta de nuevo.");
        }
    };

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

                        {showCoverIaPopup && (
                            <div className="fixed inset-0 flex items-center text-center justify-center z-50 bg-black/50">
                                <div className="bg-white p-6 shadow-lg flex flex-col items-center w-full max-w-xl md:max-w-5xl rounded-xl relative">
                                    <p className="text-4xl font-bold text-[#3B2252] mb-4">Genera tu portada con IA</p>
                                    <Button
                                        text=""
                                        onClick={() => setShowCoverIaPopup(false)}
                                        colorClass="absolute top-0 right-0 cursor-pointer"
                                    >
                                        <img src="/img/PopUpCierre.png" className="w-10 h-10 hover:opacity-60" alt="Cerrar" />
                                    </Button>

                                    <div className="flex flex-col md:flex-row gap-6 mb-4 w-full">
                                        <div className="flex flex-col items-start text-left gap-6 rounded-xl py-8 px-8 w-full md:w-1/2">
                                            <div className="w-full flex flex-col">
                                                <label className="text-left text-lg font-medium text-gray-700 mb-2">Estilo artístico</label>
                                                {isLoadingStyles ? (
                                                    <div className="w-full p-2 bg-gray-400 text-white rounded-md flex justify-center items-center">
                                                        <span className="text-sm">Cargando...</span>
                                                    </div>
                                                ) : errorStyles ? (
                                                    <div className="w-full p-2 bg-red-500 text-white rounded-md flex justify-center items-center">
                                                        <span className="text-sm">Error al cargar</span>
                                                    </div>
                                                ) : (
                                                    <div className="w-full p-2 bg-[#3B2252] text-white rounded-md flex justify-center items-center cursor-pointer">
                                                        <select
                                                            className="w-full bg-[#3B2252] font-medium cursor-pointer focus:outline-none"
                                                            value={selectedArtisticStyle?.id || ''}
                                                            onChange={(e) => {
                                                                const styleId = parseInt(e.target.value);
                                                                const style = artisticStyles.find((s: ArtisticStyleDTO) => s.id === styleId);
                                                                if (style) selectArtisticStyle(style);
                                                            }}
                                                        >
                                                            <option value="" disabled>Seleccionar estilo</option>
                                                            {artisticStyles.map((style: ArtisticStyleDTO) => (
                                                                <option key={style.id} value={style.id}>
                                                                    {style.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                                {selectedArtisticStyle === null && (
                                                    <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">El estilo artístico es obligatorio.</p>
                                                )}
                                            </div>

                                            <div className="w-full flex flex-col">
                                                <label className="text-left text-lg font-medium text-gray-700 mb-2">Paleta de colores</label>
                                                {isLoadingPalettes ? (
                                                    <div className="w-full p-2 bg-gray-400 text-white rounded-md flex justify-center items-center">
                                                        <span className="text-sm">Cargando...</span>
                                                    </div>
                                                ) : errorPalettes ? (
                                                    <div className="w-full p-2 bg-red-500 text-white rounded-md flex justify-center items-center">
                                                        <span className="text-sm">Error al cargar</span>
                                                    </div>
                                                ) : (
                                                    <div className="w-full p-2 bg-[#3B2252] text-white rounded-md flex justify-center items-center cursor-pointer">
                                                        <select
                                                            className="w-full bg-[#3B2252] font-medium cursor-pointer focus:outline-none"
                                                            value={selectedColorPalette?.id || ''}
                                                            onChange={(e) => {
                                                                const paletteId = parseInt(e.target.value);
                                                                const palette = colorPalettes.find((p : ColorPaletteDTO) => p.id === paletteId);
                                                                if (palette) selectColorPalette(palette);
                                                            }}
                                                        >
                                                            <option value="" disabled>Seleccionar paleta</option>
                                                            {colorPalettes.map((palette : ColorPaletteDTO) => (
                                                                <option key={palette.id} value={palette.id}>
                                                                    {palette.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                                {selectedColorPalette === null && (
                                                    <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">La paleta de colores es obligatoria.</p>
                                                )}
                                            </div>

                                            <div className="w-full flex flex-col">
                                                <label className="text-left text-lg font-medium text-gray-700 mb-2">Composición</label>
                                                {isLoadingCompositions ? (
                                                    <div className="w-full p-2 bg-gray-400 text-white rounded-md flex justify-center items-center">
                                                        <span className="text-sm">Cargando...</span>
                                                    </div>
                                                ) : errorCompositions ? (
                                                    <div className="w-full p-2 bg-red-500 text-white rounded-md flex justify-center items-center">
                                                        <span className="text-sm">Error al cargar</span>
                                                    </div>
                                                ) : (
                                                    <div className="w-full p-2 bg-[#3B2252] text-white rounded-md flex justify-center items-center cursor-pointer">
                                                        <select
                                                            className="w-full bg-[#3B2252] font-medium cursor-pointer focus:outline-none"
                                                            value={selectedComposition?.id || ''}
                                                            onChange={(e) => {
                                                                const compId = parseInt(e.target.value);
                                                                const composition = compositions.find((c : CompositionDTO )=> c.id === compId);
                                                                if (composition) selectComposition(composition);
                                                            }}
                                                        >
                                                            <option value="" disabled>Seleccionar composición</option>
                                                            {compositions.map((composition : CompositionDTO) => (
                                                                <option key={composition.id} value={composition.id}>
                                                                    {composition.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                                {selectedComposition === null && (
                                                    <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">La composición es obligatoria.</p>
                                                )}
                                            </div>

                                            <div className="w-full flex flex-col">
                                                <label className="text-left text-lg font-medium text-gray-700 mb-2">Descripción</label>
                                                <div className="w-full relative">
                          <textarea
                              className="w-full h-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent resize-none"
                              value={descriptionForm}
                              onChange={e => setDescriptionForm(e.target.value)}
                              placeholder="Ej: 'Un cazador con traje verde'..."
                          />
                                                    <p className="absolute bottom-2 right-2 text-xs text-gray-400">max 200 caracteres</p>
                                                </div>
                                                <p className="text-s text-gray-500 w-[400px]">
                                                    *Describe lo que debe ser visible. Sé específico sobre el sujeto, el entorno y la acción.
                                                </p>
                                            </div>

                                            <Button
                                                type="button"
                                                text="Generar portada"
                                                onClick={handleGenerateCover}
                                                colorClass="bg-[#172FA6] cursor-pointer hover:scale-102 text-white text-lg font-medium rounded-md transition duration-150 w-full"
                                            />
                                        </div>

                                        <div className="flex flex-col justify-center items-center text-center border-dashed border-1 rounded-xl border-[#172FA6] p-8 w-full md:w-1/2">
                                            {iaCover !== null ? (
                                                <img src={iaCover} className="w-full h-full" alt="iaCover"/>
                                            ) : (
                                                <p className="text-lg font-medium text-gray-600">Vista previa de la portada generada aparecerá aquí</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

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
                                        <div className="absolute z-20 top-10 mt-1 mr-[-10%] w-max max-w-sm lg:max-w-md">
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
                                            placeholder="Añadir nueva etiqueta"
                                            className="p-1 border border-gray-400 rounded-md text-sm w-[150px] focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                        />
                                    ) : (
                                        <Button
                                            type="button"
                                            text="+"
                                            onClick={() => setIsAddingTag(true)}
                                            colorClass="w-8 h-8 pt-0 flex justify-center rounded-full border-2 border-[#5C17A6] text-[#5C17A6] text-2xl font-medium leading-none hover:bg-[#5C17A6] hover:text-white"
                                        />
                                    )}

                                    <div
                                        className="relative"
                                        onMouseEnter={() => setShowIATooltip(true)}
                                        onMouseLeave={() => setShowIATooltip(false)}
                                    >
                                        <Button
                                            type="button"
                                            onClick={() => setIsSuggestionMenuOpen(!isSuggestionMenuOpen)}
                                            colorClass="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#5C17A6] text-white hover:bg-opacity-90 z-10 !px-0 !py-0"
                                        >
                                            <img
                                                src="/img/magic.png"
                                                className="w-6 h-6 hover:cursor-pointer"
                                                alt="Sugerencias IA"
                                            />
                                        </Button>

                                        {showIATooltip && (
                                            <div className="absolute z-20 top-0 mt-1 ml-4 w-max max-w-xs left-full bg-gray-800 text-white px-2 py-1 rounded-md whitespace-nowrap">
                                                Sugerencias de la IA
                                            </div>
                                        )}
                                    </div>

                                    {isSuggestionMenuOpen && (
                                        <div className="absolute z-20 top-10 mt-1 mr-[-30%] w-max max-w-xs">
                                            <div className="bg-white p-4 border border-gray-300 rounded-md shadow-lg flex flex-wrap gap-2">
                                                {SUGGESTED_TAGS
                                                    .filter(tag => !currentTags.includes(tag))
                                                    .map((tag) => (
                                                        <Tag
                                                            key={tag}
                                                            text={tag}
                                                            colorClass="border border-gray-300 text-gray-600 bg-transparent hover:bg-gray-100"
                                                            onClick={() => handleAddTag(tag, currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen)}
                                                        />
                                                    ))}

                                                {SUGGESTED_TAGS.filter(tag => !currentTags.includes(tag)).length === 0 && (
                                                    <p className="text-gray-500 text-sm italic">No hay más sugerencias disponibles.</p>
                                                )}
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
        </main>
    );
}
