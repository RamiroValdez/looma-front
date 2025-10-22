import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  colorClass: string;
  text?: string;
}

export default function Button({
  type = 'button' ,
  text,
  name,
  onClick,
  colorClass,
  children,
  disabled = false,
  className,
  ...rest
}: ButtonProps) {
  const baseClasses =
    'rounded transition flex justify-center items-center text-center px-4 py-2';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      name={name}
      {...rest} // Propaga data-testid, aria-*, id, etc.
      className={`${baseClasses} ${colorClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className ?? ''}`}
    >
      {children ?? text}
    </button>
  );
}