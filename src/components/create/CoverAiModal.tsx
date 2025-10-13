import Button from "../Button.tsx";
import type {ArtisticStyleDTO} from "../../dto/ArtisticStyleDTO.ts";
import type {ColorPaletteDTO} from "../../dto/ColorPaletteDTO.ts";
import type {CompositionDTO} from "../../dto/CompositionDTO.ts";
import {useArtisticStyles} from "../../services/ArtisticStylesService.ts";
import {useArtisticStyleStore} from "../../store/ArtisticStyleStore.ts";
import {useColorPalettes} from "../../services/ColorPaletteService.ts";
import {useColorPaletteStore} from "../../store/ColorPaletteStore.ts";
import {useCompositions} from "../../services/CompositionService.ts";
import {useCompositionStore} from "../../store/CompositionStore.ts";
import {useGenerateCover} from "../../services/CreateWorkService.ts";
import React, {useEffect, useState} from "react";
import type {CoverIaFormDTO} from "../../dto/FormCoverIaDTO.ts";

interface CoverIaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSetIaCoverUrlForPreview?: (url: string) => void;
    onSetIaCoverUrl?: (url: string) => void;
}


const CoverAiModal: React.FC<CoverIaModalProps> = ({
    isOpen,
    onClose,
    onSetIaCoverUrlForPreview,
    onSetIaCoverUrl
}: CoverIaModalProps) => {

    const { isLoading: isLoadingStyles, error: errorStyles } = useArtisticStyles();
    const { artisticStyles, selectedArtisticStyle, selectArtisticStyle } = useArtisticStyleStore();

    const { isLoading: isLoadingPalettes, error: errorPalettes } = useColorPalettes();
    const { colorPalettes, selectedColorPalette, selectColorPalette } = useColorPaletteStore();

    const { isLoading: isLoadingCompositions, error: errorCompositions } = useCompositions();
    const { compositions, selectedComposition, selectComposition } = useCompositionStore();

    const generateCoverMutation = useGenerateCover();

    const [iaCover, setIaCover] = useState<string | null>(null);
    const [descriptionForm, setDescriptionForm] = useState('');
    const [generateCoverButtonDisabled, setGenerateCoverButtonDisabled] = useState(false);
    const [useCoverButtonDisabled, setUseCoverButtonDisabled] = useState(true);
    const [waitingMessage, setWaitingMessage] = useState(false);

    const handleGenerateCover = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!selectedArtisticStyle || !selectedColorPalette || !selectedComposition || !descriptionForm.trim()) {
            alert("Por favor, completa todos los campos para generar la portada.");
            return;
        }

        if(iaCover != null){
            setIaCover(null)
            generateCoverMutation.reset();
        }

        const formCoverDTO: CoverIaFormDTO = {
            artisticStyleId: selectedArtisticStyle.name,
            colorPaletteId: selectedColorPalette.name,
            compositionId: selectedComposition.name,
            description: descriptionForm
        };

        setGenerateCoverButtonDisabled(true);
        setWaitingMessage(true);
        try {
            const response = await generateCoverMutation.mutateAsync(formCoverDTO);
//await new Promise<{ url: string }>((resolve) =>
//                 setTimeout(() => resolve({ url: "/img/ejemplo-portada.png" }), 2000)
//             );
            setIaCover(response.url);
        } catch (error) {
            console.error("Error al generar la portada con IA:", error);
            alert("Hubo un error al generar la portada. Por favor, intenta de nuevo.");
        } finally {
            setGenerateCoverButtonDisabled(false);
            setWaitingMessage(false);
            setUseCoverButtonDisabled(false);
        }
    };


    const handlerUseCover = () => {
        if(iaCover == null) {
            alert("No hay ninguna portada generada para usar.");
            return;
        }
        if (onSetIaCoverUrl) {
            onSetIaCoverUrl(iaCover);
        }

        if (onSetIaCoverUrlForPreview) {
            onSetIaCoverUrlForPreview(iaCover);
        }

        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            // Guardar el valor original del overflow
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            // Cleanup function que se ejecuta cuando el modal se cierra
            return () => {
                document.body.style.overflow = originalOverflow || 'auto';
            };
        }
    }, [isOpen]);

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!isOpen) return null;


    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 flex items-center text-center justify-center z-50 bg-black/50">
                    <div className="bg-white p-6 shadow-lg flex flex-col items-center w-full max-w-xl md:max-w-5xl rounded-xl relative">
                        <p className="text-4xl font-bold text-[#3B2252] mb-4">Genera tu portada con IA</p>
                        <Button
                            text=""
                            onClick={onClose}
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
                                        <div className="w-full p-2 bg-[#F0EEF6] hover:bg-[#E2DFEA] text-black rounded-md flex justify-center items-center cursor-pointer">
                                            <select
                                                className="w-full font-medium cursor-pointer focus:outline-none"
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
                                        <div className="w-full p-2 bg-[#F0EEF6] hover:bg-[#E2DFEA] text-black rounded-md flex justify-center items-center cursor-pointer">
                                            <select
                                                className="w-full font-medium cursor-pointer focus:outline-none"
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
                                        <div className="w-full p-2 bg-[#F0EEF6] hover:bg-[#E2DFEA] text-black rounded-md flex justify-center items-center cursor-pointer">
                                            <select
                                                className="w-full font-medium cursor-pointer focus:outline-none"
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
                                    colorClass="bg-[#172FA6] cursor-pointer hover:scale-102 text-white text-lg font-medium rounded-md transition
                                                 duration-150 w-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    disabled={generateCoverButtonDisabled}
                                />
                            </div>
                            <div className="w-full md:w-1/2 flex flex-col gap-6">
                                    {iaCover ? (
                                            <div className="flex flex-col justify-center items-center text-center border-dashed border-1 rounded-xl border-[#172FA6] p-8 h-full">
                                                <img src={iaCover} className="w-full h-full" alt="iaCover"/>
                                            </div>
                                    ) : (
                                        <div className="flex flex-col justify-center items-center text-center border-dashed border-1 rounded-xl border-[#172FA6] p-8 h-full">
                                            <p className="text-lg font-medium text-gray-600">Vista previa de la portada generada aparecerá aquí</p>
                                        </div>
                                    )}

                                <div className="flex justify-center ">
                                    <Button
                                        type="button"
                                        text="Usar esta portada"
                                        onClick={handlerUseCover}
                                        colorClass="bg-[#3B2252] cursor-pointer hover:scale-102 text-white text-lg font-medium rounded-md transition
                                                 duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 "
                                        disabled={useCoverButtonDisabled}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {waitingMessage && (
                <div className="fixed inset-0 flex items-center text-center justify-center z-50 bg-black/50">
                    <div className="bg-white rounded-lg flex flex-col text-center justify-center items-center p-10">
                        <div role="status">
                            <svg aria-hidden="true"
                                 className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className="text-center text-gray-600 mt-2">Generando portada, por favor
                            espera...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CoverAiModal;