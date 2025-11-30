import { useState, useEffect } from 'react';
import { SaveWork, IsWorkSaved } from '../../../../infrastructure/services/MySavesService';
import { notifyError, notifySuccess } from '../../../../infrastructure/services/ToastProviderService';

export const useWorkData = (workId: number) => {
  const [isWorkSaved, setIsWorkSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const checkIfWorkSaved = async () => {
      if (workId) {
        const isSaved = await IsWorkSaved(workId);
        setIsWorkSaved(isSaved);
      }
    };
    checkIfWorkSaved();
  }, [workId]);

  const handdleToggleSaveWork = async () => {
    if (!workId || isSaving) return;
    try {
      setIsSaving(true);
      await SaveWork(workId);
      setIsWorkSaved((prev) => !prev);
      notifySuccess(isWorkSaved ? "Obra eliminada de tus guardados." : "Obra guardada exitosamente.");
    } catch (error) {
      notifyError("No se pudo actualizar el estado de guardado de la obra.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isWorkSaved,
    isSaving,
    handdleToggleSaveWork,
  };
};