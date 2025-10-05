import type { BookDTO } from "../dto/BookDTO";
import { Link } from "react-router-dom";

interface Props {
  book: BookDTO;
}

const BookCard: React.FC<Props> = ({ book }) => {
  return (
    <div className="w-40 flex-shrink-0">
      <div className="relative rounded-4xl overflow-hidden shadow-md h-56">

        {/*acordarme de cambiar aca x la ruta que va a la vista del libro*/}
        <Link to={`/book/${book.id}`}>
          <img
            src={book.coverUrl}
            alt={book.name}
            className="w-full h-full object-cover cursor-pointer"
          />
        </Link>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Contenido encima de la imagen */}
        <div className="absolute bottom-2 left-2 right-2 text-white">
          <h3 className="text-sm font-semibold leading-tight line-clamp-2">
            {book.name}
          </h3>

          <div className="flex items-center justify-between text-xs mt-1">
            <div className="flex items-center gap-1">
              <span>❤️ {(book.likes / 1000).toFixed(1)}k</span>
            </div>
            <div className="flex flex-wrap gap-1">
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

