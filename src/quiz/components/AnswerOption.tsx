export default function AnswerOption({
  text,
  onClick,
  disabled,
  variant,
  letter,
  asDiv,
  className,
}: {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'correct' | 'incorrect' | 'selected';
  letter?: string;
  asDiv?: boolean;
  className?: string;
}) {
  let base = 'w-full text-left rounded-md border transition mb-3';
  if (variant === 'correct') base += ' bg-green-100 border-green-400';
  else if (variant === 'incorrect') base += ' bg-red-100 border-red-400';
  else if (variant === 'selected') base += ' bg-white border-3 border-[#5C17A6]';
  else base += ' bg-white border-gray-200 hover:bg-gray-50';

  if (!asDiv) {
    if (disabled) base += ' opacity-50 cursor-not-allowed';
    else base += ' cursor-pointer';
  }

  const finalClass = `${base} ${className ?? ''}`.trim();

  const inner = (
    <div className="flex items-center px-4 py-3">
        <div className="flex-shrink-0 mr-4">
            <div className="w-10 h-10 rounded-full bg-[#CDBBE1] flex items-center justify-center text-[#5C17A6] font-semibold">
                {letter}
            </div>
        </div>
        <div className="flex-1 text-xl font-semibold text-gray-800">
            {text}
        </div>
    </div>
  );

  if (asDiv) {
    return <div className={finalClass}>{inner}</div>;
  }

  return (
    <button disabled={disabled} onClick={onClick} className={finalClass}>
      {inner}
    </button>
  );
}
