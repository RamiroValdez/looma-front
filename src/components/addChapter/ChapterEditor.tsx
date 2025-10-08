import ChapterForm from "./ChapterForm";
import EditorToolbar from "./EditorToolBar";

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
  return (
    <div>

      <EditorToolbar />

      <ChapterForm
        chapterTitle={chapterTitle}
        setChapterTitle={setChapterTitle}
        chapterContent={chapterContent}
        setChapterContent={setChapterContent}
        chapterNumber={chapterNumber}
      />
    </div>
  );
}
