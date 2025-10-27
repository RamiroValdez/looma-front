import type { BookDTO } from "../../domain/dto/BookDTO";
import { Link } from "react-router-dom";

interface Props {
  book: BookDTO;
}

const BookCard: React.FC<Props> = ({ book }) => {
  return (
    <div className="w-40 flex-shrink-0">
      <div className="relative rounded-2xl overflow-hidden shadow-md h-56">

        {/*acordarme de cambiar aca x la ruta que va a la vista del libro*/}
        <Link to={`/book/${book.id}`}>
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover cursor-pointer"
          />
        </Link>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

<div className="absolute bottom-2 left-2 right-2 text-white">
  <h3 className="text-sm font-semibold leading-tight line-clamp-2">
    {book.title}
  </h3>

  <div className="flex items-center text-xs mt-1">
    <div className="flex items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="w-4 h-4"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 
                 3.81 14.76 3 16.5 3 19.58 3 22 5.42 
                 22 8.5c0 3.78-3.4 6.86-8.55 
                 11.54L12 21.35z" />
      </svg>
      <span>{(book.likes / 1000).toFixed(1)}k</span>
    </div>

    <div className="flex flex-wrap gap-1 ml-auto">
      {book.categories.map((category, index) => (
        <span
          key={index}
          className="bg-white/20 rounded-full px-2 py-0.5 backdrop-blur-sm"
        >
          {category}
        </span>
      ))}
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default BookCard;

