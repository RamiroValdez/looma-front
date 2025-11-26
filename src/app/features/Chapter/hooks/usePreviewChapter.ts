import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguages } from "../../../../infrastructure/services/LanguageService.ts";
import { translateContent } from "../../../../infrastructure/services/TranslateService";

export function usePreviewChapter() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const data = queryParams.get("data");
    const previewId = queryParams.get("previewId");

    const [initialData, setInitialData] = useState<any | null>(null);
    const [loadError, setLoadError] = useState<string>("");
    const { languages } = useLanguages();
    const [translatedContent, setTranslatedContent] = useState<string>("");
    const [currentLanguage, setCurrentLanguage] = useState<string>("");
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        let parsed: any | null = null;
        try {
            if (previewId) {
                const raw = localStorage.getItem(`preview:${previewId}`);
                if (!raw) {
                    setLoadError("No se encontró información de la vista previa.");
                } else {
                    parsed = JSON.parse(raw);
                }
            } else if (data) {
                parsed = JSON.parse(data);
            } else {
                setLoadError("Parámetros inválidos para la vista previa.");
            }
        } catch (e) {
            setLoadError("Error al leer datos de la vista previa.");
        }
        setInitialData(parsed);
    }, [previewId, data]);

    useEffect(() => {
        if (initialData) {
            setTranslatedContent(initialData.content || "");
            setCurrentLanguage(initialData.originalLanguage || "");
            if (previewId) {
                try { localStorage.removeItem(`preview:${previewId}`); } catch {}
            }
        }
    }, [initialData, previewId]);

    const handleLanguageChange = async (languageCode: string) => {
        if (!initialData) return;
        try {
            setIsTranslating(true);
            const translated = await translateContent(currentLanguage, languageCode, initialData.content);
            setTranslatedContent(translated);
            setCurrentLanguage(languageCode);
        } catch (error: any) {
            alert(`No se pudo traducir el contenido. Detalles: ${error.message}`);
        } finally {
            setIsTranslating(false);
        }
    };

    const numberChapter = initialData?.numberChapter ?? "";
    const originalLanguage = initialData?.originalLanguage ?? "";

    const sortedLanguages = originalLanguage
        ? [
            { code: originalLanguage, name: "Original" },
            ...languages.filter((lang) => lang.code !== originalLanguage),
        ]
        : languages;

    return {
        loadError,
        initialData,
        isTranslating,
        translatedContent,
        numberChapter,
        sortedLanguages,
        handleLanguageChange,
    };
}