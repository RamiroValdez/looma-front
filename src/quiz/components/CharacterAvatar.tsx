export default function CharacterAvatar({ src, size = 96 }: { src?: string; size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="mx-auto mb-4">
      {src ? <img src={src} alt="character" className="w-full h-full object-contain" /> : null}
    </div>
  );
}
