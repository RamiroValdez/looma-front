export default function Button({text, onClick, colorClass}: {
    text: string, 
    onClick: () => void,
    colorClass: string
}) {

        const baseClasses = "text-white rounded transition px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2";

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${colorClass}`}>
            {text}
        </button>
    );
}