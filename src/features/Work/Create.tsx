import { useNavigate } from "react-router-dom";
import { useCallback, useState, useRef} from "react";

import Button from "../../components/Button";
import Tag from "../../components/Tag";

import {SUGGESTED_TAGS} from "../../types.ts/CreateWork.types";
import { createFormDataForWork, useCreateWork, handleAddTag, validateFile, type CreateWorkDTO } from "../../services/CreateWork.service";
import {useCategories} from "../../services/categoryService.ts";
import { useCategoryStore } from "../../store/CategoryStore.ts";
import type { CategoryDTO } from "../../dtos/category.dto.ts";
import { useFormatStore } from "../../store/FormatStore.ts";
import { useFormats } from "../../services/formatService.ts";
import { useLanguages } from '../../services/languageService';
import { useLanguageStore } from '../../store/LanguageStore';



export default function Create() {
  const navigate = useNavigate();

  // === Estados ===
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);


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

    // este tiene que ser id
    // traer id de formato
    // traer id de idioma

  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagText, setNewTagText] = useState('');
  const [isSuggestionMenuOpen, setIsSuggestionMenuOpen] = useState(false);
  const [showIATooltip, setShowIATooltip] = useState(false);

  const [nameWork, setNameWork] = useState('');
  const [descriptionF, setDescriptionF] = useState('');

  // Files
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [errorCover, setErrorCover] = useState<string | null>(null);
  const [showCoverPopup, setShowCoverPopup] = useState(false);
 

    // validación del Formulario 
    const isSubmitEnabled =
        nameWork.trim() !== '' &&
        descriptionF.trim() !== '' &&
        selectedFormat !== null &&
        selectedLanguage !== null &&
        selectedCategories.length > 0 &&
        currentTags.length > 0 &&
        bannerFile !== null &&
        coverFile !== null;


  // input de Tags (Enter)
  const handleTagSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
        const formattedText = newTagText.toLowerCase().replace(/\s+/g, '-');
        handleAddTag(formattedText, currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);
    }
  };
           
               // 1. Click para Banner
     const handleBannerClick = () => {
        bannerInputRef.current?.click();
    };
    
    // 2. Click para Portada
    const handleCoverClick = () => {
        coverInputRef.current?.click();
        // setShowCoverPopup(false); // Opcional: si tienes un popup, ciérralo aquí
    };

            // === LÓGICA DE MANEJO DE ARCHIVOS UNIFICADA ===
        const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean = false) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // 🛑 Configuramos las opciones de validación según el tipo de archivo 🛑
            const options = isCover
                ? { maxSizeMB: 20, maxWidth: 500, maxHeight: 800 } // Especificaciones de Portada
                : { maxSizeMB: 20, maxWidth: 1345, maxHeight: 256 }; // Especificaciones de Banner

            const result = await validateFile(file, options);

            // 🛑 Lógica de error 🛑
           if (!result.valid) {
                // 1. Manejo de Error: Setea el error y limpia el archivo
                const errorMessage = result.error || "Error de archivo desconocido.";

                if (isCover) {
                    setErrorCover(errorMessage); // Setea error de Portada
                    setCoverFile(null);          // Limpia archivo de Portada
                } else {
                    setErrorBanner(errorMessage); // Setea error de Banner
                    setBannerFile(null);          // Limpia archivo de Banner
                }
                return; // Salir de la función si hay error
            }


            if (isCover) {
                setErrorCover(null); // Limpia error de Portada
                setCoverFile(file);  // Guarda archivo de Portada
                console.log("Archivo Portada válido:", file.name);
                alert("Archivo de portada cargado correctamente.");
            } else {
                setErrorBanner(null); // Limpia error de Banner
                setBannerFile(file);  // Guarda archivo de Banner
                console.log("Archivo Banner válido:", file.name);
                alert("Archivo de banner cargado correctamente.");
            }

        }, []);

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
            return (
                <main>
                <form onSubmit={handleSubmitForm}>
                <section>
            {/* BANNER DE SUBIDA */}
                        <div
                  onClick={handleBannerClick}
                  className="w-full max-w-[1345px] h-[256px] bg-[#E8E5E5] flex justify-center items-center mx-auto 
                            border-b border-l border-r border-[rgba(0,0,0,0.5)] 
                            hover:bg-[#D7D7D7] cursor-pointer"
              >
                <div className="text-center text-gray-400 flex flex-col items-center">
                <img src="/img/Group.png" className="w-[70px] h-[55px]" alt="Subir banner" />
                <p className="text-lg text-gray-500">Subir banner</p>
                </div>
            </div>

              <div className="flex justify-center mb-4">
            <p className="text-xs text-gray-500 text-center w-[500px]">
            *Se admiten PNG, JPG, JPEG, WEBP de máximo 20mb. (Max 1345x256px).
          </p>
              </div>


            {/* Input oculto */}
            <input
                type="file"
                ref={bannerInputRef}
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
            />

            {/* Mensaje de error */}
            {errorBanner && (
                <p className="text-red-500 text-sm mt-2 text-center">
                {errorBanner}
                </p>
            )}
            </section>

      <section className="w-[1345px] mx-auto flex py-8">
        {/* Contenedor Izquierdo: Portada */}
        <div className="w-1/4 pr-8 flex flex-col items-center">
          <div className="w-[192px] h-[256px] bg-[#E8E5E5] border border-[rgba(0,0,0,0.5)] hover:bg-[#D7D7D7] rounded-md flex justify-center items-center mb-3"
                onClick={() => setShowCoverPopup(true)}>

            <div className="text-center text-gray-500 cursor-pointer">
              <img src="/img/Group.png" className="w-[50px] h-[40px]" alt="Portada" />
              <p className="text-sm">Portada</p>
            </div>
          </div>
          <Button text="Subir portada" onClick={() => setShowCoverPopup(true)}
            colorClass={`w-[192px] py-2 bg-[#3B2252] text-white text-sm rounded-md mb-2 font-bold cursor-pointer hover:scale-102`}
          />
  {showCoverPopup && (
      <div className="fixed inset-0 flex items-center text-center justify-center z-50 bg-black/50">
        <div className="bg-white p-6 shadow-lg flex flex-col items-center w-full max-w-xl md:max-w-3xl rounded-xl relative"> 
          <p className="text-5xl font-bold mb-4">Cargar Portada</p>
           <Button 
            text="" 
            onClick={() => setShowCoverPopup(false)} 
            colorClass="absolute top-4 right-4 cursor-pointer" 
        >
            <img src="/img/PopUpCierre.png" className="w-10 h-10 hover:opacity-60" alt="Cerrar"
            />
                  </Button>

          <p className="text-2xl font-semibold mb-4">Seleccione una opción</p>
<div className="flex flex-col md:flex-row gap-4 mb-4">
    {/* Primer recuadro */}
    <div className="flex flex-col items-center text-center gap-4 mb-4 border-dashed border-1 rounded-xl border-[#172FA6] py-10 px-8 w-1/2">
      <p className="text-lg font-bold mb-4">Subir una imagen</p>
      <p className="text-s font-medium mb-4 text-[#3F3E3E]">Seleccione un archivo para la imagen de su portada</p>
      <img src="/img/SubidaPortada.png" className="w-[110px] h-[90px] mt-2" alt="Subida Portada" />
      <Button text="Subir" onClick={handleCoverClick} colorClass="bg-[#172FA6] text-white px-4 py-2 font-semibold rounded cursor-pointer hover:scale-102 w-60" />
    
                        {/* Input oculto Cover */}
                        <input
                            type="file"
                            ref={coverInputRef}
                            className="hidden"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={e => handleFileChange(e, true)}
                        />

                        {/* Mensaje de error */}
            {errorCover && (
                <p className="text-red-500 text-sm mt-2 text-center">
                {errorCover}
                </p>
            )}
    </div>

    {/* Segundo recuadro*/}
    <div className="flex flex-col items-center text-center gap-4 mb-4 border-dashed border-1 rounded-xl border-[#172FA6] py-10 px-8 w-1/2">
      <p className="text-lg font-bold mb-4">Generar una imagen</p>
      <p className="text-s font-medium mb-4 text-[#3F3E3E]">Genera tu portada al instante con nuestra inteligencia artificial.</p>
      <img src="/img/IAPortada.png" className="w-[110px] h-[90px] mb-2" alt="IA Portada" />
      <Button text="Generar" onClick={() => setShowCoverPopup(false)} colorClass="bg-[#172FA6] text-white px-4 py-2 font-semibold rounded cursor-pointer hover:scale-102 w-60" />
    </div>

          </div>
        </div>
      </div> 
)}

          <p className="text-xs text-gray-500 text-center w-[192px]">
            *Se admiten PNG, JPG, JPEG, WEBP de máximo 20mb.
          </p>
        </div>

        {/* Contenedor Derecho: Formulario */}
        <div className="w-3/4 pl-8 border-l border-gray-300">
          {/* Nombre de la obra */}
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

          {/* Categorias */}
          <div className="flex flex-col mb-6">
            <div className="flex items-start">
            <label className="w-1/4 text-lg font-medium text-gray-700 pt-1">Categorías</label>
            <div className="flex gap-2 w-3/4 relative items-center flex-wrap">
                {selectedCategories.map((category) => (
                    <Tag
                        key={category.id}
                        text={category.name}
                        colorClass={`border-[#172FA6] text-[#172FA6] bg-transparent`}
                        onRemove={() => unselectCategory(category.id)}
                    />
                ))}

              {/* (+) CATS */}
              <Button
                type="button"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                colorClass={`w-8 h-8 pt-0 flex justify-center rounded-full border-2 border-[#172FA6] text-[#172FA6] text-2xl font-medium leading-none hover:bg-[#172FA6] hover:text-white z-10`}
                text={'+'}
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

          {/* Format */}
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
                    <div className="w-[120px] p-2 bg-[#3B2252] text-white rounded-md flex justify-center items-center cursor-pointer">
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

          {/* Language */}
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
                    <div className="w-[120px] p-2 bg-[#3B2252] text-white rounded-md flex justify-center items-center cursor-pointer">
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

          {/* Tags */}
          <div className="flex flex-col mb-6">
            <div className="flex items-start">
            <label className="w-1/4 text-lg font-medium text-gray-700">Etiquetas</label>
              <div className="w-3/4 flex flex-wrap gap-2 relative items-center">
              {currentTags.map((tag) => (
                <Tag
                  key={tag}
                  text={tag}
                  colorClass={`border-[#5C17A6] text-[#5C17A6]`}
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
                 colorClass={`w-8 h-8 pt-0 flex justify-center rounded-full border-2 border-[#5C17A6] text-[#5C17A6] text-2xl font-medium leading-none hover:bg-[#5C17A6] hover:text-white`}
                />
              )}

              {/* BOTON IA Y TOOLTIP */}
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
                  <div 
                    className="absolute z-20 top-0 mt-1 ml-4 w-max max-w-xs left-full bg-gray-800 text-white px-2 py-1 rounded-md whitespace-nowrap"
                  >
                    Sugerencias de la IA
                  </div>
                )}
              </div>

              {/* MENU FLOTANTE DE SUGERENCIAS */}
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

          {/* Descripción */}
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

          {/* Botón Guardar */}
          <div className="flex justify-end mt-4">
            {!isSubmitEnabled && (
                      <p className="text-sm text-yellow-600 mr-4 self-center">
                  * Completa todos los campos obligatorios antes de guardar.
                      </p>
                            )}
            <Button
              type="submit"
              text="Guardar"
              onClick={() => {}} 
              disabled={!isSubmitEnabled}
              colorClass={`${isSubmitEnabled ? 'bg-[#5C17A6] cursor-pointer hover:scale-102' : 'bg-gray-500 cursor-not-allowed'} 
                                                text-white text-lg font-medium rounded-md transition duration-150`}            
                                                />
          </div>
        </div>
      </section>
      </form>
    </main>
  );
}
