import type { QuizDTO } from "../dto/QuestionDTO";

const MOCK_QUIZ: QuizDTO = {
  id: 1,
  questions: [ 
    {
      id: 1,
      question: "¿Quién escribió 'Cien años de soledad'?",
      options: [
        { id: 'a', text: 'Gabriel García Márquez', correct: true },
        { id: 'b', text: 'Jorge Luis Borges' },
        { id: 'c', text: 'Pablo Neruda' },
        { id: 'd', text: 'Mario Vargas Llosa' }
      ]
    },
    {
      id: 2,
      question: "¿Cuál es el género de 'El Aleph'?",
      options: [
        { id: 'a', text: 'Cuento', correct: true },
        { id: 'b', text: 'Novela' },
        { id: 'c', text: 'Poesía' },
        { id: 'd', text: 'Ensayo' }
      ]
    }
  ]
};

export const fetchMockQuiz = async (): Promise<QuizDTO> => {
  await new Promise((r) => setTimeout(r, 250));
  return MOCK_QUIZ;
};
