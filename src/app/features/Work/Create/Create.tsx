import Button from "../../../components/Button";
import Tag from "../../../components/Tag";
import CoverImageModal from "../../../components/CoverImageModal";
import CoverAiModal from "../../../components/create/CoverAiModal";
import { useCreateWorkForm } from "./hooks/useCreateWorkForm";
import { Loader } from "../../../components/Loader";

export default function Create() {
    const form = useCreateWorkForm();

    return (
        <main>
            <form onSubmit={form.handleSubmitForm}>
                <section>
                    <div
                        onClick={form.handleBannerClick}
                        className="w-full h-[180px] sm:h-[256px] bg-[#E8E5E5] flex justify-center items-center mx-auto border-b border-l border-r border-[rgba(0,0,0,0.5)] hover:bg-[#D7D7D7] cursor-pointer bg-cover bg-center"
                        style={form.bannerPreview ? { backgroundImage: `url(${form.bannerPreview})` } : undefined}
                    >
                        {!form.bannerPreview && (
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
                        ref={form.bannerInputRef}
                        className="hidden"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={form.handleFileChange}
                        data-testid="banner-input"
                    />
                    {form.errorBanner && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            {form.errorBanner}
                        </p>
                    )}
                </section>

                <section className="w-full sm:w-[1345px] mx-auto flex flex-col sm:flex-row py-8">
                    <div className="w-full sm:w-1/4 sm:pr-8 flex flex-col items-center mb-6 sm:mb-0">
                        <div className="w-[192px] h-[256px] bg-[#E8E5E5] border border-[rgba(0,0,0,0.5)] hover:bg-[#D7D7D7] rounded-md flex justify-center items-center mb-3 cursor-pointer"
                            onClick={() => form.setShowCoverPopup(true)}>
                            {form.coverPreview ? (
                                <img src={form.coverPreview} className="w-[192px] h-[256px] object-cover rounded-md" alt="Portada preview" />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <img src="/img/Group.png" className="w-[50px] h-[40px]" alt="Portada" />
                                    <p className="text-sm">Portada</p>
                                </div>
                            )}
                        </div>
                        <Button
                            text="Subir portada"
                            onClick={() => form.setShowCoverPopup(true)}
                            colorClass="w-[192px] py-2 bg-[#3B2252] text-white text-sm rounded-md mb-2 font-bold cursor-pointer hover:scale-102"
                        />
                        <input
                            type="file"
                            ref={form.coverInputRef}
                            className="hidden"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={e => form.handleFileChange(e, true)}
                            data-testid="cover-input"
                        />
                        <CoverImageModal
                            isOpen={form.showCoverPopup}
                            onClose={() => form.setShowCoverPopup(false)}
                            onUploadClick={form.handleCoverClick}
                            onGenerateClick={() => {
                                form.setShowCoverPopup(false);
                                form.setShowCoverIaPopup(true);
                            }}
                            errorMessage={form.errorCover}
                        />
                        <CoverAiModal
                            isOpen={form.showCoverIaPopup}
                            onClose={() => form.setShowCoverIaPopup(false)}
                            onSetIaCoverUrlForPreview={form.setCoverPreview}
                            onSetIaCoverUrl={form.setCoverIaUrl}
                        />
                        <p className="text-xs text-gray-500 text-center w-[192px]">
                            *Se admiten PNG, JPG, JPEG, WEBP de máximo 20mb.
                        </p>
                        {form.errorCover && (
                            <p className="text-red-500 text-sm mt-2 text-center">
                                {form.errorCover}
                            </p>
                        )}
                    </div>

                    <div className="w-full sm:w-3/4 sm:pl-8 border-l border-gray-300">
                        <div className="flex flex-col mb-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 w-full">
                                <label className="text-lg font-medium text-gray-700 mb-2 sm:mb-0 sm:w-1/4 w-full">
                                    Nombre de la obra
                                </label>
                                <input
                                    type="text"
                                    placeholder="Título de la obra"
                                    data-testid="work-title"
                                    value={form.nameWork}
                                    onChange={e => form.setNameWork(e.target.value)}
                                    className={`w-full sm:w-3/4 p-2 border ${form.hasTriedSubmit && form.nameWork.trim() === '' ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:border-transparent`}
                                />
                            </div>
                            {form.hasTriedSubmit && form.nameWork.trim() === '' && (
                                <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">El nombre es obligatorio.</p>
                            )}
                        </div>

                        <div className="flex flex-col mb-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 w-full">
                                <label className="text-lg font-medium text-gray-700 mb-2 sm:mb-0 sm:w-1/4 w-full">
                                    Categorías
                                </label>
                                <div className="flex gap-2 w-3/4 relative items-center flex-wrap">
                                    {form.selectedCategories.map((category) => (
                                        <Tag
                                            key={category.id}
                                            text={category.name}
                                            colorClass="border-[#172FA6] text-[#172FA6] bg-transparent"
                                            onRemove={() => form.unselectCategory(category.id)}
                                        />
                                    ))}
                                    <div className="flex flex-col">
                                        {form.selectedCategories.length < 2 && (
                                            <Button
                                                type="button"
                                                data-testid="open-category-menu"
                                                onClick={() => form.setIsCategoryMenuOpen(!form.isCategoryMenuOpen)}
                                                colorClass="w-8 h-8 pt-0 flex justify-center rounded-full border-2 border-[#172FA6] text-[#172FA6] text-2xl font-medium leading-none hover:bg-[#172FA6] hover:text-white z-10 cursor-pointer"
                                                text="+"
                                                name="+"
                                            />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 w-full">*Puedes agregar hasta 2 categorías</p>
                                    {form.isCategoryMenuOpen && (
                                        <div ref={form.suggestionCategoryMenuRef} className="absolute z-20 top-10 mt-1 mr-[-10%] w-max max-w-sm lg:max-w-md">
                                            <div className="bg-white p-4 border border-gray-300 rounded-md shadow-lg flex flex-wrap gap-2">
                                                {form.isLoadingCategory ? (
                                                   
      <div className="min-h-screen flex items-center justify-center bg-[#f4f0f7]">
        <Loader size="md" color="primary" />
      </div>
                                                ) : form.errorCategory ? (
                                                    <p className="text-red-500">Error al cargar categorías</p>
                                                ) : (
                                                    form.categories
                                                        .filter((c) => !form.selectedCategories.some(sc => sc.id === c.id))
                                                        .map((category) => (
                                                            <Tag
                                                                key={category.id}
                                                                text={category.name}
                                                                colorClass="border border-gray-300 text-gray-600 bg-transparent hover:bg-gray-100"
                                                                onClick={() => form.handleAddCategory(category)}
                                                            />
                                                        ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {form.hasTriedSubmit && form.selectedCategories.length === 0 && (
                                <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">Selecciona al menos una categoría.</p>
                            )}
                        </div>

                        <div className="flex flex-col mb-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 w-full">
                                <label className="text-lg font-medium text-gray-700 mb-2 sm:mb-0 sm:w-1/4 w-full">
                                    Formato
                                </label>
                                {form.isLoadingFormat ? (
                                    <div className="w-[120px] p-2 bg-gray-400 text-white rounded-md flex justify-center items-center">
                                        <Loader size="sm" color="white" />
                                    </div>
                                ) : form.errorFormat ? (
                                    <div className="w-[120px] p-2 bg-red-500 text-white rounded-md flex justify-center items-center">
                                        <span className="text-sm">Error</span>
                                    </div>
                                ) : (
                                    <div className="w-40 p-2 bg-[#3B2252] text-white rounded-md flex justify-center items-center">
                                        <select
                                            data-testid="format-select"
                                            className="bg-[#3B2252] font-medium cursor-pointer"
                                            value={form.selectedFormat?.id || ''}
                                            onChange={e => {
                                                const formatId = parseInt(e.target.value);
                                                const format = form.formats.find(f => f.id === formatId);
                                                if (format) form.selectFormat(format);
                                            }}
                                        >
                                            <option value="" disabled>Seleccionar</option>
                                            {form.formats.map((format) => (
                                                <option key={format.id} value={format.id}>
                                                    {format.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            {form.hasTriedSubmit && form.selectedFormat === null && (
                                <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">El formato es obligatorio.</p>
                            )}
                        </div>

                        <div className="flex flex-col mb-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 w-full">
                                <label className="text-lg font-medium text-gray-700 mb-2 sm:mb-0 sm:w-1/4 w-full">
                                    Idioma Original
                                </label>
                                {form.isLoadingLanguage ? (
                                    <div className="w-[120px] p-2 bg-gray-400 text-white rounded-md flex justify-center items-center">
                                        <Loader size="sm" color="white" />
                                    </div>
                                ) : form.errorLanguage ? (
                                    <div className="w-[120px] p-2 bg-red-500 text-white rounded-md flex justify-center items-center">
                                        <span className="text-sm">Error</span>
                                    </div>
                                ) : (
                                    <div className="w-40 p-2 bg-[#3B2252] text-white rounded-md flex justify-center items-center">
                                        <select
                                            data-testid="language-select"
                                            className="bg-[#3B2252] font-medium cursor-pointer"
                                            value={form.selectedLanguage?.id || ''}
                                            onChange={(e) => {
                                                const languageId = parseInt(e.target.value);
                                                const language = form.languages.find(l => l.id === languageId);
                                                if (language) form.selectLanguage(language);
                                            }}
                                        >
                                            <option value="" disabled>Seleccionar</option>
                                            {form.languages.map((language) => (
                                                <option key={language.id} value={language.id}>
                                                    {language.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            {form.hasTriedSubmit && form.selectedLanguage === null && (
                                <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">El idioma es obligatorio.</p>
                            )}
                        </div>

                        <div className="flex flex-col mb-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 w-full">
                                <label className="text-lg font-medium text-gray-700 mb-2 sm:mb-0 sm:w-1/4 w-full">Etiquetas</label>
                                <div className="w-3/4 flex flex-wrap gap-2 relative items-center">
                                    {form.currentTags.map((tag) => (
                                        <Tag
                                            key={tag}
                                            text={tag}
                                            colorClass="border-[#5C17A6] text-[#5C17A6]"
                                            onRemove={() =>
                                                form.setCurrentTags(form.currentTags.filter(t => t !== tag))
                                            }
                                        />
                                    ))}
                                    {form.isAddingTag ? (
                                        <input
                                            type="text"
                                            value={form.newTagText}
                                            data-testid="tag-input"
                                            onChange={(e) => form.setNewTagText(e.target.value)}
                                            onKeyDown={form.handleTagSubmit}
                                            onBlur={() => form.setIsAddingTag(false)}
                                            autoFocus
                                            placeholder="Enter para añadir etiqueta"
                                            className="p-1 border border-gray-400 rounded-md text-sm w-[150px] focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                        />
                                    ) : (
                                        <Button
                                            data-testid="add-tag-button"
                                            type="button"
                                            text="+"
                                            onClick={() => form.setIsAddingTag(true)}
                                            colorClass="w-8 h-8 pt-0 flex justify-center rounded-full border-2 border-[#5C17A6] text-[#5C17A6] text-2xl font-medium leading-none hover:bg-[#5C17A6] hover:text-white cursor-pointer"
                                        />
                                    )}
                                    <div
                                        className={`relative`}
                                        onMouseEnter={() => form.setShowIATooltip(true)}
                                        onMouseLeave={() => form.setShowIATooltip(false)}
                                    >
                                        <Button
                                            type="button"
                                            onClick={form.handleAISuggestion}
                                            disabled={form.isAILoading || !form.isDescriptionValid}
                                            colorClass={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#5C17A6] !py-0 !px-0`}
                                        >
                                            {form.isAILoading ?
                                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">...</svg>
                                                :
                                                <img src="/img/magic.png" className={`w-8 h-6 ${form.isDescriptionValid ? 'hover:cursor-pointer' : 'cursor-not-allowed'}`} />
                                            }
                                        </Button>
                                        {form.showIATooltip && !form.isAILoading && (
                                            <div className="absolute z-30 top-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded-md whitespace-nowrap">
                                                {form.isDescriptionValid ? form.aiSuggestionMessage : form.shortMessage}
                                            </div>
                                        )}
                                    </div>
                                    {form.isSuggestionMenuOpen && (
                                        <div ref={form.suggestionMenuRef} className="absolute z-20 top-10 mt-1 mr-[-30%] w-max max-w-xs">
                                            <div className="bg-white p-4 border border-gray-300 rounded-md shadow-lg flex flex-wrap gap-2">
                                                {form.suggestedTags.map((tag) => (
                                                    <Tag
                                                        key={tag}
                                                        text={tag}
                                                        colorClass="border border-gray-300 text-gray-600 bg-transparent hover:bg-gray-100"
                                                        onClick={() => {
                                                            form.handleAddTag(tag, form.currentTags, form.setCurrentTags, form.setIsAddingTag, form.setNewTagText, form.setIsSuggestionMenuOpen, false);
                                                            form.setSuggestedTags((prev) => prev.filter((t) => t !== tag));
                                                            form.setSuggestedTags((prev) => {
                                                                const updated = prev.filter((t) => t !== tag);
                                                                if (updated.length === 0) {
                                                                    form.setIsSuggestionMenuOpen(false);
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
                            {form.hasTriedSubmit && form.currentTags.length === 0 && (
                                <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">Debes agregar al menos una etiqueta.</p>
                            )}

                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 w-full">
                                <label htmlFor="toggle-paga" className="text-lg font-medium text-gray-700 mb-2 sm:mb-0 sm:w-1/4 w-full">
                                    ¿Tu obra va a ser paga?
                                </label>
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-semibold ${!form.isPaid ? 'text-gray-700' : 'text-gray-500'}`}>
                                        NO
                                    </span>
                                    <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                                        <input
                                            type="checkbox"
                                            name="toggle"
                                            id="toggle-paga"
                                            checked={form.isPaid}
                                            onChange={form.handleToggle}
                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in"
                                            style={{
                                                left: form.isPaid ? 'calc(100% - 1.5rem)' : '0',
                                            }}
                                        />
                                        <label
                                            htmlFor="toggle-paga"
                                            className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${form.isPaid ? 'bg-blue-600' : 'bg-gray-500'}`}
                                        />
                                    </div>
                                    <span className={`text-sm font-semibold ${!form.isPaid ? 'text-gray-600' : 'text-blue-700'}`}>
                                        SÍ
                                    </span>
                                </div>
                            </div>
                            {form.isPaid && (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 w-full">
                                    <label htmlFor="precio" className="text-lg font-medium text-gray-700 mb-2 sm:mb-0 sm:w-1/4 w-full">
                                        Precio de la obra (ARS)
                                    </label>
                                    <input
                                        type="number"
                                        id="precio"
                                        name="precio"
                                        value={form.price === 0 ? '' : form.price}
                                        onChange={(e) => form.setPrice(e.target.value === '' ? 0 : Number(e.target.value))}
                                        placeholder="Ej: 1000,00"
                                        min="0"
                                        step="0.01"
                                        className="block w-30 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col mb-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 w-full">
                                <label htmlFor="descripcion-obra" className="text-lg font-medium text-gray-700 mb-2 sm:mb-0 sm:w-1/4 w-full">
                                    Descripción
                                </label>
                                <div className="w-full sm:w-3/4">
                                    <textarea
                                        data-testid="work-description"
                                        className={`w-full h-40 p-2 border ${form.hasTriedSubmit && form.descriptionF.trim() === '' ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:border-transparent resize-none`}
                                        value={form.descriptionF}
                                        onChange={e => form.setDescriptionF(e.target.value)}
                                    >
                                    </textarea>
                                </div>
                            </div>
                            {form.hasTriedSubmit && form.descriptionF.trim().length < 30 && (
                            <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">
                                La descripción debe tener al menos 30 caracteres.
                            </p>
                        )}
                        </div>

                        <div className="w-full flex justify-center sm:justify-end">
                            {form.hasTriedSubmit && !form.isSubmitEnabled && (
                                <p className="text-sm text-yellow-600 mr-4 self-center">
                                    * Completa todos los campos obligatorios antes de guardar.
                                </p>
                            )}
                            <Button
                                type="submit"
                                data-testid="submit-create"
                                name="Guardar"
                                onClick={() => { }}
                                disabled={!form.isSubmitEnabled || form.isSubmitting}
                                colorClass={`${(!form.isSubmitEnabled || form.isSubmitting) ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#5C17A6] cursor-pointer hover:scale-102'} text-white text-lg font-medium rounded-md transition duration-150 flex items-center gap-2`}
                            >
                                {form.isSubmitting ? (
                                    <>
                                        <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar'
                                )}
                            </Button>
                        </div>
                    </div>
                </section>
            </form>
            {form.isAILoading && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
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