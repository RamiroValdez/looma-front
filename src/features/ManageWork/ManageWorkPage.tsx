import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { WorkDTO } from '../../dto/WorkDTO';
import { ChapterItem } from '../../components/ChapterItem';
import Button from '../../components/Button';
import Tag from '../../components/Tag';
import { MORE_CATEGORIES, SUGGESTED_TAGS} from "../../types.ts/CreateWork.types";
import { handleAddCategory, handleAddTag, validateFile } from "../../services/CreateWorkService";
import { useNavigate, useParams } from 'react-router-dom';
import { addChapter, getWorkById } from '../../services/chapterService';
import { uploadCover, uploadBanner } from '../../services/workAssetsService';
import CoverImageModal from '../../components/CoverImageModal';
import CoverAiModal from "../../components/create/CoverAiModal.tsx";
interface ManageWorkPageProps {
  workId?: number;
}

export const ManageWorkPage: React.FC<ManageWorkPageProps> = () => {

  const { id: workId } = useParams<{ id: string }>();
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showCoverModalAi, setShowCoverModalAi] = useState(false);
  const [work, setWork] = useState<WorkDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const defaultWorkId = 1; 
  const currentWorkId = Number(workId) || defaultWorkId;
  const [savingBanner, setSavingBanner] = useState(false);
  
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagText, setNewTagText] = useState('');
  const [isSuggestionMenuOpen, setIsSuggestionMenuOpen] = useState(false);
  const [showIATooltip, setShowIATooltip] = useState(false);
  const [showBannerTooltip, setShowBannerTooltip] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [errorCover, setErrorCover] = useState<string | null>(null);
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
  const [savingCover, setSavingCover] = useState(false);
  const [allowSubscription, setAllowSubscription] = useState(false);
  const [price, setPrice] = useState('');
  const [workStatus, setWorkStatus] = useState('');

   const navigate = useNavigate();

  const handleCreateChapter = async (workId: number, languageId: number) => {
    const chapter = await addChapter(workId, languageId, 'TEXT');
    if (chapter?.fetchStatus === 200) {
      navigate(`/chapter/work/${workId}/edit/${chapter.chapterId}`);
      return;
    }

    navigate(`/manage-work/${workId}`);
  };

  const handleBannerClick = () => bannerInputRef.current?.click();

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const options = isCover
      ? { maxSizeMB: 20, maxWidth: 500, maxHeight: 800 }
      : { maxSizeMB: 20, maxWidth: 1345, maxHeight: 256 };
  
    const result = await validateFile(file, options);
  
    if (!result.valid) {
      const msg = result.error || 'Archivo inválido.';
      if (isCover) {
        setErrorCover(msg);
        setCoverPreview(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
        setPendingCoverFile(null);
        if (coverInputRef.current) coverInputRef.current.value = '';
      } else {
        setErrorBanner(msg);
        setBannerPreview(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
        if (bannerInputRef.current) bannerInputRef.current.value = '';
      }
      return;
    }
  
    if (isCover) {
      setErrorCover(null);
      setCoverPreview(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
      setPendingCoverFile(file);
      if (coverInputRef.current) coverInputRef.current.value = '';
    } else {
      setErrorBanner(null);
      setBannerPreview(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(file); });
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
    if (!isCover) {
      try {
        setSavingBanner(true);
        await uploadBanner(currentWorkId, file);
      } catch (err) {
        console.error('Error al subir el banner:', err);
        setErrorBanner('No se pudo subir el banner. Intenta nuevamente.');
      } finally {
        setSavingBanner(false);
      }
    }
  }, [currentWorkId]);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        setLoading(true);
        const workData = await getWorkById(currentWorkId);
        console.log(workData);
        setWork(workData);
        setSelectedCategories(workData.categories.map((cat) => cat.name));
        setCurrentTags(workData.tags.map((tag) => tag.name));
      } catch (err) {
        setError('Error loading work');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [currentWorkId]);

  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [bannerPreview, coverPreview]);

  const handleTagSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(newTagText, currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);
    }
  };

  const handleClearAdminPanel = () => {
    setAllowSubscription(false);
    setPrice('');
    setWorkStatus('');
  };

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
        <div className="absolute top-4 right-4">
          <div 
            className="relative"
            onMouseEnter={() => setShowBannerTooltip(true)}
            onMouseLeave={() => setShowBannerTooltip(false)}
          >
          <Button 
              text="Editar Banner"
              onClick={handleBannerClick}
              colorClass="bg-[#5C17A6] hover:bg-[#4A1285] focus:ring-[#5C17A6] text-white"
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
              <div className="flex flex-col items-start">
              <img 
                src={coverPreview || work.cover}
                alt={work.title}
                className="w-48 h-64 object-cover rounded-lg shadow-md mb-3"
              />
              <Button 
                text="Editar Portada"
                onClick={() => setShowCoverModal(true)}
                colorClass="bg-[#3C2A50] hover:bg-[#2A1C3A] focus:ring-[#3C2A50] text-sm mb-2 w-48 text-white"
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
                onSave={async () => {
                  if (!pendingCoverFile) return;
                  try {
                    setSavingCover(true);
                    await uploadCover(currentWorkId, pendingCoverFile, null);
                    setSavingCover(false);
                    setShowCoverModal(false);
                    setPendingCoverFile(null);
                  } catch (err) {
                    console.error('Error al guardar portada:', err);
                    setSavingCover(false);
                    setErrorCover('No se pudo guardar la portada. Intenta nuevamente.');
                  }
                }}
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
                  onSetIaCoverUrl={async (url: string) => {
                      try {
                      setSavingCover(true);
                      await uploadCover(currentWorkId, null, url);
                      setSavingCover(false);
                      setShowCoverModalAi(false);
                      setCoverPreview(url);
                  } catch (err) {
                      console.error('Error al guardar portada:', err);
                      setSavingCover(false);
                      setErrorCover('No se pudo guardar la portada. Intenta nuevamente.');
                  }
                  }}
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
                      key={category}
                      text={category}
                      onRemove={() =>
                        setSelectedCategories(selectedCategories.filter(c => c !== category))
                      }
                      colorClass="bg-transparent text-[#172FA6] border-[#172FA6]"
                    />
                  ))}
                  <Button 
                    text={'+'}
                    onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                    colorClass={`w-8 h-8 pt-0 flex justify-center rounded-full border-2 border-[#172FA6] text-[#172FA6] text-2xl font-medium leading-none hover:bg-[#172FA6] hover:text-white z-10`}
                  />

                  {isCategoryMenuOpen && (
                    <div className="absolute z-20 top-10 mt-1 mr-[-10%] w-max max-w-sm lg:max-w-md">
                      <div className="bg-white p-4 border border-gray-300 rounded-md shadow-lg flex flex-wrap gap-2">
                        {MORE_CATEGORIES.filter((c) => !selectedCategories.includes(c)).map((category) => (
                          <Tag
                            key={category}
                            text={category}
                            colorClass="border border-gray-300 text-gray-600 bg-transparent hover:bg-gray-100"
                            onClick={() =>
                              handleAddCategory(category, selectedCategories, setSelectedCategories, setIsCategoryMenuOpen)
                            }
                          />
                        ))}
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
                      colorClass={`border-[#5C17A6] text-[#5C17A6] bg-transparent`}
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

                  <div 
                    className="relative"
                    onMouseEnter={() => setShowIATooltip(true)}
                    onMouseLeave={() => setShowIATooltip(false)}
                  >
                    <Button
                    type="button"
                    onClick={() => setIsSuggestionMenuOpen(!isSuggestionMenuOpen)}
                    colorClass="w-8 h-8 !px-0 !py-0 flex items-center justify-center rounded-full border-2 border-[#5C17A6] text-white hover:bg-opacity-90 z-10"
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
            </div>

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
                      colorClass="bg-[#5C17A6] hover:bg-[#4A1285] focus:ring-[#5C17A6] text-white"
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

                  <hr className="border-gray-300" />
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <label className="text-black font-medium text-base">Precio:</label>
                      <div className="flex items-center border rounded">
                        <span className="px-2 py-2 bg-gray-50 border-r text-base text-black">$</span>
                        <input 
                          type="number" 
                          placeholder="0.00"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="px-2 py-2 text-base text-black rounded-r focus:outline-none focus:ring-2 focus:ring-[#5C17A6] w-24"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
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
                          onChange={(e) => setWorkStatus(e.target.value)}
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
                          value="finished"
                          checked={workStatus === 'finished'}
                          onChange={(e) => setWorkStatus(e.target.value)}
                          className="mr-2" 
                        />
                        <span>Marcar como finalizado</span>
                      </label>
                    </div>
                  </div>

                  <hr className="border-gray-300" />
                  
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={handleClearAdminPanel}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200 flex-1 cursor-pointer"
                    >
                      Eliminar
                    </button>
                    <Button 
                      text="Guardar"
                      onClick={() => console.log('Guardar cambios')}
                      colorClass="bg-[#5C17A6] hover:bg-[#4A1285] focus:ring-[#5C17A6] flex-1 text-white"
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