import ChapterForm from "./ChapterForm";
import EditorToolbar from "./EditorToolBar";

interface Props {
  chapterTitle: string;
  setChapterTitle: (value: string) => void;
  chapterContent: string;
  setChapterContent: (value: string) => void;
  chapterNumber: number; // Agregamos chapterNumber como prop
}

export default function ChapterEditor({
  chapterTitle,
  setChapterTitle,
  chapterContent,
  setChapterContent,
  chapterNumber, // Recibimos chapterNumber como prop
}: Props) {
  return (
    <div>

      <EditorToolbar />

      <ChapterForm
        chapterTitle={chapterTitle}
        setChapterTitle={setChapterTitle}
        chapterContent={chapterContent}
        setChapterContent={setChapterContent}
        chapterNumber={chapterNumber} // Pasamos chapterNumber al formulario
      />
    </div>
  );
}
