export type AnswerOptionDTO = {
  id: string;
  text: string;
  correct?: boolean;
};

export type QuestionDTO = {
  id: number;
  question: string;
  options: AnswerOptionDTO[];
  difficulty?: 'muy facil' | 'facil' | 'medio' | 'dificil' | 'avanzado';
};

export type QuizDTO = {
  id: number;
  questions: QuestionDTO[];
};
