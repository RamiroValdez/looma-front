import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

interface CoverImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadClick: () => void;
  onGenerateClick: () => void;
  errorMessage?: string | null;
  onSave?: () => void;
  saveDisabled?: boolean;
  saving?: boolean;
  title?: string;
}

const CoverImageModal: React.FC<CoverImageModalProps> = ({
  isOpen,
  onClose,
  onUploadClick,
  onGenerateClick,
  errorMessage,
  onSave,
  saveDisabled,
  saving,
  title,
}) => {
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

  return createPortal(
    <div className="fixed inset-0 top-0 left-0 flex items-center text-center justify-center z-[9999] bg-black/50" role="dialog" aria-modal="true">
      <div className="bg-white p-6 shadow-2xl flex flex-col items-center w-full max-w-xl md:max-w-3xl rounded-xl relative">
        <p className="text-5xl font-bold mb-4">{title ?? 'Cargar Portada'}</p>

        <Button
          text=""
          onClick={onClose}
          colorClass="absolute top-4 right-4 cursor-pointer"
        >
          <img src="/img/PopUpCierre.png" className="w-10 h-10 hover:opacity-60" alt="Cerrar" />
        </Button>

        <p className="text-2xl font-semibold mb-4">Seleccione una opción</p>
        <div className="flex flex-col md:flex-row gap-4 mb-4 w-full">
          {/* Subir imagen */}
          <div className="flex flex-col items-center text-center gap-4 mb-4 border-dashed border-1 rounded-xl border-[#172FA6] py-10 px-8 w-full md:w-1/2">
            <p className="text-lg font-bold mb-4">Subir una imagen</p>
            <p className="text-s font-medium mb-4 text-[#3F3E3E]">Seleccione un archivo para la imagen de su portada</p>
            <img src="/img/SubidaPortada.png" className="w-[110px] h-[90px] mt-2" alt="Subida Portada" />
            <Button
              text="Subir"
              onClick={onUploadClick}
              colorClass="bg-[#172FA6] text-white px-4 py-2 font-semibold rounded cursor-pointer hover:scale-102 w-60"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>
            )}
          </div>

          {/* Generar con IA */}
          <div className="flex flex-col items-center text-center gap-4 mb-4 border-dashed border-1 rounded-xl border-[#172FA6] py-10 px-8 w-full md:w-1/2">
            <p className="text-lg font-bold mb-4">Generar una imagen</p>
            <p className="text-s font-medium mb-4 text-[#3F3E3E]">Genera tu portada al instante con nuestra inteligencia artificial.</p>
            <img src="/img/IAPortada.png" className="w-[110px] h-[90px] mb-2" alt="IA Portada" />
            <Button
              text="Generar"
              onClick={onGenerateClick}
              colorClass="bg-[#172FA6] text-white px-4 py-2 font-semibold rounded cursor-pointer hover:scale-102 w-60"
            />
          </div>
        </div>
        {/* Footer actions */}
        {onSave && (
          <div className="w-full flex justify-end mt-2">
            <Button
              text={saving ? 'Guardando...' : 'Guardar'}
              onClick={onSave}
              disabled={!!saving || !!saveDisabled}
              colorClass={`${saving || saveDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#172FA6] hover:scale-102'} text-white px-4 py-2 font-semibold rounded`}
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CoverImageModal;
