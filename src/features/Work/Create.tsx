import { useNavigate } from "react-router-dom";
import { useState, useRef} from "react";

import Button from "../../components/Button";
import Tag from "../../components/Tag";

import { MORE_CATEGORIES, SUGGESTED_TAGS} from "../../types.ts/CreateWork.types";
import { handleAddCategory, handleAddTag, validateFile} from "../../services/CreateWork.service";

export default function Create() {
  const navigate = useNavigate();

  // === Estados ===
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['Ciencia Ficción', 'Drama', 'Romance']);

  const [currentTags, setCurrentTags] = useState(['perros', 'juventud', 'amor']);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagText, setNewTagText] = useState('');
  const [isSuggestionMenuOpen, setIsSuggestionMenuOpen] = useState(false);
  const [showIATooltip, setShowIATooltip] = useState(false);
  const [format, setFormat] = useState('');

  const [nameWork, setNameWork] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCoverPopup, setShowCoverPopup] = useState(false);
 
  // input de Tags (Enter)
  const handleTagSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(newTagText, currentTags, setCurrentTags, setIsAddingTag, setNewTagText, setIsSuggestionMenuOpen);
    }
  };

            const [error, setError] = useState<string | null>(null);

           
                const handleClick = () => {
                fileInputRef.current?.click();
                };

                const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const result = await validateFile(file, { maxSizeMB: 20, maxWidth: 1345, maxHeight: 256 });
                      
                      //La imagen NO se carga correctamente
                      if (!result.valid) {
                      setBannerFile(null);
                      setError(result.error || "Error desconocido");
                      return;
                      }

                      //La imagen se carga correctamente
                      setError(null);
                      setBannerFile(file);
                      console.log("Archivo válido:", file);
                      alert("Archivo válido y listo para subir.");           
            };

           

                const handleSubmitForm = (e: { preventDefault: () => void; }) => {
                e.preventDefault();
                const formData = new FormData();
                formData.append('nombre', nameWork);
                formData.append('descripcion', description);
                formData.append('formato', format);
                formData.append('idioma', language);
                formData.append('categorias', JSON.stringify(selectedCategories));
                formData.append('etiquetas', JSON.stringify(currentTags));
                if (bannerFile) formData.append('banner', bannerFile);

                    console.log("=== FormData a enviar ===");
                    console.log({
                    nombre: nameWork,
                    descripcion: description,
                    formato: format,
                    idioma: language,
                    categorias: selectedCategories,
                    etiquetas: currentTags,
                    banner: bannerFile,
                    });

                    for (let pair of formData.entries()) {
                    console.log(pair[0]+ ':', pair[1]);
                    }
                }
                /*fetch('/api/obras', {
                    method: 'POST',
                    body: formData,
                })
                    .then(res => res.json())
                    .then(data => {
                    // manejar respuesta
                    });
                };*/


            return (

                <main>
                <form onSubmit={handleSubmitForm}>

                <section>
            {/* BANNER DE SUBIDA */}
            <div
                onClick={handleClick}
                className="w-full max-w-[1345px] h-[256px] bg-[#E8E5E5] flex justify-center items-center mx-auto border border-[rgba(0,0,0,0.5)] hover:bg-[#D7D7D7] cursor-pointer"
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
                ref={fileInputRef}
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
            />

            {/* Mensaje de error */}
            {error && (
                <p className="text-red-500 text-sm mt-2 text-center">
                {error}
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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center">
          <p className="text-lg font-semibold mb-4">En construcción</p>
          <Button text="Cerrar" onClick={() => setShowCoverPopup(false)} colorClass="bg-[#5C17A6] text-white px-4 py-2 rounded" />
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
          <div className="flex items-center mb-6">
            <label className="w-1/4 text-lg font-medium text-gray-700">Nombre de la obra</label>
            <input
              type="text"
              value={nameWork}
                onChange={e => setNameWork(e.target.value)}
              className="w-3/4 p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
            />
          </div>

          {/* Categorias */}
          <div className="flex mb-6">
            <label className="w-1/4 text-lg font-medium text-gray-700">Categorías</label>
            <div className="flex gap-2 w-3/4 relative items-center flex-wrap">
              {selectedCategories.map((category) => (
                <Tag
                  key={category}
                  text={category}
                  colorClass={`border-[#172FA6] text-[#172FA6] bg-transparent`}
                  onRemove={() =>
                    setSelectedCategories(selectedCategories.filter(c => c !== category))
                  }
                />
              ))}

              {/* + CATS */}
              <Button
                type="button"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                colorClass={`w-8 h-8 pt-0 flex justify-center rounded-full border-2 border-[#172FA6] text-[#172FA6] text-2xl font-medium leading-none hover:bg-[#172FA6] hover:text-white z-10`}
                text={'+'}
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


          
          {/* Format */}
          <div className="flex items-center mb-6">
            <label className="w-1/4 text-lg font-medium text-gray-700">Formato</label>
            <div className="w-[120px] p-2 bg-[#3B2252] text-white rounded-md flex justify-center items-center cursor-pointer">
                    <select
                        className="bg-[#3B2252] font-medium cursor-pointer none"
                        value={format}
                        onChange={e => setFormat(e.target.value)}
                    >
                <option value="" disabled>Seleccionar</option>
                <option value="nov">Novela</option>
                <option value="com">Comic</option>
                <option value="man">Manga</option>
              </select>
            </div>
          </div>


          {/* Language */}
          <div className="flex items-center mb-6">
            <label className="w-1/4 text-lg font-medium text-gray-700">Idioma Original</label>
            <div className="w-[120px] p-2 bg-[#3B2252] text-white rounded-md flex justify-center items-center cursor-pointer">
                    <select
                        className="bg-[#3B2252] font-medium cursor-pointer none"
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                    >
                <option value="" disabled>Seleccionar</option>
                <option value="es">Español</option>
                <option value="en">Inglés</option>
                <option value="pt">Portugués</option>
                <option value="jp">Japonés</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="flex mb-6">
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

          {/* Descripción */}
          <div className="flex mb-6">
            <label className="w-1/4 text-lg font-medium text-gray-700">Descripción</label>
            <div className="w-3/4 relative">
              <textarea className="w-full h-40 p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent resize-none"
                value={description}
                onChange={e => setDescription(e.target.value)}>
                </textarea>

              <p className="absolute bottom-2 right-2 text-xs text-gray-500">max 400 caracteres</p>
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              text="Guardar"
              onClick={() => navigate("/")}
              colorClass={`bg-[#5C17A6] text-white cursor-pointer text-lg font-medium rounded-md hover:scale-102`}
            />
          </div>
        </div>
      </section>
      </form>
    </main>
  );
}

