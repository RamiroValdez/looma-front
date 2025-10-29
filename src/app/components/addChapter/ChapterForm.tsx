import TextEditorTool from "../../features/Chapter/TextEditorTool.tsx";
import {useEditor} from "@milkdown/react";

interface Props {
  chapterTitle: string;
  setChapterTitle: (v: string) => void;
  chapterContent: string;
  setChapterContent: (v: string) => void;
  chapterNumber: number;
  setEditorRef?: (editorGetter: ReturnType<typeof useEditor>['get']) => void;
}

export default function ChapterForm({
  chapterTitle,
  setChapterTitle,
  chapterContent,
  setChapterContent,
  chapterNumber,
  setEditorRef
}: Props) {
  return (
    <div className="p-6 bg-white max-w-full">
      <h2 className="text-lg font-medium text-gray-700 mb-4 text-center">
        Capitulo:{" "}
        <span className="font-semibold">{chapterNumber}</span>
      </h2>

      <input
        type="text"
        value={chapterTitle}
        onChange={(e) => setChapterTitle(e.target.value)}
        placeholder="Título del capítulo"
        className="w-full text-center text-lg font-medium text-gray-500 placeholder-gray-400 focus:outline-none border-none text-center"
      />

        <TextEditorTool
            chapterContent={chapterContent}
            onChange={setChapterContent}
            setEditorRef={setEditorRef}
        />
    </div>
  );
}
