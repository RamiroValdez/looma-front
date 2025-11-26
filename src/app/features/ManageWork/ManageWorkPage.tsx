import React from 'react';
import { ChapterItem } from '../../components/ChapterItem';
import Button from '../../components/Button.tsx';
import Tag from '../../components/Tag.tsx';
import { useParams } from 'react-router-dom';
import CoverImageModal from '../../components/CoverImageModal';
import CoverAiModal from "../../components/create/CoverAiModal.tsx";
import BackButton from '../../components/BackButton';
import { useManageWorkData } from './hooks/useManageWorkData';

export const ManageWorkPage: React.FC = () => {
  const { id: workId } = useParams<{ id: string }>();
  const defaultWorkId = 1;
  const currentWorkId = Number(workId) || defaultWorkId;
  
  const {
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
    categories,
    isLoadingCategory,
    errorCategory,
    showCoverModal,
    showCoverModalAi,
    isAILoading,
    isSaving,
    shortMessage,
    aiSuggestionMessage,
    isDescriptionValid,
    
    bannerInputRef,
    coverInputRef,
    suggestionMenuRef,
    suggestionCategoryMenuRef,
    
    setIsAddingTag,
    setNewTagText,
    setIsCategoryMenuOpen,
    setShowIATooltip,
    setShowBannerTooltip,
    setPrice,
    setWorkStatus,
    setAllowSubscription,
    setCurrentTags,
    setShowCoverModal,
    setShowCoverModalAi,
    
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
  } = useManageWorkData(currentWorkId);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando obra...</div>
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error || 'Work not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EEF6' }}>
      <div
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerPreview || work.banner})` }}
      >
        <div className="absolute inset-0 bg-opacity-40"></div>
        <div className="absolute top-4 left-4 z-20">
          <BackButton to={`/my-works`} />
        </div>
        <div className="absolute top-4 right-4">
          <div
            className="relative"
            onMouseEnter={() => setShowBannerTooltip(true)}
            onMouseLeave={() => setShowBannerTooltip(false)}
          >
            <Button
              text="Editar Banner"
              onClick={handleBannerClick}
              colorClass="bg-[#5C17A6] font-semibold rounded-full hover:bg-[#4A1285] focus:ring-[#5C17A6] text-white cursor-pointer"
            />

            {showBannerTooltip && (
              <div
                className="absolute z-20 top-0 mt-1 mr-4 w-max max-w-sm right-full bg-gray-800 text-white px-3 py-2 rounded-md text-sm"
              >
                *Se admiten PNG, JPG, JPEG, WEBP de máximo 20mb. (Max 1345x256px).
              </div>
            )}
          </div>
        </div>
      </div>
      <input
        type="file"
        ref={bannerInputRef}
        className="hidden"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={(e) => handleFileChange(e, false)}
      />
      {errorBanner && (
        <div className="flex justify-center">
          <p className="text-red-600 text-sm mt-2">{errorBanner}</p>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

          <div className="lg:col-span-2 lg:border-r lg:border-gray-300 lg:pr-6">
            <div className="sticky top-8">
<div className="flex flex-col items-center w-full sm:items-start">
                <img
                  src={coverPreview || work.cover}
                  alt={work.title}
                  className="w-48 h-64 object-cover rounded-lg shadow-md mb-3"
                />
                <Button
                  text="Editar Portada"
                  onClick={() => setShowCoverModal(true)}
                  colorClass="bg-[#3C2A50] hover:bg-[#2A1C3A] font-semibold rounded-full px-4 py-2 focus:ring-[#3C2A50]  mb-2 w-48 text-white cursor-pointer"
                />
                <input
                  type="file"
                  ref={coverInputRef}
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => handleFileChange(e, true)}
                />
                <CoverImageModal
                  isOpen={showCoverModal}
                  onClose={() => {
                    setShowCoverModal(false);
                  }}
                  onUploadClick={() => {
                    coverInputRef.current?.click();
                  }}
                  onGenerateClick={() => {
                    setShowCoverModal(false);
                    setShowCoverModalAi(true);
                  }}
                  onSave={handleSaveCover}
                  saveDisabled={!pendingCoverFile}
                  saving={savingCover}
                  errorMessage={errorCover}
                />
                {errorCover && (
                  <p className="text-red-600 text-xs mt-1">{errorCover}</p>
                )}
                <p className="text-xs text-gray-500 w-48 text-center">
                  *Se admiten PNG, JPG, JPEG, WEBP de máximo 20mb.
                </p>
              </div>
            </div>
            <CoverAiModal
              isOpen={showCoverModalAi}
              onClose={() => setShowCoverModalAi(false)}
              onSetIaCoverUrl={handleSaveCoverAI}
            />
          </div>

          <div className="lg:col-span-6 lg:border-r lg:border-gray-300 lg:pr-6 lg:pl-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-black">
                <span className="font-bold">Nombre de la obra:</span> <span className="font-normal">{work.title}</span>
              </h1>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="text-black font-semibold text-lg">Categorías:</span>
                <div className="flex flex-wrap gap-2 relative">
                  {selectedCategories.map((category) => (
                    <Tag
                      key={category.id}
                      text={category.name}
                      onRemove={() => unselectCategory(category.id)}
                      colorClass="bg-transparent text-[#172FA6] border-[#172FA6]"
                    />
                  ))}

                  {selectedCategories.length < 2 && (
                  <Button
                    text={'+'}
                    onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                    colorClass={`w-8 h-8 pt-0 flex justify-center rounded-full border-2 border-[#172FA6] text-[#172FA6] text-2xl font-medium leading-none cursor-pointer hover:bg-[#172FA6] hover:text-white z-10`}
                  />
                  )}

                   {selectedCategories.length === 0 && (
              <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1">Selecciona al menos una categoría.</p>
            )}

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
            </div>

            <div className="mb-6">
              <div className="space-y-6 text-lg text-black">
                <div><span className="font-semibold">Formato:</span> <span className="font-normal">{work.format.name}</span></div>
                <div><span className="font-semibold">Idioma Original:</span> <span className="font-normal">{work.originalLanguage.name}</span></div>
                <div><span className="font-semibold">Descripción:</span> <span className="font-normal">{work.description || 'Sin descripción...'}</span></div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="text-black font-semibold text-lg">Etiquetas:</span>
                <div className="flex flex-wrap gap-2 relative">
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
                      placeholder="Enter para añadir etiqueta"
                      className="p-1 border border-gray-400 rounded-md text-sm w-[150px] focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    />
                  ) : (
                    <Button
                      type="button"
                      text="+"
                      onClick={() => setIsAddingTag(true)}
                      colorClass={`w-8 h-8 pt-0 flex justify-center rounded-full border-2 border-[#5C17A6] text-[#5C17A6] text-2xl font-medium leading-none hover:bg-[#5C17A6] hover:text-white cursor-pointer`}
                    />
                  )}

                  <div
                    className="relative"
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
                        <img src="/img/magic.png" alt="Icono IA" className={`w-8 h-6 ${isDescriptionValid ? 'hover:cursor-pointer' : 'cursor-not-allowed'}`}
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
                            onClick={() => handleSuggestedTagClick(tag)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {currentTags.length === 0 && (
              <p className="text-red-500 text-sm mt-1 ml-1/4 pt-1 pl-[25%]">Debes agregar al menos una etiqueta.</p>
            )}

            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="text-white font-semibold text-lg px-6 py-4" style={{ backgroundColor: '#3C2A50' }}>
                  Capítulos
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {work?.chapters?.map((chapter) => (
                      <ChapterItem
                        key={chapter.id}
                        workId={currentWorkId}
                        chapter={chapter}
                      />
                    ))}
                  </div>

                  <div className="flex justify-center mt-4">
                    <Button
                      text="Agregar Capítulo"
                      onClick={() => handleCreateChapter(currentWorkId, work.originalLanguage.id)}
                      colorClass="bg-[#5C17A6] hover:bg-[#4A1285] focus:ring-[#5C17A6] font-semibold rounded-full px-8 py-2 text-white cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 lg:pl-4">
            <div className="sticky top-8">
              <h2 className="text-3xl font-bold text-black mb-4 text-center">Administrar</h2>
              
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="space-y-4">
                  
                  
                  <div>
                    <label className="flex items-center text-base text-black">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={allowSubscription}
                        onChange={(e) => setAllowSubscription(e.target.checked)}
                      />
                      <span>Permitir suscripción a obra</span>
                    </label>
                  </div>

                  <div>
                      {allowSubscription && 
              <div className="flex items-center gap-2 justify-start">
                      <label className="text-black font-medium text-base">Precio:</label>
                      <div className="flex items-center border rounded border-2 border-[#172fa6]">
                        <span className="px-2 py-2 bg-gray-50 border-r text-base text-black border-[#172fa6]">$</span>
                        <input 
                          type="number" 
                          placeholder="0.00"
                          disabled={!allowSubscription}
                          value={allowSubscription ? price : 0}
                          onChange={(e) => setPrice(e.target.value)}
                          className="px-2 py-2 text-base text-black rounded-r focus:outline-none focus:ring-2 focus:ring-[#5C17A6] w-20"
                          min="0"
                          step="0.01"
                        />
                        
                      </div>
                    </div>
              }
                  </div>

                  <hr className="border-gray-300" />
    
                  <div className="space-y-2">
                    <div>
                      <label className="flex items-center text-base text-black">
                        <input 
                          type="radio" 
                          name="estado" 
                          value="paused"
                          checked={workStatus === 'paused'}
                          onChange={(e) => setWorkStatus(e.target.value as 'paused' | 'InProgress' | 'finished' | '')}
                          className="mr-2" 
                        />
                        <span>Marcar como pausado</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center text-base text-black">
                        <input 
                          type="radio" 
                          name="estado" 
                          value="InProgress"
                          checked={workStatus === 'InProgress'}
                          onChange={(e) => setWorkStatus(e.target.value as 'paused' | 'InProgress' | 'finished' | '')}
                          className="mr-2" 
                        />
                        <span>Marcar como en proceso</span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center text-base text-black">
                        <input 
                          type="radio" 
                          name="estado" 
                          value="finished"
                          checked={workStatus === 'finished'}
                          onChange={(e) => setWorkStatus(e.target.value as 'paused' | 'InProgress' | 'finished' | '')}
                          className="mr-2" 
                        />
                        <span>Marcar como finalizado</span>
                      </label>
                    </div>
                  </div>

                  <hr className="border-gray-300" />  
                  
                  <div className="flex gap-3 pt-2">                
                    <Button 
                      text={isSaving ? "Guardando..." : "Guardar"}
                      onClick={handleSaveChanges}
                      colorClass="bg-[#5C17A6] hover:bg-[#4A1285] focus:ring-[#5C17A6] flex-1 text-white font-semibold rounded-full px-4 py-2 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageWorkPage;