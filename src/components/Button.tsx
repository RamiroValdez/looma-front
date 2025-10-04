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
    "rounded transition px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${colorClass}`}
    >
      {children ? children : text}
    </button>
  );
}
