import ChapterForm from "./ChapterForm";
import EditorToolbar from "./EditorToolBar";
import {useState} from "react";
import type {useEditor} from "@milkdown/react";
import { importFileToText } from "../../services/chapterService";

interface Props {
  chapterTitle: string;
  setChapterTitle: (value: string) => void;
  chapterContent: string;
  setChapterContent: (value: string) => void;
  chapterNumber: number;
}

export default function ChapterEditor({
  chapterTitle,
  setChapterTitle,
  chapterContent,
  setChapterContent,
  chapterNumber,
}: Props) {
    const [editorGetter, setEditorGetter] = useState<ReturnType<typeof useEditor>['get']>();

  const handleImportFile = async (file: File) => {
    const text = await importFileToText(file);
    setChapterContent(text);
  }

  return (
    <div>

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
