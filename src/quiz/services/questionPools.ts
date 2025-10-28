import type { QuestionDTO } from '../dto/QuestionDTO';

export const pools: Record<string, QuestionDTO[]> = {
    'muy facil': [
        {
            id: 101, question: '¿Qué tipo de texto suele comenzar con “Érase una vez”?', difficulty: 'muy facil', options: [
                { id: 'a', text: 'Poesía' },
                { id: 'b', text: 'Cuento', correct: true },
                { id: 'c', text: 'Ensayo' },
                { id: 'd', text: 'Biografía' },
            ]
        },
        {
            id: 102, question: '¿Qué se necesita para leer un libro digital?', difficulty: 'muy facil', options: [
                { id: 'a', text: 'Un lápiz' },
                { id: 'b', text: 'Una linterna' },
                { id: 'c', text: 'Un dispositivo electrónico', correct: true },
                { id: 'd', text: 'Un marcador' },
            ]
        },
        {
            id: 103, question: '¿Qué autor escribió Harry Potter?', difficulty: 'muy facil', options: [
                { id: 'a', text: 'Suzanne Collins' },
                { id: 'b', text: 'J.K. Rowling', correct: true },
                { id: 'c', text: 'Stephen King' },
                { id: 'd', text: 'Rick Riordan' },
            ]
        },
        {
            id: 104, question: '¿Qué género literario incluye historias de amor?', difficulty: 'muy facil', options: [
                { id: 'a', text: 'Terror' },
                { id: 'b', text: 'Romance', correct: true },
                { id: 'c', text: 'Ciencia ficción' },
                { id: 'd', text: 'Misterio' },
            ]
        },
        {
            id: 105, question: '¿Qué parte del libro suele tener el nombre del autor?', difficulty: 'muy facil', options: [
                { id: 'a', text: 'Contratapa' },
                { id: 'b', text: 'Portada', correct: true },
                { id: 'c', text: 'Índice' },
                { id: 'd', text: 'Prólogo' },
            ]
        },
        {
            id: 106, question: '¿Qué significa la palabra “novela”?', difficulty: 'muy facil', options: [
                { id: 'a', text: 'Un poema corto' },
                { id: 'b', text: 'Un texto informativo' },
                { id: 'c', text: 'Una narración extensa', correct: true },
                { id: 'd', text: 'Un diario' },
            ]
        },
        {
            id: 107, question: '¿Cuál de estos es un cuento clásico?', difficulty: 'muy facil', options: [
                { id: 'a', text: 'Caperucita Roja', correct: true },
                { id: 'b', text: 'El Quijote' },
                { id: 'c', text: '1984' },
                { id: 'd', text: 'Los miserables' },
            ]
        },
        {
            id: 108, question: '¿Qué se usa para marcar la página donde uno deja de leer?', difficulty: 'muy facil', options: [
                { id: 'a', text: 'Un señalador', correct: true },
                { id: 'b', text: 'Un subrayador' },
                { id: 'c', text: 'Un diccionario' },
                { id: 'd', text: 'Una regla' },
            ]
        },
        {
            id: 109, question: '¿Qué hace un escritor?', difficulty: 'muy facil', options: [
                { id: 'a', text: 'Dibuja' },
                { id: 'b', text: 'Escribe libros', correct: true },
                { id: 'c', text: 'Imprime libros' },
                { id: 'd', text: 'Traduce textos' },
            ]
        },
        {
            id: 110, question: '¿Qué es una saga literaria?', difficulty: 'muy facil', options: [
                { id: 'a', text: 'Una sola novela' },
                { id: 'b', text: 'Un libro sin final' },
                { id: 'c', text: 'Una colección de libros relacionados', correct: true },
                { id: 'd', text: 'Un libro con muchas páginas' },
            ]
        },
    ],
    'facil': [
        {
            id: 201, question: '¿Quién escribió El Principito?', difficulty: 'facil', options: [
                { id: 'a', text: 'Julio Verne' },
                { id: 'b', text: 'Antoine de Saint-Exupéry', correct: true },
                { id: 'c', text: 'Lewis Carroll' },
                { id: 'd', text: 'Andersen' },
            ]
        },
        {
            id: 202, question: '¿Qué género mezcla elementos de futuro y tecnología?', difficulty: 'facil', options: [
                { id: 'a', text: 'Policial' },
                { id: 'b', text: 'Ciencia ficción', correct: true },
                { id: 'c', text: 'Fantasía' },
                { id: 'd', text: 'Drama' },
            ]
        },
        {
            id: 203, question: '¿Qué personaje es un detective creado por Arthur Conan Doyle?', difficulty: 'facil', options: [
                { id: 'a', text: 'Poirot' },
                { id: 'b', text: 'Sherlock Holmes', correct: true },
                { id: 'c', text: 'Miss Marple' },
                { id: 'd', text: 'Watson' },
            ]
        },
        {
            id: 204, question: '¿Cómo se llama el lugar donde se guardan muchos libros?', difficulty: 'facil', options: [
                { id: 'a', text: 'Librería' },
                { id: 'b', text: 'Biblioteca', correct: true },
                { id: 'c', text: 'Imprenta' },
                { id: 'd', text: 'Editorial' },
            ]
        },
        {
            id: 205, question: '¿Quién escribió Don Quijote de la Mancha?', difficulty: 'facil', options: [
                { id: 'a', text: 'Lope de Vega' },
                { id: 'b', text: 'Miguel de Cervantes', correct: true },
                { id: 'c', text: 'Gustavo Adolfo Bécquer' },
                { id: 'd', text: 'Tirso de Molina' },
            ]
        },
        {
            id: 206, question: '¿Qué autor escribió Cien años de soledad?', difficulty: 'facil', options: [
                { id: 'a', text: 'Pablo Neruda' },
                { id: 'b', text: 'Gabriel García Márquez', correct: true },
                { id: 'c', text: 'Mario Vargas Llosa' },
                { id: 'd', text: 'Isabel Allende' },
            ]
        },
        {
            id: 207, question: '¿Qué tipo de texto suele rimar y expresar emociones?', difficulty: 'facil', options: [
                { id: 'a', text: 'Crónica' },
                { id: 'b', text: 'Poema', correct: true },
                { id: 'c', text: 'Ensayo' },
                { id: 'd', text: 'Noticia' },
            ]
        },
        {
            id: 208, question: '¿Qué libro pertenece al género de terror?', difficulty: 'facil', options: [
                { id: 'a', text: 'Drácula', correct: true },
                { id: 'b', text: 'Orgullo y prejuicio' },
                { id: 'c', text: 'Moby Dick' },
                { id: 'd', text: 'Mujercitas' },
            ]
        },
        {
            id: 209, question: '¿Qué significa “autor anónimo”?', difficulty: 'facil', options: [
                { id: 'a', text: 'Que escribió con seudónimo' },
                { id: 'b', text: 'Que se desconoce quién lo escribió', correct: true },
                { id: 'c', text: 'Que lo escribió entre varios' },
                { id: 'd', text: 'Que es una traducción' },
            ]
        },
        {
            id: 210, question: '¿Qué tipo de narrador cuenta la historia desde dentro de ella?', difficulty: 'facil', options: [
                { id: 'a', text: 'Tercera persona' },
                { id: 'b', text: 'Omnisciente' },
                { id: 'c', text: 'Testigo' },
                { id: 'd', text: 'Primera persona', correct: true },
            ]
        },
    ],
    'medio': [
        {
            id: 301, question: '¿Qué obra comienza con “En un lugar de la Mancha…”?', difficulty: 'medio', options: [
                { id: 'a', text: 'Don Quijote de la Mancha', correct: true },
                { id: 'b', text: 'La Celestina' },
                { id: 'c', text: 'El Lazarillo de Tormes' },
                { id: 'd', text: 'El Cid' },
            ]
        },
        {
            id: 302, question: '¿Cuál es el nombre real de George Orwell?', difficulty: 'medio', options: [
                { id: 'a', text: 'Eric Arthur Blair', correct: true },
                { id: 'b', text: 'Charles Dodgson' },
                { id: 'c', text: 'Samuel Clemens' },
                { id: 'd', text: 'Richard Bachman' }
            ]
        },
        {
            id: 303, question: '¿Qué género mezcla lo fantástico con la crítica social?', difficulty: 'medio', options: [
                { id: 'a', text: 'Realismo mágico', correct: true },
                { id: 'b', text: 'Ciencia ficción' },
                { id: 'c', text: 'Costumbrismo' },
                { id: 'd', text: 'Naturalismo' }
            ]
        },
        {
            id: 304, question: '¿Qué novela presenta la distopía del Gran Hermano?', difficulty: 'medio', options: [
                { id: 'a', text: 'Un mundo feliz' },
                { id: 'b', text: 'Fahrenheit 451' },
                { id: 'c', text: '1984', correct: true },
                { id: 'd', text: 'El cuento de la criada' }
            ]
        },
        {
            id: 305, question: '¿Qué significa “protagonista”?', difficulty: 'medio', options: [
                { id: 'a', text: 'Personaje principal de una historia', correct: true },
                { id: 'b', text: 'Personaje que se opone al protagonista' },
                { id: 'c', text: 'Narrador de la historia' },
                { id: 'd', text: 'Personaje secundario' }
            ]
        },
        {
            id: 306, question: '¿Qué libro pertenece al género gótico?', difficulty: 'medio', options: [
                { id: 'a', text: 'Jane Eyre', correct: true },
                { id: 'b', text: 'Crimen y castigo' },
                { id: 'c', text: 'Madame Bovary' },
                { id: 'd', text: 'Emma' }
            ]
        },
        {
            id: 307, question: '¿Qué autor escribió La metamorfosis?', difficulty: 'medio', options: [
                { id: 'a', text: 'Franz Kafka', correct: true },
                { id: 'b', text: 'Gabriel García Márquez' },
                { id: 'c', text: 'Jorge Luis Borges' },
                { id: 'd', text: 'Julio Cortázar' }
            ]
        },
        {
            id: 308, question: '¿Qué tipo de texto no es literario?', difficulty: 'medio', options: [
                { id: 'a', text: 'Cuento' },
                { id: 'b', text: 'Manual de instrucciones', correct: true },
                { id: 'c', text: 'Novela' },
                { id: 'd', text: 'Poema' }
            ]
        },
        {
            id: 309, question: '¿En qué siglo se publicó Frankenstein?', difficulty: 'medio', options: [
                { id: 'a', text: 'Siglo XVIII' },
                { id: 'b', text: 'Siglo XX' },
                { id: 'c', text: 'Siglo XIX', correct: true },
                { id: 'd', text: 'Siglo XXI' }
            ]
        },
        {
            id: 310, question: '¿Qué obra famosa comienza con la frase “Llamadme Ismael”?', difficulty: 'medio', options: [
                { id: 'a', text: 'Moby Dick', correct: true },
                { id: 'b', text: 'El gran Gatsby' },
                { id: 'c', text: '1984' },
                { id: 'd', text: 'Orgullo y prejuicio' }
            ]
        },
    ],
    'dificil': [
        {
            id: 401, question: '¿Qué autor argentino escribió Rayuela?', difficulty: 'dificil', options: [
                { id: 'a', text: 'Jorge Luis Borges' },
                { id: 'b', text: 'Julio Cortázar', correct: true },
                { id: 'c', text: 'Adolfo Bioy Casares' },
                { id: 'd', text: 'Roberto Arlt' }
            ]
        },
        {
            id: 402, question: '¿En qué novela un monstruo busca a su creador?', difficulty: 'dificil', options: [
                { id: 'a', text: 'Frankenstein', correct: true },
                { id: 'b', text: 'Drácula' },
                { id: 'c', text: 'El extraño caso del Dr. Jekyll y Mr. Hyde' },
                { id: 'd', text: 'El retrato de Dorian Gray' }
            ]
        },
        {
            id: 403, question: '¿Qué significa “distopía”?', difficulty: 'dificil', options: [
                { id: 'a', text: 'Mundo ideal' },
                { id: 'b', text: 'Mundo ficticio negativo o injusto', correct: true },
                { id: 'c', text: 'Mundo futuro sin problemas' },
                { id: 'd', text: 'Mundo histórico' }
            ]
        },
        {
            id: 404, question: '¿Quién escribió Orgullo y prejuicio?', difficulty: 'dificil', options: [
                { id: 'a', text: 'Jane Austen', correct: true },
                { id: 'b', text: 'Charlotte Brontë' },
                { id: 'c', text: 'Emily Brontë' },
                { id: 'd', text: 'Mary Shelley' }
            ]
        },
        {
            id: 405, question: '¿Qué libro pertenece al género de aventuras?', difficulty: 'dificil', options: [
                { id: 'a', text: 'Moby Dick ', correct: true },
                { id: 'b', text: 'Cumbres borrascosas' },
                { id: 'c', text: 'El retrato de Dorian Gray' },
                { id: 'd', text: 'El corazón de las tinieblas' }
            ]
        },
        {
            id: 406, question: '¿Qué autor creó el personaje de “El Principito”?', difficulty: 'dificil', options: [
                { id: 'a', text: 'Lewis Carroll' },
                { id: 'b', text: 'Jules Verne' },
                { id: 'c', text: 'Hermann Hesse' },
                { id: 'd', text: 'Antoine de Saint-Exupéry', correct: true }
            ]
        },
        {
            id: 407, question: '¿Qué significa “trilogía”?', difficulty: 'dificil', options: [
                { id: 'a', text: 'Una obra de un solo autor' },
                { id: 'b', text: 'Una obra en dos partes' },
                { id: 'c', text: 'Una obra en tres partes', correct: true },
                { id: 'd', text: 'Una obra que se desarrolla en un solo lugar' }
            ]
        },
        {
            id: 408, question: '¿Cuál de estos libros trata sobre un futuro donde leer está prohibido?', difficulty: 'dificil', options: [
                { id: 'a', text: 'Fahrenheit 451', correct: true },
                { id: 'b', text: '1984' },
                { id: 'c', text: 'Un mundo feliz' },
                { id: 'd', text: 'El cuento de la criada' }
            ]
        },
        {
            id: 409, question: '¿Qué autor es famoso por escribir cuentos de terror como “El gato negro”?', difficulty: 'dificil', options: [
                { id: 'a', text: 'Mary Shelley' },
                { id: 'b', text: 'H.P. Lovecraft' },
                { id: 'c', text: 'Stephen King' },
                { id: 'd', text: 'Edgar Allan Poe', correct: true }
            ]
        },
        {
            id: 410, question: '¿Qué palabra describe al “enemigo principal del protagonista”?', difficulty: 'dificil', options: [
                { id: 'a', text: 'Villano' },
                { id: 'b', text: 'Protagonista' },
                { id: 'c', text: 'Antagonista', correct: true },
                { id: 'd', text: 'Clímax' }
            ]
        },
    ],
    'avanzado': [
        { id: 501, question: '¿Qué novela de George Orwell critica los regímenes autoritarios?', difficulty: 'avanzado', options: [
            { id: 'a', text: 'Rebelión en la granja'},
            { id: 'b', text: '1984', correct: true },
            { id: 'c', text: 'Un mundo feliz' },
            { id: 'd', text: 'Fahrenheit 451' }
        ]
    },
    {
        id: 502, question: '¿Qué autor es conocido por sus historias con finales inesperados, como “La casa tomada”?', difficulty: 'avanzado', options: [
            { id: 'a', text: 'Jorge Luis Borges' },
            { id: 'b', text: 'Julio Ramón Ribeyro' },
            { id: 'c', text: 'Julio Cortázar', correct: true },
            { id: 'd', text: 'Adolfo Bioy Casares' }
        ]
    },
    {
        id: 503, question: '¿Qué obra latinoamericana populariza el realismo mágico?', difficulty: 'avanzado', options: [
            { id: 'a', text: 'Pedro Páramo' },
            { id: 'b', text: 'El amor en los tiempos del cólera' },
            { id: 'c', text: 'Doña Bárbara' },
            { id: 'd', text: 'Cien años de soledad', correct: true }
        ]
    },
    {
        id: 504, question: '¿Qué libro de J.R.R. Tolkien inicia la saga de El Señor de los Anillos?', difficulty: 'avanzado', options: [
            { id: 'a', text: 'La comunidad del anillo' },
            { id: 'b', text: 'Las dos torres' },
            { id: 'c', text: 'El retorno del rey' },
            { id: 'd', text: 'El hobbit', correct: true }
        ]
    },
    {
        id: 505, question: '¿Qué autor creó al detective Hércules Poirot?', difficulty: 'avanzado', options: [
            { id: 'a', text: 'Agatha Christie', correct: true },
            { id: 'b', text: 'Arthur Conan Doyle' },
            { id: 'c', text: 'Dashiell Hammett' },
            { id: 'd', text: 'Edgar Allan Poe' }
        ]
    },
    {
        id: 506, question: '¿Qué novela de Stephen King trata sobre una escritora secuestrada por una fanática?', difficulty: 'avanzado', options: [
            { id: 'a', text: 'It' },
            { id: 'b', text: 'Misery', correct: true },
            { id: 'c', text: 'El resplandor' },
            { id: 'd', text: 'Carrie' }
        ]
    },
    {
        id: 507, question: '¿Qué libro fue una inspiración importante para la saga Los juegos del hambre?', difficulty: 'avanzado', options: [
            { id: 'a', text: 'Divergente' },
            { id: 'b', text: 'Maze Runner' },
            { id: 'c', text: 'Battle Royale', correct: true },
            { id: 'd', text: 'El corredor del laberinto' }
        ]
    },
    {
        id: 508, question: '¿Qué autor de fantasía escribió Canción de hielo y fuego (base de Game of Thrones)?', difficulty: 'avanzado', options: [
            { id: 'a', text: 'J.R.R. Tolkien' },
            { id: 'b', text: 'Patrick Rothfuss' },
            { id: 'c', text: 'Brandon Sanderson' },
            { id: 'd', text: 'George R.R. Martin', correct: true }
        ]
    },
    {
        id: 509, question: '¿Qué escritora argentina es autora de Las cosas que perdimos en el fuego?', difficulty: 'avanzado', options: [
            { id: 'a', text: 'Samanta Schweblin' },
            { id: 'b', text: 'Mariana Enriquez', correct: true },
            { id: 'c', text: 'Silvina Ocampo' },
            { id: 'd', text: 'Jorge Luis Borges' }
        ]
    },
    {
        id: 510, question: '¿Qué libro narra la historia de un niño que sobrevive en una balsa con un tigre?', difficulty: 'avanzado', options: [
            { id: 'a', text: 'La vida de Pi', correct: true },
            { id: 'b', text: 'El hobbit' },
            { id: 'c', text: 'El niño con el pijama de rayas' },
            { id: 'd', text: 'El principito' }
        ]
    },
    ],
};
