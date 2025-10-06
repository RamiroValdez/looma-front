interface Props {
  chapterTitle: string;
  setChapterTitle: (v: string) => void;
  chapterContent: string;
  setChapterContent: (v: string) => void;
  chapterNumber: number; // Nueva prop para el número de capítulo
}

export default function ChapterForm({
  chapterTitle,
  setChapterTitle,
  chapterContent,
  setChapterContent,
  chapterNumber,
}: Props) {
  return (
    <div className="p-6 text-center bg-white">
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Capitulo:{" "}
        <span className="font-semibold">{chapterNumber}</span>
      </h2>

      <input
        type="text"
        value={chapterTitle}
        onChange={(e) => setChapterTitle(e.target.value)}
        placeholder="Título del capítulo"
        className="w-full text-center text-lg font-medium text-gray-500 placeholder-gray-400 focus:outline-none border-none"
      />

      <textarea
        value={chapterContent}
        onChange={(e) => setChapterContent(e.target.value)}
        placeholder="¡Da rienda suelta a tu imaginación!"
        className="mt-4 w-full h-40 resize-none text-gray-700 placeholder-gray-400 text-sm p-3 focus:outline-none bg-white"
      />
    </div>
  );
}
