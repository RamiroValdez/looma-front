import { useState } from "react";
import { saveDraftChapter } from "../../../infrastructure/services/ChapterService.ts";
import { useNavigate } from "react-router-dom";
import { notifyError } from "../../../infrastructure/services/ToastProviderService.ts";

interface Props {
  onPreview?: () => void;
  formData: { titulo: string; contenido: string };
  chapterId: number;
  publicationStatus: string;
  price: number;
  allowAiTranslation: boolean;
  defaultLanguageCode: string;
  activeLanguageCode: string;
  workId: string;
}

export default function ChapterActions({ onPreview, workId, formData, chapterId, publicationStatus, price, allowAiTranslation, defaultLanguageCode, activeLanguageCode }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSaveDraft = async () => {
    if (publicationStatus !== 'DRAFT') {
      const msg = 'Este capítulo no es un borrador y no puede ser editado.';
      setError(msg);
      notifyError(msg);
      return;
    }
    const targetLang = activeLanguageCode || defaultLanguageCode;
    const contentToSave = formData.contenido?.trim() ?? '';
    if (!contentToSave) {
      const msg = 'El contenido está vacío. Escribe algo antes de guardar este idioma.';
      setError(msg);
      notifyError(msg);
      return;
    }
    try {
      setError(null);
      setSaving(true);
      const payload = {
        title: formData.titulo,
        status: 'DRAFT',
        last_update: new Date().toISOString(),
        price: Number(price) || 0,
        allow_ai_translation: allowAiTranslation,
        versions: {
          // Guardar sobre el idioma activo realmente editado, no siempre el original
          [targetLang]: contentToSave
        }
      };
      const resp = await saveDraftChapter(Number(chapterId), payload);
      if (!(resp.fetchStatus >= 200 && resp.fetchStatus < 300)) {
        const msg = 'No se pudo guardar el borrador.';
        setError(msg);
        notifyError(msg);
        return;
      }
      navigate(`/manage-work/${workId}`);
    } catch (e) {
      console.error(e);
      const msg = 'Error al guardar el borrador.';
      setError(msg);
      notifyError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    } else {
      console.warn("Función onPreview no proporcionada.");
    }
  };

  const isDraft = publicationStatus === 'DRAFT';

  return (
    <div className="flex flex-col gap-3 mb-6">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handlePreview}
          className="px-4 py-2 bg-[#591b9b] text-white rounded-lg shadow hover:bg-purple-800"
        >
          Vista previa
        </button>
        <button
          onClick={handleSaveDraft}
          disabled={!isDraft || saving}
          className="px-4 py-2 bg-[#4C3B63] text-white rounded-lg shadow hover:bg-[#3b2c4e] disabled:opacity-60"
        >
          {saving ? 'Guardando...' : 'Guardar borrador'}
        </button>
      </div>
      {!isDraft && (
        <p className="text-xs text-gray-600">Solo se puede editar cuando el capítulo está en estado <span className="font-semibold">DRAFT</span>.</p>
      )}
    </div>
  );
}
