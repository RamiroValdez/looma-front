export type LoaderProps = {
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'white' | 'gray' | 'primary';
  className?: string;
};

export const Loader = ({ label, size = 'sm', color = 'gray', className = '' }: LoaderProps) => {
  const sizeClass =
    size === 'xs' ? 'h-3 w-3 border' :
    size === 'sm' ? 'h-4 w-4 border-2' :
    size === 'md' ? 'h-5 w-5 border-2' :
    'h-6 w-6 border-2';

  const colorClass =
    color === 'white' ? 'border-white border-t-transparent' :
    color === 'primary' ? 'border-[#5C17A6] border-t-transparent' :
    'border-gray-400 border-t-transparent';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} role="status" aria-live="polite" aria-busy="true">
      <span className={`inline-block rounded-full animate-spin ${sizeClass} ${colorClass}`} />
      {label ? <span className="text-current text-sm">{label}</span> : null}
    </div>
  );
};
