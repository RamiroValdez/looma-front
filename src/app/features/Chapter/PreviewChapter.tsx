import FooterLector from "../../components/FooterLector.tsx";
import TextViewer from "./TextViewer.tsx";
import { MilkdownProvider } from "@milkdown/react";
import { usePreviewChapter } from "./hooks/usePreviewChapter";
import { Loader } from "../../components/Loader.tsx";

const PreviewChapter = () => {
    const {
        loadError,
        initialData,
        isTranslating,
        translatedContent,
        numberChapter,
        sortedLanguages,
        handleLanguageChange,
    } = usePreviewChapter();

    if (loadError) {
        return <p>{loadError}</p>;
    }
    if (!initialData) {
        return (
            
                  <div className="min-h-screen flex items-center justify-center bg-[#f4f0f7]">
                    <Loader size="md" color="primary" />
                  </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="flex-1 px-4 py-9 bg-white flex flex-col overflow-y-auto pb-18 items-center">
                <h1 className="text-xl mb-4 text-center">Capítulo {numberChapter}</h1>
                <hr className="w-full border-t border-gray-300 mb-6" />
                <div className="max-w-3xl text-base mx-5">
                    {isTranslating ? (
                        <p className="text-center text-gray-500">Traduciendo contenido...</p>
                    ) : (
                        <div>
                            <MilkdownProvider>
                                <TextViewer content={translatedContent} />
                            </MilkdownProvider>
                        </div>
                    )}
                </div>
            </div>
            <FooterLector
                selectedLanguages={sortedLanguages}
                chapterTitle={`Capítulo ${numberChapter}`}
                onLanguageChange={handleLanguageChange}
            />
        </div>
    );
};

export default PreviewChapter;
