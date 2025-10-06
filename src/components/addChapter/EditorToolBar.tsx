export default function EditorToolbar() {
  return (
    <div className="flex items-center space-x-3 bg-[#4C3B63] text-white px-4 py-2 text-sm">
      <button className="hover:text-gray-200">≡</button>
      <button className="hover:text-gray-200">≡≡</button>
      <button className="hover:text-gray-200">≡≡≡</button>
      <div className="flex items-center space-x-3 ml-4">
        <button className="font-bold hover:text-gray-200">B</button>
        <button className="italic hover:text-gray-200">I</button>
        <button className="underline hover:text-gray-200">U</button>
        <button className="hover:text-gray-200">A</button>
      </div>
    </div>
  );
}
