import ChapterForm from "./ChapterForm";
import EditorToolbar from "./EditorToolBar";
import {useState} from "react";
import type {useEditor} from "@milkdown/react";

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

  return (
    <div>
        {editorGetter && <EditorToolbar editorGetter={editorGetter} />}
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
