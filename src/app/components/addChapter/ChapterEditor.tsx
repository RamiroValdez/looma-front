import ChapterForm from "./ChapterForm";
import EditorToolbar from "./EditorToolBar";
import {useEffect, useState} from "react";
import type {useEditor} from "@milkdown/react";
import { importFileToText } from "../../../infrastructure/services/ChapterService";

interface Props {
  chapterTitle: string;
  setChapterTitle: (value: string) => void;
  chapterContent: string;
  setChapterContent: (value: string) => void;
  chapterNumber: number;
  editorKey?: string; // clave para remonte controlado
}

export default function ChapterEditor({
  chapterTitle,
  setChapterTitle,
  chapterContent,
  setChapterContent,
  chapterNumber,
  editorKey,
}: Props) {
    const [editorGetter, setEditorGetter] = useState<ReturnType<typeof useEditor>['get']>();

  const handleImportFile = async (file: File) => {
    const text = await importFileToText(file);

    setChapterContent(text);
  }

  // Si cambia la key (por idioma), limpiamos la ref anterior
  useEffect(() => {
    setEditorGetter(undefined);
  }, [editorKey]);

  return (
    <div key={editorKey}>

        {editorGetter && <EditorToolbar editorGetter={editorGetter} onImportFile={handleImportFile} />}
      <ChapterForm
        chapterTitle={chapterTitle}
        setChapterTitle={setChapterTitle}
        chapterContent={chapterContent}
        setChapterContent={setChapterContent}
        chapterNumber={chapterNumber}
        setEditorRef={setEditorGetter}
      />
    </div>
  );
}
