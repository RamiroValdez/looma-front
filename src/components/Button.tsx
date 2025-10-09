import React from 'react';

export default function Button({
  type = "button",
  text,
  onClick,
  colorClass,
  children,
  disabled = false,
}:
{
  type?: "button" | "submit";
  text?: string;
  onClick: () => void;
  colorClass: string;
  children?: React.ReactNode;
  disabled?: boolean;
})

{

  const baseClasses =
    "rounded transition flex justify-center items-center text-center w-fit px-4 py-2"; 

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${colorClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children ? children : text}
    </button>
  );
}